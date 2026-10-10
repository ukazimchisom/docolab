import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToolbarButton } from "./editor-toolbar";

vi.mock("@/lib/upload-image", () => ({
  uploadDocumentImage: vi.fn(),
}));

function renderButton(active: boolean, onClick = vi.fn()) {
  render(
    <ToolbarButton label="Bold" active={active} onClick={onClick}>
      <span>B</span>
    </ToolbarButton>,
  );
  return onClick;
}

describe("ToolbarButton", () => {
  it("is findable as a button by its label", () => {
    renderButton(false);
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = renderButton(false);

    await user.click(screen.getByRole("button", { name: "Bold" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("reports aria-pressed=true when active", () => {
    renderButton(true);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("reports aria-pressed=false when inactive", () => {
    renderButton(false);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("never acts as a submit button", () => {
    renderButton(false);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "type",
      "button",
    );
  });
});
