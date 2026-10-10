import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it.each([
    ["draft", "Draft"],
    ["in-progress", "In Progress"],
    ["review", "Review"],
    ["complete", "Complete"],
  ] as const)("shows the right label for the %s status", (status, label) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
