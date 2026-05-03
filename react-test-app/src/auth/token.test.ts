import { afterEach, describe, expect, it } from "vitest";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "./token";

describe("token storage", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("round-trips access token", () => {
    setAccessToken("abc123");
    expect(getAccessToken()).toBe("abc123");
  });

  it("clearAccessToken removes token", () => {
    setAccessToken("x");
    clearAccessToken();
    expect(getAccessToken()).toBeNull();
  });
});
