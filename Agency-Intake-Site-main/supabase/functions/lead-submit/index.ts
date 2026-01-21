// deno-lint-ignore-file
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const Lead = z.object({
	name: z.string().min(2),
	company: z.string().min(2),
	role: z.enum(["Owner","Manager","Employee","Investor","Other"]),
	email: z.string().email(),
	urgency: z.enum(["Soon","No Rush"]),
	turnstileToken: z.string().optional()
});

async function verifyTurnstile(token?: string, ip?: string) {
	if (!token) return Deno.env.get("NODE_ENV") !== "production";
	const body = new URLSearchParams({ secret: Deno.env.get("TURNSTILE_SECRET_KEY")!, response: token });
	if (ip) body.set("remoteip", ip);
	const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body }).then(r => r.json());
	return resp?.success === true;
}

serve(async (req) => {
	if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: cors() });
	if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: cors() });
	try {
		const json = await req.json();
		const parsed = Lead.parse(json);
		const isDevBypass = Deno.env.get("NODE_ENV") !== "production" && parsed.turnstileToken === 'placeholder-token'
		const ok = isDevBypass ? true : await verifyTurnstile(parsed.turnstileToken, req.headers.get("CF-Connecting-IP") ?? undefined);
		if (!ok) return new Response(JSON.stringify({ error: "captcha_failed" }), { status: 400, headers: cors() });

		const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
		const { data, error } = await supabase.from("leads").insert({
			name: parsed.name,
			company: parsed.company,
			role: parsed.role,
			email: parsed.email,
			urgency: parsed.urgency
		}).select("id").single();
		if (error) throw error;
		return new Response(JSON.stringify({ ok: true, id: data.id }), { status: 201, headers: { "content-type": "application/json", ...cors() } });
	} catch (e) {
		return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { status: 400, headers: cors() });
	}
});

function cors() {
	return {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Authorization"
	};
}


