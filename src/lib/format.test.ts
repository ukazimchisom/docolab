import { describe, it, expect, vi, afterEach } from "vitest";
import { formatRelativeTime } from "./format";

describe("formatRelativeTime", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'Just now' for a timestamp seconds ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T12:00:30Z"));
    const thirtySecondsAgo = new Date("2026-01-01T12:00:00Z");
    expect(formatRelativeTime(thirtySecondsAgo)).toBe("Just now");
  });

  it("returns minutes for a timestamp under an hour ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T12:12:00Z"));
    const twelveMinutesAgo = new Date("2026-01-01T12:00:00Z");
    expect(formatRelativeTime(twelveMinutesAgo)).toBe("12m ago");
  });

  it("returns hours for a timestamp under a day ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T15:00:00Z"));
    const threeHoursAgo = new Date("2026-01-01T12:00:00Z");
    expect(formatRelativeTime(threeHoursAgo)).toBe("3h ago");
  });

  it("returns days for a timestamp a day or more ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-05T12:00:00Z"));
    const twoDaysAgo = new Date("2026-01-03T12:00:00Z");
    expect(formatRelativeTime(twoDaysAgo)).toBe("2d ago");
  });
});
