// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import { generateSummary } from "./gemini";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

function replyWith(text: string) {
  return jsonResponse({ candidates: [{ content: { parts: [{ text }] } }] });
}

describe("generateSummary", () => {
  it("reports 'not-configured' when there is no API key", async () => {
    const fetchImpl = vi.fn<typeof fetch>();

    const result = await generateSummary("prompt", { apiKey: "", fetchImpl });

    expect(result).toEqual({ ok: false, error: "not-configured" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("returns the trimmed summary text on success", async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(replyWith("  - A\n- B  "));

    const result = await generateSummary("prompt", { apiKey: "k", fetchImpl });

    expect(result).toEqual({ ok: true, summary: "- A\n- B" });
  });

  it("sends the key in a header, never in the URL", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(replyWith("ok"));

    await generateSummary("prompt", {
      apiKey: "secret-key",
      model: "test-model",
      fetchImpl,
    });

    const [url, init] = fetchImpl.mock.calls[0];
    expect(String(url)).toContain("test-model:generateContent");
    expect(String(url)).not.toContain("secret-key");
    expect((init?.headers as Record<string, string>)["x-goog-api-key"]).toBe(
      "secret-key",
    );
  });

  it("joins multiple response parts", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      jsonResponse({
        candidates: [
          { content: { parts: [{ text: "One " }, { text: "Two" }] } },
        ],
      }),
    );

    const result = await generateSummary("prompt", { apiKey: "k", fetchImpl });

    expect(result).toEqual({ ok: true, summary: "One Two" });
  });

  it("maps HTTP 429 to 'rate-limited'", async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse({ error: {} }, 429));

    const result = await generateSummary("prompt", { apiKey: "k", fetchImpl });

    expect(result).toEqual({ ok: false, error: "rate-limited" });
  });

  it("maps other HTTP errors and network failures to 'failed'", async () => {
    const serverError = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse({ error: {} }, 500));
    const networkError = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new Error("network down"));

    expect(
      await generateSummary("prompt", { apiKey: "k", fetchImpl: serverError }),
    ).toEqual({ ok: false, error: "failed" });
    expect(
      await generateSummary("prompt", { apiKey: "k", fetchImpl: networkError }),
    ).toEqual({ ok: false, error: "failed" });
  });

  it("maps a blocked prompt to 'blocked'", async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        jsonResponse({ promptFeedback: { blockReason: "SAFETY" } }),
      );

    const result = await generateSummary("prompt", { apiKey: "k", fetchImpl });

    expect(result).toEqual({ ok: false, error: "blocked" });
  });

  it("maps an answer with no text to 'empty'", async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse({ candidates: [] }));

    const result = await generateSummary("prompt", { apiKey: "k", fetchImpl });

    expect(result).toEqual({ ok: false, error: "empty" });
  });
});
