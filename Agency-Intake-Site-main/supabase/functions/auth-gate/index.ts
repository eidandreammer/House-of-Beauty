import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const { email, password, mode = "signin", turnstileToken } = await req.json();

  // Verify captcha
  const ok = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: Deno.env.get("TURNSTILE_SECRET_KEY")!,
      response: turnstileToken
    })
  }).then(r => r.json()).then(j => j.success === true);
  if (!ok) return new Response(JSON.stringify({ error: "captcha_failed" }), { status: 400 });

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  if (mode === "signup") {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,                 // or email_confirm: false + invite flow
      email_confirm: true
    });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    return new Response(JSON.stringify({ ok: true, userId: data.user?.id }), { status: 201 });
  } else {
    // For classic sign-in, you normally use client SDK.
    // This gate simply green-lights after captcha.
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }
});
