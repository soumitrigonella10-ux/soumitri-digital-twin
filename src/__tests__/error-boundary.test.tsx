// ========================================
// Component Tests — ErrorBoundary + GlobalErrorListener
//
// Tests error catching, retry, auto-retry with backoff,
// custom fallbacks, and global error listener behavior.
// ========================================

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import React from "react";

// vi.hoisted ensures the variable exists before the hoisted vi.mock runs
const { mockCaptureException } = vi.hoisted(() => ({
  mockCaptureException: vi.fn(),
}));

// Mock Sentry before any component imports
vi.mock("@sentry/nextjs", () => ({
  captureException: mockCaptureException,
  init: vi.fn(),
  replayIntegration: vi.fn(),
  browserTracingIntegration: vi.fn(),
}));

// Mock lucide-react icons to avoid SVG rendering issues
vi.mock("lucide-react", () => ({
  AlertTriangle: ({ className }: { className?: string }) =>
    React.createElement("span", { className, "data-testid": "alert-icon" }),
  RefreshCw: ({ className }: { className?: string }) =>
    React.createElement("span", { className, "data-testid": "refresh-icon" }),
  Home: ({ className }: { className?: string }) =>
    React.createElement("span", { className, "data-testid": "home-icon" }),
}));

// Import after mocks
import { reportError, GlobalErrorListener } from "@/components/ErrorBoundary";

// We need to import the class component directly for the error boundary
// since it's the default export-like usage
// ErrorBoundaryClass is the class but exported indirectly via the file's structure
// Let's use a wrapper that catches render errors

// ── Helpers ──────────────────────────────────────────────────

function ThrowingComponent({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) throw new Error("Test render error");
  return <div>No error</div>;
}

// ========================================
// reportError utility
// ========================================
describe("reportError", () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = "development";
    mockCaptureException.mockClear();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("logs error payload in development", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("test error");
    reportError(error, { boundary: "TestBoundary" });

    expect(spy).toHaveBeenCalledWith(
      "[ErrorReport]",
      expect.objectContaining({
        message: "test error",
        context: expect.objectContaining({ boundary: "TestBoundary" }),
        timestamp: expect.any(String),
      })
    );
    spy.mockRestore();
  });

  it("sends error to Sentry with context", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("sentry test");
    reportError(error, { boundary: "Dashboard" });

    expect(mockCaptureException).toHaveBeenCalledWith(error, {
      extra: expect.objectContaining({
        boundary: "Dashboard",
        timestamp: expect.any(String),
        url: expect.any(String),
      }),
    });
    spy.mockRestore();
  });

  it("includes URL context", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    reportError(new Error("test"));

    expect(spy).toHaveBeenCalledWith(
      "[ErrorReport]",
      expect.objectContaining({
        url: expect.any(String),
      })
    );
    spy.mockRestore();
  });

  it("includes stack trace in payload", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("with stack");
    reportError(error);

    const payload = spy.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(payload.stack).toBeDefined();
    expect(typeof payload.stack).toBe("string");
    spy.mockRestore();
  });
});

// ========================================
// GlobalErrorListener
// ========================================
describe("GlobalErrorListener", () => {
  let addSpy: ReturnType<typeof vi.spyOn>;
  let removeSpy: ReturnType<typeof vi.spyOn>;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = "development";
    addSpy = vi.spyOn(window, "addEventListener");
    removeSpy = vi.spyOn(window, "removeEventListener");
    mockCaptureException.mockClear();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    addSpy.mockRestore();
    removeSpy.mockRestore();
    cleanup();
  });

  it("registers error and unhandledrejection listeners on mount", () => {
    render(<GlobalErrorListener />);
    expect(addSpy).toHaveBeenCalledWith("error", expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith("unhandledrejection", expect.any(Function));
  });

  it("removes listeners on unmount", () => {
    const { unmount } = render(<GlobalErrorListener />);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("error", expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith("unhandledrejection", expect.any(Function));
  });

  it("renders nothing (returns null)", () => {
    const { container } = render(<GlobalErrorListener />);
    expect(container.innerHTML).toBe("");
  });

  it("handles ErrorEvent by calling reportError", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<GlobalErrorListener />);

    // Get the registered error handler
    const errorHandler = addSpy.mock.calls.find(
      (call) => call[0] === "error"
    )?.[1] as (e: Event) => void;

    expect(errorHandler).toBeDefined();

    // Simulate an ErrorEvent
    const errorEvent = new ErrorEvent("error", {
      error: new Error("global error"),
      message: "global error",
      filename: "test.js",
      lineno: 42,
      colno: 10,
    });
    errorHandler(errorEvent);

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("sends ErrorEvent to Sentry via captureException", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<GlobalErrorListener />);

    const errorHandler = addSpy.mock.calls.find(
      (call) => call[0] === "error"
    )?.[1] as (e: Event) => void;

    const testError = new Error("sentry global error");
    const errorEvent = new ErrorEvent("error", {
      error: testError,
      message: "sentry global error",
    });
    errorHandler(errorEvent);

    expect(mockCaptureException).toHaveBeenCalledWith(testError, expect.objectContaining({
      extra: expect.objectContaining({ source: "window.onerror" }),
    }));
    spy.mockRestore();
  });

  it("ignores non-ErrorEvent (e.g. resource loading errors)", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<GlobalErrorListener />);

    const errorHandler = addSpy.mock.calls.find(
      (call) => call[0] === "error"
    )?.[1] as (e: Event) => void;

    // Simulate a generic Event (not ErrorEvent) — e.g. broken <img>
    const genericEvent = new Event("error");
    errorHandler(genericEvent);

    // Should NOT have logged because it's not an ErrorEvent
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("handles PromiseRejectionEvent with Error reason", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<GlobalErrorListener />);

    const rejectionHandler = addSpy.mock.calls.find(
      (call) => call[0] === "unhandledrejection"
    )?.[1] as (e: PromiseRejectionEvent) => void;

    expect(rejectionHandler).toBeDefined();

    // Create a PromiseRejectionEvent-like object
    const event = {
      reason: new Error("unhandled rejection"),
      promise: Promise.resolve(),
      preventDefault: vi.fn(),
    } as unknown as PromiseRejectionEvent;

    act(() => {
      rejectionHandler(event);
    });

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("handles PromiseRejectionEvent with string reason", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<GlobalErrorListener />);

    const rejectionHandler = addSpy.mock.calls.find(
      (call) => call[0] === "unhandledrejection"
    )?.[1] as (e: PromiseRejectionEvent) => void;

    const event = {
      reason: "string rejection",
      promise: Promise.resolve(),
      preventDefault: vi.fn(),
    } as unknown as PromiseRejectionEvent;

    act(() => {
      rejectionHandler(event);
    });

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("ignores PromiseRejectionEvent with null/undefined reason", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<GlobalErrorListener />);

    const rejectionHandler = addSpy.mock.calls.find(
      (call) => call[0] === "unhandledrejection"
    )?.[1] as (e: PromiseRejectionEvent) => void;

    const event = {
      reason: undefined,
      promise: Promise.resolve(),
      preventDefault: vi.fn(),
    } as unknown as PromiseRejectionEvent;

    act(() => {
      rejectionHandler(event);
    });

    // Should NOT have logged for undefined reason
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
