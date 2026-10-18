import { describe, it, expect } from "vitest";
import { getFirstName, getGreetingForHour, buildGreeting } from "./greeting";

describe("getFirstName", () => {
  it("returns the first word of a full name", () => {
    expect(getFirstName("Andy Rivers")).toBe("Andy");
  });

  it("ignores extra whitespace", () => {
    expect(getFirstName("  Ada   Obi ")).toBe("Ada");
  });

  it("returns a single name as it is", () => {
    expect(getFirstName("Chisom")).toBe("Chisom");
  });

  it("returns null for empty, blank, null or undefined input", () => {
    expect(getFirstName("")).toBeNull();
    expect(getFirstName("   ")).toBeNull();
    expect(getFirstName(null)).toBeNull();
    expect(getFirstName(undefined)).toBeNull();
  });
});

describe("getGreetingForHour", () => {
  it("says good morning before noon", () => {
    expect(getGreetingForHour(0)).toBe("Good morning");
    expect(getGreetingForHour(11)).toBe("Good morning");
  });

  it("says good afternoon from noon until 6pm", () => {
    expect(getGreetingForHour(12)).toBe("Good afternoon");
    expect(getGreetingForHour(17)).toBe("Good afternoon");
  });

  it("says good evening from 6pm", () => {
    expect(getGreetingForHour(18)).toBe("Good evening");
    expect(getGreetingForHour(23)).toBe("Good evening");
  });
});

describe("buildGreeting", () => {
  it("combines the time-based greeting with the name", () => {
    expect(buildGreeting(20, "Andy")).toBe("Good evening, Andy!");
  });

  it("uses a neutral greeting while the hour is unknown", () => {
    expect(buildGreeting(null, "Andy")).toBe("Welcome back, Andy!");
  });

  it("leaves the name out when there isn't one", () => {
    expect(buildGreeting(9, null)).toBe("Good morning!");
  });
});
