import asyncio, os, re, json, pathlib, hashlib, mimetypes, tldextract
from urllib.parse import urlparse, urljoin, urldefrag
from playwright.async_api import async_playwright

# ------------ Config defaults ------------
DEFAULT_MAX_PAGES   = 200
DEFAULT_MAX_DEPTH   = 3
NAV_TIMEOUT_MS      = 30000
NETWORK_IDLE_MS     = 1500
CONCURRENCY_PAGES   = 4
BLOCK_HOST_PATTERNS = [r"googletagmanager\.com", r"google-analytics\.com", r"hotjar\.com",
                       r"facebook\.com", r"doubleclick\.net"]
SAVE_CONTENT_TYPES  = ("text/html", "text/css", "application/javascript", "application/x-javascript",
                       "image/", "font/")

# ------------ Helpers ------------
def sanitize_path(p: str) -> str:
    # Keep directory structure; ensure filename; strip query
    u = urlparse(p)
    path = u.path
    if not path or path.endswith("/"):
        path = path + "index.html"
    return path

def out_path(base_dir: pathlib.Path, url: str, content_type: str) -> pathlib.Path:
    u = urlparse(url)
    safe_host = u.netloc.replace(":", "_")
    path = sanitize_path(url)
    target = base_dir / safe_host / path.lstrip("/")
    if content_type.startswith("text/html") and not target.name.endswith(".html"):
        target = target.with_suffix(".html")
    target.parent.mkdir(parents=True, exist_ok=True)
    return target

def is_same_origin(seed, candidate) -> bool:
    a, b = urlparse(seed), urlparse(candidate)
    return (a.scheme, a.netloc) == (b.scheme, b.netloc)

def normalize_link(current_url, href):
    if not href:
        return None
    href = href.strip()
    if href.startswith("mailto:") or href.startswith("tel:") or href.startswith("javascript:"):
        return None
    try:
        absu = urljoin(current_url, href)
        absu, _frag = urldefrag(absu)
        return absu
    except Exception:
        return None

def matches_blocklist(url: str) -> bool:
    return any(re.search(p, url) for p in BLOCK_HOST_PATTERNS)

# ------------ Core scraper ------------
class SiteScraper:
    def __init__(self, start_url, outdir, max_depth, max_pages, same_origin=True):
        self.start_url   = start_url
        self.outdir      = pathlib.Path(outdir)
        self.max_depth   = max_depth
        self.max_pages   = max_pages
        self.same_origin = same_origin
        self.seed_origin = f"{urlparse(start_url).scheme}://{urlparse(start_url).netloc}"

        self.to_visit = asyncio.Queue()
        self.seen     = set()
        self.saved    = set()
        self.page_count = 0

        self.ui_inventory = {
            "seed": self.start_url,
            "pages": [],
            "fonts": set(),
            "colors": set(),
            "buttons": [],
            "links": [],
            "css_variables": {},
            "canvases": [],
            "interactive_controls": [],
            "components": [],
        }

    async def run(self):
        async with async_playwright() as pw:
            browser = await pw.chromium.launch(headless=True)
            ctx = await browser.new_context(user_agent=self._ua(), ignore_https_errors=True)
            await self.to_visit.put((self.start_url, 0))

            # Intercept responses to save assets
            ctx.on("response", self._handle_response)

            sem = asyncio.Semaphore(CONCURRENCY_PAGES)
            workers = [asyncio.create_task(self._worker(ctx, sem)) for _ in range(CONCURRENCY_PAGES)]
            await self.to_visit.join()
            for w in workers:
                w.cancel()

            # finalize inventory
            self.ui_inventory["fonts"]  = sorted(self.ui_inventory["fonts"])
            self.ui_inventory["colors"] = sorted(self.ui_inventory["colors"])
            inv_path = self.outdir / "ui_inventory.json"
            inv_path.parent.mkdir(parents=True, exist_ok=True)
            inv_path.write_text(json.dumps(self.ui_inventory, indent=2), encoding="utf-8")

            await ctx.close()
            await browser.close()

    def _ua(self):
        return ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36")

    async def _worker(self, ctx, sem):
        while True:
            try:
                url, depth = await self.to_visit.get()
            except asyncio.CancelledError:
                return
            try:
                async with sem:
                    if self.page_count >= self.max_pages:
                        return
                    await self._scrape_page(ctx, url, depth)
            finally:
                self.to_visit.task_done()

    async def _scrape_page(self, ctx, url, depth):
        if url in self.seen:
            return
        self.seen.add(url)
        if self.same_origin and not is_same_origin(self.start_url, url):
            return
        if matches_blocklist(url):
            return

        page = await ctx.new_page()
        # Desktop & mobile screenshots: create a mobile page too
        mobile = await ctx.new_page()
        await mobile.set_viewport_size({"width": 390, "height": 844})

        try:
            await page.goto(url, wait_until="networkidle", timeout=NAV_TIMEOUT_MS)
        except Exception:
            await page.close(); await mobile.close()
            return

        self.page_count += 1
        print(f"[{self.page_count}] {url}")

        # Save rendered HTML snapshot (post-JS)
        try:
            rendered_html = await page.content()
            html_path = out_path(self.outdir, url, "text/html")
            html_path.write_text(rendered_html, encoding="utf-8")
        except Exception:
            pass

        # Screenshots
        try:
            ss_dir = self.outdir / "_screenshots"
            ss_dir.mkdir(parents=True, exist_ok=True)
            fname = hashlib.sha1(url.encode()).hexdigest()[:12]
            await page.screenshot(path=str(ss_dir / f"{fname}_desktop.png"), full_page=True)
            await mobile.goto(url, wait_until="networkidle", timeout=NAV_TIMEOUT_MS)
            await mobile.screenshot(path=str(ss_dir / f"{fname}_mobile.png"), full_page=True)
        except Exception:
            pass

        # UI inventory (fonts, colors, links, buttons)
        try:
            ui = await page.evaluate("""
            () => {
              const styles = getComputedStyle(document.documentElement);
              const gather = () => {
                const fonts = new Set();
                const colors = new Set();
                const links = [];
                const buttons = [];
                const canvases = [];
                const controls = [];
                const components = [];
                const push = (s) => {
                  const f = s.fontFamily || s.font || "";
                  if (f) fonts.add(f);
                  // heuristic color sampling
                  ["color","backgroundColor","borderTopColor"].forEach(k=>{
                    const v = s[k];
                    if (v && v.startsWith("rgb")) colors.add(v);
                  });
                };
                document.querySelectorAll("*").forEach(el=>{
                  const s = getComputedStyle(el);
                  if (el.tagName === "A") links.push({text: el.textContent.trim(), href: el.href});
                  if (el.tagName === "BUTTON" || el.getAttribute("role")==="button" || s.cursor==="pointer") {
                    const rect = el.getBoundingClientRect();
                    if (rect.width>=60 && rect.height>=28) {
                      buttons.push({text: el.textContent.trim(), w: rect.width, h: rect.height});
                    }
                  }
                  if (el.tagName === "CANVAS") {
                    const rect = el.getBoundingClientRect();
                    canvases.push({w: Math.round(rect.width), h: Math.round(rect.height)});
                  }
                  if (el.matches('input, select, textarea') || el.getAttribute('role') === 'slider') {
                    const type = el.getAttribute('type') || el.tagName.toLowerCase();
                    const rect = el.getBoundingClientRect();
                    controls.push({type, w: Math.round(rect.width), h: Math.round(rect.height)});
                  }
                  push(s);
                });
                const textBody = document.body.innerText.toLowerCase();
                if (document.querySelector('canvas') && /color wheel|harmony|analogous|triad|tetrad/.test(textBody)) {
                  components.push({ kind: 'color_wheel', confidence: 0.7 });
                }
                return {fonts: Array.from(fonts).slice(0,200), colors: Array.from(colors).slice(0,200), links, buttons, canvases, controls, components};
              };
              return gather();
            }
            """)
            self.ui_inventory["pages"].append({"url": url, "links": ui["links"][:200]})
            for f in ui.get("fonts", []):
                self.ui_inventory["fonts"].add(f)
            for c in ui.get("colors", []):
                self.ui_inventory["colors"].add(c)
            self.ui_inventory["buttons"].extend(ui.get("buttons", [])[:100])
            self.ui_inventory["canvases"].extend(ui.get("canvases", []))
            self.ui_inventory["interactive_controls"].extend(ui.get("controls", []))
            self.ui_inventory["components"].extend(ui.get("components", []))
        except Exception:
            pass

        # CSS variables (best-effort)
        try:
            css_vars = await page.evaluate("""
            () => {
              const vars = {};
              const collectVars = (style) => {
                if (!style) return;
                for (let i = 0; i < style.length; i++) {
                  const prop = style[i];
                  if (prop.startsWith('--')) {
                    vars[prop] = style.getPropertyValue(prop).trim();
                  }
                }
              };
              collectVars(document.documentElement.style);
              for (const sheet of Array.from(document.styleSheets)) {
                try {
                  const rules = sheet.cssRules || [];
                  for (const rule of Array.from(rules)) {
                    if (rule.style) collectVars(rule.style);
                  }
                } catch (e) {}
              }
              return vars;
            }
            """)
            for k, v in (css_vars or {}).items():
                if isinstance(v, str) and v:
                    self.ui_inventory["css_variables"][k] = v
        except Exception:
            pass

        # Enqueue new links
        try:
            hrefs = await page.eval_on_selector_all("a[href]", "els => els.map(a => a.getAttribute('href'))")
            for href in hrefs:
                nxt = normalize_link(url, href)
                if not nxt:
                    continue
                # stay same-origin if set
                if self.same_origin and not is_same_origin(self.start_url, nxt):
                    continue
                # skip assets
                if re.search(r"\.(pdf|zip|png|jpe?g|webp|gif|svg|ico|mp4|mov|mp3|wav)$", nxt, re.I):
                    continue
                if nxt not in self.seen:
                    d2 = depth + 1
                    if d2 <= self.max_depth:
                        await self.to_visit.put((nxt, d2))
        except Exception:
            pass

        await page.close()
        await mobile.close()

    async def _handle_response(self, response):
        try:
            url = response.url
            if matches_blocklist(url):
                return
            ctype = response.headers.get("content-type", "")
            if not ctype:
                return
            if not any(ctype.startswith(t) for t in SAVE_CONTENT_TYPES):
                return
            if url in self.saved:
                return
            body = await response.body()
            if not body:
                return
            path = out_path(self.outdir, url, ctype)
            path.parent.mkdir(parents=True, exist_ok=True)
            # Guess extension if missing (rare)
            if not path.suffix:
                ext = mimetypes.guess_extension(ctype.split(";")[0].strip()) or ".bin"
                path = path.with_suffix(ext)
            with open(path, "wb") as f:
                f.write(body)
            self.saved.add(url)
        except Exception:
            pass

# ------------ CLI ------------
if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description="Playwright Chromium site scraper for UI analysis.")
    ap.add_argument("url", help="Start URL (e.g., https://www.vistaprint.com/clothing-bags/t-shirts?srsltid=AfmBOor1MLP8qduLkiesj8v8iN8_h1xHiPX0vYuMtjivm8FhpDM-ZXNz)")
    ap.add_argument("-o", "--out", default="scrape_output", help="Output directory")
    ap.add_argument("--max-depth", type=int, default=DEFAULT_MAX_DEPTH)
    ap.add_argument("--max-pages", type=int, default=DEFAULT_MAX_PAGES)
    ap.add_argument("--cross-origin", action="store_true", help="Allow crawling off-site links")
    args = ap.parse_args()

    scraper = SiteScraper(
        start_url=args.url,
        outdir=args.out,
        max_depth=args.max_depth,
        max_pages=args.max_pages,
        same_origin=(not args.cross_origin),
    )
    asyncio.run(scraper.run())
