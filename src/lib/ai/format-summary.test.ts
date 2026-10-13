import { describe, it, expect } from "vitest";
import { parseSummaryBullets, bulletsToText } from "./format-summary";

describe("parseSummaryBullets", () => {
  it("strips dash, asterisk and bullet-character markers", () => {
    expect(parseSummaryBullets("- one\n* two\n\u2022 three")).toEqual([
      "one",
      "two",
      "three",
    ]);
  });

  it("strips numbered list markers", () => {
    expect(parseSummaryBullets("1. first\n2) second")).toEqual([
      "first",
      "second",
    ]);
  });

  it("removes bold markers", () => {
    expect(parseSummaryBullets("- **Key:** the value")).toEqual([
      "Key: the value",
    ]);
  });

  it("ignores blank lines and extra whitespace", () => {
    expect(parseSummaryBullets("\n\n   - a  \n\n")).toEqual(["a"]);
  });

  it("keeps plain text that has no marker", () => {
    expect(parseSummaryBullets("Just a sentence.")).toEqual([
      "Just a sentence.",
    ]);
  });

  it("does not treat *emphasis* as a list marker", () => {
    expect(parseSummaryBullets("*italic* start")).toEqual(["*italic* start"]);
  });
});

describe("bulletsToText", () => {
  it("joins bullets as a dash list", () => {
    expect(bulletsToText(["a", "b"])).toBe("- a\n- b");
  });
});
