// ========================================
// Component Tests — ToastProvider + useToast hook
//
// Tests toast rendering, auto-dismiss, manual dismiss,
// variants, and hook-outside-provider error.
// ========================================

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import { ToastProvider, useToast } from "@/components/ToastProvider";

// Mock lucide-react
vi.mock("lucide-react", () => ({
  X: ({ className }: { className?: string }) =>
    React.createElement("span", { className, "data-testid": "close-icon" }),
}));

// ── Test consumer component ──────────────────────────────────

function ToastTrigger({ variant }: { variant?: "default" | "success" | "error" }) {
  const { toast } = useToast();
  return (
    <button
      onClick={() =>
        toast({
          title: "Test toast",
          description: "This is a test",
          variant: variant || "default",
        })
      }
    >
      Show Toast
    </button>
  );
}

// ========================================
// Toast rendering
// ========================================
describe("ToastProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders children", () => {
    render(
      <ToastProvider>
        <div>Child content</div>
      </ToastProvider>
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("shows toast when triggered via hook", () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText("Show Toast"));
    expect(screen.getByText("Test toast")).toBeInTheDocument();
    expect(screen.getByText("This is a test")).toBeInTheDocument();
  });

  it("auto-dismisses toast after 3 seconds", () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText("Show Toast"));
    expect(screen.getByText("Test toast")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3100);
    });

    expect(screen.queryByText("Test toast")).not.toBeInTheDocument();
  });

  it("dismisses toast when close button is clicked", () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText("Show Toast"));
    expect(screen.getByText("Test toast")).toBeInTheDocument();

    // Click the close button (parent of the X icon)
    const closeButton = screen.getByTestId("close-icon").closest("button");
    expect(closeButton).toBeTruthy();
    fireEvent.click(closeButton!);

    expect(screen.queryByText("Test toast")).not.toBeInTheDocument();
  });

  it("supports multiple toasts simultaneously", () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText("Show Toast"));
    fireEvent.click(screen.getByText("Show Toast"));
    fireEvent.click(screen.getByText("Show Toast"));

    const toasts = screen.getAllByText("Test toast");
    expect(toasts.length).toBe(3);
  });

  it("renders success variant with correct styling class", () => {
    render(
      <ToastProvider>
        <ToastTrigger variant="success" />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText("Show Toast"));
    const title = screen.getByText("Test toast");
    expect(title.className).toContain("green");
  });

  it("renders error variant with correct styling class", () => {
    render(
      <ToastProvider>
        <ToastTrigger variant="error" />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText("Show Toast"));
    const title = screen.getByText("Test toast");
    expect(title.className).toContain("red");
  });
});

// ========================================
// useToast hook — error case
// ========================================
describe("useToast — outside provider", () => {
  it("throws when used outside ToastProvider", () => {
    function BadComponent() {
      useToast();
      return null;
    }

    // Suppress React error boundary console noise
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<BadComponent />)).toThrow(
      "useToast must be used within a ToastProvider"
    );

    spy.mockRestore();
  });
});
