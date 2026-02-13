// ========================================
// Tests for utility functions
// cn(), deepEqual, and performance hooks
// ========================================

import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

// ========================================
// cn() — Tailwind class merge utility
// ========================================
describe("cn utility", () => {
  it("merges simple class strings", () => {
    const result = cn("text-red-500", "bg-blue-500");
    expect(result).toContain("text-red-500");
    expect(result).toContain("bg-blue-500");
  });

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", "visible");
    expect(result).toContain("base");
    expect(result).toContain("visible");
    expect(result).not.toContain("hidden");
  });

  it("handles undefined and null inputs", () => {
    const result = cn("base", undefined, null, "active");
    expect(result).toContain("base");
    expect(result).toContain("active");
  });

  it("resolves tailwind conflicts (last wins)", () => {
    const result = cn("p-4", "p-6");
    expect(result).toBe("p-6");
  });

  it("handles empty input", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("handles array inputs via clsx", () => {
    const result = cn(["text-sm", "font-bold"]);
    expect(result).toContain("text-sm");
    expect(result).toContain("font-bold");
  });
});
