import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MetalText } from "./MetalText";
import { COLORS } from "../../constants/Colors";

describe("MetalText", () => {
  it("renders children", () => {
    render(<MetalText>Hello</MetalText>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies default color from COLORS", () => {
    const { container } = render(<MetalText>X</MetalText>);
    const el = container.querySelector("span");
    expect(el).toHaveStyle({ color: COLORS.yellow.button });
  });

  it("allows overriding color and fontSize", () => {
    const { container } = render(
      <MetalText color="#ff00ff" fontSize="2rem">
        Z
      </MetalText>,
    );
    const el = container.querySelector("span");
    expect(el).toHaveStyle({ color: "#ff00ff", fontSize: "2rem" });
  });
});
