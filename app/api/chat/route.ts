import { NextRequest, NextResponse } from "next/server";
import {
  capabilities,
  contactMethods,
  education,
  profile,
  projects,
  skillCategories,
  socialLinks,
  stats,
  timeline,
} from "@/lib/portfolio-data";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
const TELEGRAM_MESSAGE_LIMIT = 3900;
const SESSION_COOKIE = "portfolio_chat_session";
const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1400;
const MAX_SESSION_MESSAGES = 50;
const DIRECT_CONTACT_MESSAGE =
  "This chat session has reached its message limit. Please contact Hector directly by email at mern2025@outlook.com, WhatsApp at +1 (856) 495-1739, Telegram at @yesteru, or Microsoft Teams on request.";

function withoutIcon<T extends { icon?: unknown }>(item: T) {
  const data = { ...item };
  delete data.icon;

  return data;
}

function buildPortfolioContext() {
  return JSON.stringify(
    {
      profile,
      stats,
      capabilities: capabilities.map(withoutIcon),
      skills: skillCategories.map(withoutIcon),
      workHistory: timeline,
      projects,
      education: withoutIcon(education),
      contact: contactMethods.map(withoutIcon),
      socialLinks: socialLinks.map(withoutIcon),
    },
    null,
    2,
  );
}

function normalizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((message): message is ChatMessage => {
      if (!message || typeof message !== "object") {
        return false;
      }

      const candidate = message as Partial<ChatMessage>;
      return (candidate.role === "user" || candidate.role === "assistant") && typeof candidate.content === "string";
    })
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, MAX_MESSAGE_LENGTH),
    }));
}

function createSystemPrompt() {
  return `You are Hector's Assistant for Hector Rosales Ortiz.

Represent Hector professionally in first person or as "Hector" depending on the user's wording.
Answer only from the portfolio context below. If a user asks about something not covered, say you do not have that detail and offer a relevant contact path.
Be concise, warm, and useful. Prioritize Hector's AI, full-stack, mobile, cloud, project, experience, education, and contact information.
Do not answer unrelated topics, including general technical questions, coding help, homework, news, entertainment, or advice that is not specifically about Hector, his services, or his portfolio.
Keep every answer under 50 sentences.
Never invent employers, dates, links, credentials, or private personal details.
Tell users that their chat messages are sent directly to Hector.
If the conversation reaches the session limit, tell the user to contact Hector directly by email, WhatsApp, Telegram, or Microsoft Teams on request.

Portfolio context:
${buildPortfolioContext()}`;
}

function formatTelegramExchange({
  userMessage,
  reply,
  sessionId,
}: {
  userMessage: ChatMessage;
  reply: string;
  sessionId: string;
}) {
  const transcript = [`Visitor: ${userMessage.content}`, `Hector's Assistant: ${reply}`].join("\n\n");

  return [`New portfolio chatbot message`, `Session: ${sessionId}`, ``, transcript].join("\n").slice(0, TELEGRAM_MESSAGE_LIMIT);
}

async function sendTelegramExchange({
  userMessage,
  reply,
  sessionId,
}: {
  userMessage: ChatMessage;
  reply: string;
  sessionId: string;
}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return;
  }

  const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatTelegramExchange({ userMessage, reply, sessionId }),
      disable_web_page_preview: true,
    }),
  });

  if (!telegramResponse.ok && process.env.NODE_ENV === "development") {
    console.warn("Telegram transcript forwarding failed", await telegramResponse.text());
  }
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "OpenAI is not configured yet. Add OPENAI_API_KEY to your environment variables.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { messages?: unknown; sessionId?: unknown; messageCount?: unknown }
    | null;
  const messages = normalizeMessages(body?.messages);
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");

  if (!latestUserMessage?.content.trim()) {
    return NextResponse.json({ error: "Please send a message first." }, { status: 400 });
  }

  const existingSessionId = request.cookies.get(SESSION_COOKIE)?.value;
  const bodySessionId = typeof body?.sessionId === "string" ? body.sessionId : undefined;
  const sessionId = existingSessionId || bodySessionId || crypto.randomUUID();
  const messageCount = typeof body?.messageCount === "number" ? body.messageCount : undefined;
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  if (messageCount && messageCount > MAX_SESSION_MESSAGES) {
    await sendTelegramExchange({ userMessage: latestUserMessage, reply: DIRECT_CONTACT_MESSAGE, sessionId }).catch(() => undefined);

    const response = NextResponse.json({ reply: DIRECT_CONTACT_MESSAGE, sessionId });
    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  }

  const openAiResponse = await fetch(OPENAI_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 520,
      user: sessionId,
      messages: [{ role: "system", content: createSystemPrompt() }, ...messages],
    }),
  });

  if (!openAiResponse.ok) {
    const errorText = await openAiResponse.text();

    return NextResponse.json(
      {
        error: "Hector's Assistant is unavailable right now. Please try again shortly.",
        detail: process.env.NODE_ENV === "development" ? errorText : undefined,
      },
      { status: 502 },
    );
  }

  const data = (await openAiResponse.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const reply = data.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    return NextResponse.json({ error: "Hector's Assistant returned an empty response." }, { status: 502 });
  }

  await sendTelegramExchange({ userMessage: latestUserMessage, reply, sessionId }).catch(() => undefined);

  const response = NextResponse.json({ reply, sessionId });
  response.cookies.set(SESSION_COOKIE, sessionId, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
