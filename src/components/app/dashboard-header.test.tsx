import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardHeader } from "./dashboard-header";

function setLocalTime(hour: number) {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 0, 15, hour, 0, 0));
}

describe("DashboardHeader", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("greets the user by first name in the evening", () => {
    setLocalTime(20);
    render(<DashboardHeader firstName="Andy" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Good evening, Andy!",
    );
  });

  it("uses a morning greeting early in the day", () => {
    setLocalTime(9);
    render(<DashboardHeader firstName="Ada" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Good morning, Ada!",
    );
  });

  it("leaves the name out when there isn't one", () => {
    setLocalTime(14);
    render(<DashboardHeader firstName={null} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Good afternoon!",
    );
  });
});
