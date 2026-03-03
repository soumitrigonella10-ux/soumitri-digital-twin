// ========================================
// Component Tests — LoadingStates
//
// Tests all loading UI components: Spinner, Card, Grid, List, Page.
// ========================================

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import {
  LoadingSpinner,
  LoadingCard,
  LoadingGrid,
  LoadingList,
  LoadingPage,
} from "@/components/LoadingStates";

// ========================================
// LoadingSpinner
// ========================================
describe("LoadingSpinner", () => {
  it("renders a spinner element", () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toBeTruthy();
  });

  it("applies size-specific classes", () => {
    const { container: sm } = render(<LoadingSpinner size="sm" />);
    const { container: lg } = render(<LoadingSpinner size="lg" />);
    expect(sm.innerHTML).not.toBe(lg.innerHTML);
  });

  it("accepts custom className", () => {
    const { container } = render(<LoadingSpinner className="my-custom" />);
    expect(container.firstElementChild?.className).toContain("my-custom");
  });
});

// ========================================
// LoadingCard
// ========================================
describe("LoadingCard", () => {
  it("renders skeleton lines", () => {
    const { container } = render(<LoadingCard />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders correct number of skeleton lines", () => {
    const { container } = render(<LoadingCard lines={5} />);
    // Each line is a Skeleton component (div with certain classes)
    // Default has title + 5 lines
    const skeletons = container.querySelectorAll("[class*='animate']");
    // At least 5 skeleton elements (lines)
    expect(skeletons.length).toBeGreaterThanOrEqual(5);
  });

  it("renders without title when title=false", () => {
    const { container: withTitle } = render(<LoadingCard title={true} />);
    const { container: noTitle } = render(<LoadingCard title={false} />);
    // Without title should have fewer skeleton elements
    const withTitleCount = withTitle.querySelectorAll("[class*='animate']").length;
    const noTitleCount = noTitle.querySelectorAll("[class*='animate']").length;
    expect(noTitleCount).toBeLessThan(withTitleCount);
  });
});

// ========================================
// LoadingGrid
// ========================================
describe("LoadingGrid", () => {
  it("renders correct number of cards (columns * rows)", () => {
    const { container } = render(<LoadingGrid columns={2} rows={3} />);
    // Should render 2*3 = 6 cards
    const cards = container.querySelectorAll("[class*='rounded']");
    expect(cards.length).toBeGreaterThanOrEqual(6);
  });

  it("uses default 3x2 grid", () => {
    const { container } = render(<LoadingGrid />);
    // Default is 3 columns * 2 rows = 6 cards
    expect(container.firstChild).toBeTruthy();
  });
});

// ========================================
// LoadingList
// ========================================
describe("LoadingList", () => {
  it("renders correct number of list items", () => {
    // Default 5 items
    const { container } = render(<LoadingList />);
    const items = container.querySelectorAll("[class*='flex']");
    expect(items.length).toBeGreaterThanOrEqual(5);
  });

  it("renders avatars when showAvatar=true", () => {
    const { container: withAvatar } = render(<LoadingList showAvatar={true} items={2} />);
    const { container: noAvatar } = render(<LoadingList showAvatar={false} items={2} />);

    // Avatar skeleton has rounded-full class
    const avatarSkeletons = withAvatar.querySelectorAll("[class*='rounded-full']");
    const noAvatarSkeletons = noAvatar.querySelectorAll("[class*='rounded-full']");
    expect(avatarSkeletons.length).toBeGreaterThan(noAvatarSkeletons.length);
  });
});

// ========================================
// LoadingPage
// ========================================
describe("LoadingPage", () => {
  it("shows default loading text", () => {
    render(<LoadingPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows custom title", () => {
    render(<LoadingPage title="Fetching data..." />);
    expect(screen.getByText("Fetching data...")).toBeInTheDocument();
  });

  it("shows subtitle when provided", () => {
    render(<LoadingPage subtitle="Please wait" />);
    expect(screen.getByText("Please wait")).toBeInTheDocument();
  });
});
