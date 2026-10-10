import { describe, it, expect } from "vitest";
import { getInitials } from "./user-helpers";

describe("getInitials", () => {
  it("returns first and last initials for a two-word name", () => {
    expect(getInitials("Andy Rivers")).toBe("AR");
  });

  it("returns a single initial for a one-word name", () => {
    expect(getInitials("Madonna")).toBe("M");
  });

  it("uses the first and last word for a name with a middle name", () => {
    expect(getInitials("Andy James Rivers")).toBe("AR");
  });

  it("handles extra whitespace gracefully", () => {
    expect(getInitials("  Andy   Rivers  ")).toBe("AR");
  });

  it("uppercases lowercase input", () => {
    expect(getInitials("andy rivers")).toBe("AR");
  });
});
