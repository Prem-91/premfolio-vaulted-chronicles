import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id.server";

const MODEL = "openai/gpt-6-astra";
const GATEWAY = "https://ai.gateway.lovable.dev/v1";

const bodySchema = z.object({
  messages: z
    .array(
      z
        .object({
          id: z.string().max(200),
          role: z.enum(["user", "assistant"]),
          parts: z.array(z.object({ type: z.string() }).passthrough()).max(50),
        })
        .passthrough(),
    )
    .min(1)
    .max(20),
});

// Per-instance best-effort limiter (speed bump only).
const hits = new Map<string, { n: number; reset: number }>();
function limited(ip: string) {
  const now = Date.now();
  const b = hits.get(ip);
  if (!b || b.reset < now) {
    hits.set(ip, { n: 1, reset: now + 60_000 });
    return false;
  }
  b.n += 1;
  return b.n > 12;
}

async function buildContext() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [about, projects, exp, skills, ach, moments] = await Promise.all([
    supabaseAdmin
      .from("about_profile")
      .select("name,tagline,long_bio,location,email,github_url,linkedin_url,current_focus")
      .limit(1)
      .maybeSingle(),
    supabaseAdmin
      .from("projects")
      .select("name,description,stack,github_url,live_url,problem,solution,features,challenges,learning,status")
      .order("sort_order"),
    supabaseAdmin.from("experiences").select("title,org,period,detail,kind").order("sort_order"),
    supabaseAdmin.from("skills_groups").select("name,items").order("sort_order"),
    supabaseAdmin.from("achievements").select("*").order("sort_order"),
    supabaseAdmin.from("moments").select("title,event_date,caption").order("sort_order"),
  ]);
  return JSON.stringify({
    profile: about.data,
    projects: projects.data,
    journey: exp.data,
    skills: skills.data,
    achievements: (ach.data ?? []).map(({ id, sort_order, created_at, updated_at, ...rest }: any) => rest),
    moments: moments.data,
  });
}

function textLength(m: UIMessage) {
  return m.parts.reduce((n, p) => n + (p.type === "text" ? p.text.length : 0), 0);
}

export async function handleChat(request: Request) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return Response.json({ error: "Chat is not configured yet." }, { status: 500 });

  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "unknown";
  if (limited(ip)) return Response.json({ error: "Too many messages — please wait a minute." }, { status: 429 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid request." }, { status: 400 });
  const messages = parsed.data.messages as unknown as UIMessage[];
  if (messages.some((m) => m.role === "user" && textLength(m) > 2000))
    return Response.json({ error: "Message is too long (max 2000 characters)." }, { status: 400 });

  const context = await buildContext();
  const instructions = `You are the assistant on Prem Shinde's portfolio website. Answer visitors' questions about Prem using ONLY the portfolio data below.
Rules:
- If the answer is not in the data, say you don't have that information and suggest contacting Prem by email or LinkedIn.
- Never invent facts, dates, numbers, companies or links. Never share or guess a phone number.
- Refer to Prem in the third person. Be concise, friendly and professional. Use short markdown lists when helpful and include links from the data when relevant.
- Politely decline unrelated requests and steer back to Prem's work.

PORTFOLIO DATA (JSON):
${context}`;

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: GATEWAY,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses(MODEL),
    instructions,
    messages: await convertToModelMessages(messages),
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  return withLovableAiGatewayRunIdHeader(
    result.toUIMessageStreamResponse({
      originalMessages: messages,
      onError: (err) => {
        const msg = String((err as any)?.message ?? err);
        if (/402|credit/i.test(msg)) return "The assistant is temporarily unavailable. Please try again later.";
        if (/429|rate/i.test(msg)) return "The assistant is busy right now — please try again in a moment.";
        return "Something went wrong. Please try again.";
      },
    }),
    runIdFetch,
  );
}
