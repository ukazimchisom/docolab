import { describe, it, expect } from "vitest";
import { htmlToMarkdown, toSafeFileName } from "./export";

describe("htmlToMarkdown", () => {
  it("converts headings", () => {
    expect(htmlToMarkdown("<h2>Title</h2>")).toBe("## Title\n");
  });

  it("converts bold and italic text", () => {
    expect(
      htmlToMarkdown("<p>Hello <strong>bold</strong> and <em>italic</em></p>"),
    ).toBe("Hello **bold** and *italic*\n");
  });

  it("converts bullet lists", () => {
    expect(htmlToMarkdown("<ul><li>One</li><li>Two</li></ul>")).toMatch(
      /^-\s+One\n-\s+Two\n$/,
    );
  });

  it("converts numbered lists", () => {
    expect(htmlToMarkdown("<ol><li>One</li><li>Two</li></ol>")).toMatch(
      /^1\.\s+One\n2\.\s+Two\n$/,
    );
  });

  it("converts links", () => {
    expect(
      htmlToMarkdown('<p><a href="https://example.com">Site</a></p>'),
    ).toBe("[Site](https://example.com)\n");
  });

  it("keeps images as Markdown image links", () => {
    expect(
      htmlToMarkdown('<img src="https://example.com/pic.png" alt="">'),
    ).toBe("![](https://example.com/pic.png)\n");
  });

  it("returns an empty string for an empty document", () => {
    expect(htmlToMarkdown("<p></p>")).toBe("");
  });
});

describe("toSafeFileName", () => {
  it("turns a title into a lowercase, hyphenated file name", () => {
    expect(toSafeFileName("My Q3 Plan!", "md")).toBe("my-q3-plan.md");
  });

  it("falls back to 'untitled' when the title has no usable characters", () => {
    expect(toSafeFileName("   ", "md")).toBe("untitled.md");
  });

  it("keeps letters from other languages", () => {
    expect(toSafeFileName("Résumé draft", "pdf")).toBe("résumé-draft.pdf");
  });
});
