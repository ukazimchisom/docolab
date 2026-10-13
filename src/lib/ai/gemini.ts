const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const REQUEST_TIMEOUT_MS = 20_000;

export type SummaryResult =
  | { ok: true; summary: string }
  | {
      ok: false;
      error: "not-configured" | "rate-limited" | "blocked" | "empty" | "failed";
    };

interface GeminiResponse {
  promptFeedback?: { blockReason?: string };
  candidates?: { content?: { parts?: { text?: string }[] } }[];
}

interface GenerateOptions {
  apiKey?: string;
  model?: string;
  fetchImpl?: typeof fetch;
}

export async function generateSummary(
  prompt: string,
  options: GenerateOptions = {},
): Promise<SummaryResult> {
  const apiKey = options.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) return { ok: false, error: "not-configured" };

  const model = options.model ?? process.env.GEMINI_MODEL ?? DEFAULT_MODEL;
  const doFetch = options.fetchImpl ?? fetch;

  let response: Response;
  try {
    response = await doFetch(`${ENDPOINT}/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    return { ok: false, error: "failed" };
  }

  if (response.status === 429) return { ok: false, error: "rate-limited" };
  if (!response.ok) {
    console.error("Gemini request failed with status", response.status);
    return { ok: false, error: "failed" };
  }

  const data = (await response
    .json()
    .catch(() => null)) as GeminiResponse | null;

  if (data?.promptFeedback?.blockReason) return { ok: false, error: "blocked" };

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  return text ? { ok: true, summary: text } : { ok: false, error: "empty" };
}
