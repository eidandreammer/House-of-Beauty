// Deno Edge Function
// deno-lint-ignore-file
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const Intake = z.object({
  // Business Info (from screenshots)
  business_name: z.string().min(2),
  industry: z.string().min(2),
  address: z.string().min(3),
  phone: z.string().min(7),
  domain: z.string().url().optional(),

  // Goals & Pages
  goals: z.array(z.enum(["Calls","Bookings","Orders","Lead Form","Not Sure"])).min(1),
  pages: z.array(z.enum(["Home","Services","Blog","Products","About","Contact","Menu"])).min(1),

  // Color & Typography
  color: z.object({
    selected: z.string(), // hex
    mode: z.enum(["Complementary","Analogous","Split","Triad","Tetrad","Monochrome","Monochrome Tints"]),
    palette: z.array(z.string())
  }),
  typography: z.object({
    headings: z.string(),
    body: z.string(),
    style: z.string().optional(),
    colorMode: z.string().optional()
  }),

  // Templates & Inspiration
  templates: z.array(z.union([
    z.enum(["Style A","Style B"]),
    z.enum(["Template A","Template B"])
  ])).min(1),
  inspiration_urls: z.array(z.string().url()).max(2).optional().default([]),

  // Features
  features: z.array(z.enum([
    "Booking","Gift Cards","Gallery","FAQ","Hours","Chat",
    "Menu Catalog","Testimonials","Blog","Map","Contact Form","Analytics","Not Sure"
  ])).optional().default([]),

  // Admin
  timeline: z.string().optional(),
  plan: z.string().optional(),

  // Org wrapper
  organization: z.object({
    name: z.string().min(2),
    website: z.string().url().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    domain: z.string().optional()
  }),

  // Captcha
  turnstileToken: z.string()
});

async function verifyTurnstile(token: string, ip?: string) {
  const body = new URLSearchParams({
    secret: Deno.env.get("TURNSTILE_SECRET_KEY")!,
    response: token
  });
  if (ip) body.set("remoteip", ip);
  const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body
  }).then(r => r.json());
  return resp?.success === true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  try {
    const json = await req.json();
    const parsed = Intake.parse(json);

    const isDevBypass = Deno.env.get("NODE_ENV") !== "production" && parsed.turnstileToken === 'placeholder-token'
    const ok = isDevBypass ? true : await verifyTurnstile(parsed.turnstileToken, req.headers.get("CF-Connecting-IP") ?? undefined);
    if (!ok) return new Response(JSON.stringify({ error: "captcha_failed" }), { status: 400 });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Upsert org by name
    const { data: org } = await supabase
      .from("organizations")
      .insert({
        name: parsed.organization.name,
        industry: parsed.industry,
        website: parsed.organization.website ?? parsed.domain,
        phone: parsed.phone,
        address: parsed.address,
        domain: parsed.domain
      })
      .select().single();

    const { data: intake, error } = await supabase
      .from("intakes")
      .insert({
        org_id: org.id,
        business_name: parsed.business_name,
        industry: parsed.industry,
        address: parsed.address,
        phone: parsed.phone,
        domain: parsed.domain,
        goals: parsed.goals,
        pages: parsed.pages,
        color: parsed.color,
        typography: parsed.typography,
        templates: parsed.templates,
        inspiration_urls: parsed.inspiration_urls,
        features: parsed.features,
        timeline: parsed.timeline,
        plan: parsed.plan
      })
      .select().single();

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, intakeId: intake.id }), {
      status: 201, 
      headers: { 
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { 
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  }
});
