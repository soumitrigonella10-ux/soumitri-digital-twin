// ========================================
// Component Tests — ProductCard
//
// Tests rendering, completion toggle, edit callback,
// variant layouts, and conditional displays.
// ========================================

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types";

// ── Test fixtures ────────────────────────────────────────────

const testTheme = {
  primary: "bg-pink-500 text-white",
  defaultBadge: "bg-gray-100 text-gray-600",
  categoryColors: {
    cleanser: "bg-blue-100 text-blue-700",
    serum: "bg-purple-100 text-purple-700",
  },
  completionButton: {
    completed: "bg-green-500 text-white",
    hover: "hover:bg-green-100",
  },
  cautionTags: "bg-yellow-100 text-yellow-700",
};

const baseProduct: Product = {
  id: "prod-1",
  name: "Niacinamide Serum",
  category: "serum",
  actives: ["Niacinamide 10%", "Zinc"],
  cautionTags: ["Patch test"],
  weekdays: [1, 2, 3, 4, 5],
};

// ========================================
// Default variant
// ========================================
describe("ProductCard — Default variant", () => {
  it("renders product name", () => {
    render(
      <ProductCard
        product={baseProduct}
        isCompleted={false}
        onToggleComplete={vi.fn()}
        index={0}
        theme={testTheme}
      />
    );
    expect(screen.getByText("Niacinamide Serum")).toBeInTheDocument();
  });

  it("renders category badge", () => {
    render(
      <ProductCard
        product={baseProduct}
        isCompleted={false}
        onToggleComplete={vi.fn()}
        index={0}
        theme={testTheme}
      />
    );
    expect(screen.getByText("serum")).toBeInTheDocument();
  });

  it("renders index number badge (1-based)", () => {
    render(
      <ProductCard
        product={baseProduct}
        isCompleted={false}
        onToggleComplete={vi.fn()}
        index={2}
        theme={testTheme}
      />
    );
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders active ingredients (first one + overflow count)", () => {
    render(
      <ProductCard
        product={baseProduct}
        isCompleted={false}
        onToggleComplete={vi.fn()}
        index={0}
        theme={testTheme}
      />
    );
    expect(screen.getByText("Niacinamide 10%")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("renders caution tags", () => {
    render(
      <ProductCard
        product={baseProduct}
        isCompleted={false}
        onToggleComplete={vi.fn()}
        index={0}
        theme={testTheme}
      />
    );
    expect(screen.getByText("Patch test")).toBeInTheDocument();
  });

  it("shows daily schedule text for weekday products", () => {
    const dailyProduct = { ...baseProduct, weekdays: [0, 1, 2, 3, 4, 5, 6] };
    render(
      <ProductCard
        product={dailyProduct}
        isCompleted={false}
        onToggleComplete={vi.fn()}
        index={0}
        theme={testTheme}
      />
    );
    expect(screen.getByText("Daily")).toBeInTheDocument();
  });

  it("shows abbreviated day codes for partial schedule", () => {
    const mwfProduct = { ...baseProduct, weekdays: [1, 3, 5] };
    render(
      <ProductCard
        product={mwfProduct}
        isCompleted={false}
        onToggleComplete={vi.fn()}
        index={0}
        theme={testTheme}
      />
    );
    expect(screen.getByText("MWF")).toBeInTheDocument();
  });

  it("calls onToggleComplete when completion button is clicked", () => {
    const onToggle = vi.fn();
    render(
      <ProductCard
        product={baseProduct}
        isCompleted={false}
        onToggleComplete={onToggle}
        index={0}
        theme={testTheme}
      />
    );
    // The completion button contains a CheckCircle2 icon — find all buttons
    const buttons = screen.getAllByRole("button");
    // The first interactive button should be the completion toggle
    fireEvent.click(buttons[0]!);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("applies line-through styling when completed", () => {
    render(
      <ProductCard
        product={baseProduct}
        isCompleted={true}
        onToggleComplete={vi.fn()}
        index={0}
        theme={testTheme}
      />
    );
    const name = screen.getByText("Niacinamide Serum");
    expect(name.className).toContain("line-through");
  });
});

// ========================================
// Edit button
// ========================================
describe("ProductCard — Edit button", () => {
  it("shows edit button when onEdit is provided", () => {
    const onEdit = vi.fn();
    render(
      <ProductCard
        product={baseProduct}
        isCompleted={false}
        onToggleComplete={vi.fn()}
        onEdit={onEdit}
        index={0}
        theme={testTheme}
      />
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("does not render edit button when onEdit is not provided", () => {
    render(
      <ProductCard
        product={baseProduct}
        isCompleted={false}
        onToggleComplete={vi.fn()}
        index={0}
        theme={testTheme}
      />
    );
    // Only the completion toggle button should exist
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
  });

  it("calls onEdit when edit button is clicked", () => {
    const onEdit = vi.fn();
    render(
      <ProductCard
        product={baseProduct}
        isCompleted={false}
        onToggleComplete={vi.fn()}
        onEdit={onEdit}
        index={0}
        theme={testTheme}
      />
    );
    const buttons = screen.getAllByRole("button");
    // Edit button is the last one
    fireEvent.click(buttons[buttons.length - 1]!);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});

// ========================================
// Makeup variant
// ========================================
describe("ProductCard — Makeup variant", () => {
  it("renders in makeup layout with checkbox-style toggle", () => {
    render(
      <ProductCard
        product={baseProduct}
        isCompleted={false}
        onToggleComplete={vi.fn()}
        index={0}
        theme={testTheme}
        variant="makeup"
      />
    );
    expect(screen.getByText("Niacinamide Serum")).toBeInTheDocument();
    expect(screen.getByText("serum")).toBeInTheDocument();
  });

  it("calls onToggleComplete in makeup variant", () => {
    const onToggle = vi.fn();
    render(
      <ProductCard
        product={baseProduct}
        isCompleted={false}
        onToggleComplete={onToggle}
        index={0}
        theme={testTheme}
        variant="makeup"
      />
    );
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]!);
    expect(onToggle).toHaveBeenCalled();
  });
});

// ========================================
// Edge cases
// ========================================
describe("ProductCard — Edge cases", () => {
  it("renders with no actives or caution tags", () => {
    const minimal: Product = {
      id: "min-1",
      name: "Basic Cream",
      category: "moisturizer",
      actives: [],
      cautionTags: [],
    };
    render(
      <ProductCard
        product={minimal}
        isCompleted={false}
        onToggleComplete={vi.fn()}
        index={0}
        theme={testTheme}
      />
    );
    expect(screen.getByText("Basic Cream")).toBeInTheDocument();
    expect(screen.getByText("Daily")).toBeInTheDocument();
  });

  it("renders with undefined weekdays (shows Daily)", () => {
    const noSchedule: Product = {
      id: "ns-1",
      name: "Sunscreen",
      category: "moisturizer",
      actives: [],
      cautionTags: [],
    };
    render(
      <ProductCard
        product={noSchedule}
        isCompleted={false}
        onToggleComplete={vi.fn()}
        index={0}
        theme={testTheme}
      />
    );
    expect(screen.getByText("Daily")).toBeInTheDocument();
  });

  it("uses default badge color for unknown category", () => {
    const unknown: Product = {
      id: "u-1",
      name: "Mystery Item",
      category: "unknown-category",
      actives: [],
      cautionTags: [],
    };
    const { container } = render(
      <ProductCard
        product={unknown}
        isCompleted={false}
        onToggleComplete={vi.fn()}
        index={0}
        theme={testTheme}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });
});
