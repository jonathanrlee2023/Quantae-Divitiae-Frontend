import { describe, expect, it } from "vitest";
import { COLORS } from "./Colors";

describe("COLORS", () => {
  it("exposes core palette keys used by the UI", () => {
    expect(COLORS.cardBackground).toMatch(/^#/);
    expect(COLORS.mainFontColor).toBeDefined();
    expect(COLORS.yellow.button).toBeDefined();
    expect(COLORS.green.button).toBeDefined();
    expect(COLORS.red.button).toBeDefined();
  });

  it("has sector palette entries", () => {
    expect(COLORS.sectorPalette.technology).toBeDefined();
    expect(COLORS.sectorPalette.energy).toBeDefined();
  });
});
