// ========================================
// Tests for src/lib/compute.ts
// Core day-plan computation logic
// ========================================

import { describe, it, expect } from "vitest";
import {
  computeDayPlan,
  getWeekday,
  type ComputeDayPlanParams,
} from "@/lib/compute";
import type { Product, Routine, Filters, BodyArea, RoutineStep } from "@/types";

// ========================================
// Helpers — minimal fixtures
// ========================================
function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "p-1",
    name: "Test Product",
    category: "skincare",
    actives: [],
    cautionTags: [],
    ...overrides,
  };
}

function makeRoutine(overrides: Partial<Routine> = {}): Routine {
  return {
    id: "r-1",
    type: "skin",
    name: "Test Routine",
    schedule: { weekday: [0, 1, 2, 3, 4, 5, 6] },
    timeOfDay: "AM",
    tags: {},
    steps: [
      { order: 1, title: "Step 1", productIds: ["p-1"] },
      { order: 2, title: "Step 2" },
    ],
    ...overrides,
  };
}

const defaultFlags: Filters["flags"] = {
  office: false,
  wfh: false,
  travel: false,
  goingOut: false,
};

function makePlanParams(
  overrides: Partial<ComputeDayPlanParams> = {}
): ComputeDayPlanParams {
  return {
    date: new Date("2026-02-09"), // Monday → weekday 1
    timeOfDay: "AM",
    flags: { ...defaultFlags },
    occasion: "Casual",
    bodyAreas: [] as BodyArea[],
    products: [makeProduct()],
    routines: [makeRoutine()],
    ...overrides,
  };
}

// ========================================
// getWeekday
// ========================================
describe("getWeekday", () => {
  it("returns 0 for Sunday", () => {
    expect(getWeekday(new Date("2026-02-08"))).toBe(0);
  });

  it("returns 1 for Monday", () => {
    expect(getWeekday(new Date("2026-02-09"))).toBe(1);
  });

  it("returns 6 for Saturday", () => {
    expect(getWeekday(new Date("2026-02-14"))).toBe(6);
  });
});

// ========================================
// computeDayPlan — section building
// ========================================
describe("computeDayPlan", () => {
  it("places a skin routine into the Skincare section", () => {
    const plan = computeDayPlan(makePlanParams());
    const skinSection = plan.sections.find((s) => s.key === "Skincare");

    expect(skinSection).toBeDefined();
    expect(skinSection!.routines.length).toBeGreaterThanOrEqual(1);
    expect(skinSection!.routines[0]!.routineId).toBe("r-1");
  });

  it("enriches steps with product details", () => {
    const product = makeProduct({ id: "p-1", name: "Cleanser" });
    const plan = computeDayPlan(
      makePlanParams({ products: [product] })
    );

    const skinSection = plan.sections.find((s) => s.key === "Skincare")!;
    const routine = skinSection.routines.find((r) => r.routineId === "r-1")!;
    const step1 = routine.steps[0]!;

    expect(step1.products).toHaveLength(1);
    expect(step1.products[0]!.name).toBe("Cleanser");
  });

  it("counts totalSteps per section", () => {
    const plan = computeDayPlan(makePlanParams());
    const skinSection = plan.sections.find((s) => s.key === "Skincare")!;

    expect(skinSection.totalSteps).toBe(2);
  });

  it("always includes a Wardrobe placeholder section", () => {
    const plan = computeDayPlan(makePlanParams());
    const wardrobe = plan.sections.find((s) => s.key === "Wardrobe")!;

    expect(wardrobe).toBeDefined();
    expect(wardrobe.routines[0]!.routineId).toBe("wardrobe-placeholder");
  });

  it("groups multiple routine types into separate sections", () => {
    const params = makePlanParams({
      routines: [
        makeRoutine({ id: "r-skin", type: "skin", name: "Skincare" }),
        makeRoutine({ id: "r-hair", type: "hair", name: "Haircare" }),
      ],
    });
    const plan = computeDayPlan(params);

    const skin = plan.sections.find((s) => s.key === "Skincare")!;
    const hair = plan.sections.find((s) => s.key === "Haircare")!;

    expect(skin.routines).toHaveLength(1);
    expect(hair.routines).toHaveLength(1);
  });
});

// ========================================
// Schedule matching
// ========================================
describe("computeDayPlan — schedule matching", () => {
  it("excludes routines not scheduled for the day", () => {
    const routine = makeRoutine({
      schedule: { weekday: [0] }, // Sunday only
    });
    // Date is Monday (weekday 1)
    const plan = computeDayPlan(makePlanParams({ routines: [routine] }));
    const skinSection = plan.sections.find((s) => s.key === "Skincare")!;

    expect(skinSection.routines).toHaveLength(0);
  });

  it("includes routines scheduled for the given weekday", () => {
    const routine = makeRoutine({
      schedule: { weekday: [1] }, // Monday
    });
    const plan = computeDayPlan(makePlanParams({ routines: [routine] }));
    const skinSection = plan.sections.find((s) => s.key === "Skincare")!;

    expect(skinSection.routines).toHaveLength(1);
  });
});

// ========================================
// Time-of-day filtering
// ========================================
describe("computeDayPlan — time-of-day filtering", () => {
  it("excludes AM routine when filter is PM", () => {
    const amRoutine = makeRoutine({ timeOfDay: "AM" });
    const plan = computeDayPlan(
      makePlanParams({ routines: [amRoutine], timeOfDay: "PM" })
    );
    const skinSection = plan.sections.find((s) => s.key === "Skincare")!;

    expect(skinSection.routines).toHaveLength(0);
  });

  it("includes ANY-time routine regardless of filter", () => {
    const anyRoutine = makeRoutine({ timeOfDay: "ANY" });
    const plan = computeDayPlan(
      makePlanParams({ routines: [anyRoutine], timeOfDay: "PM" })
    );
    const skinSection = plan.sections.find((s) => s.key === "Skincare")!;

    expect(skinSection.routines).toHaveLength(1);
  });

  it("includes all routines when filter is ANY", () => {
    const routines = [
      makeRoutine({ id: "r-am", timeOfDay: "AM" }),
      makeRoutine({ id: "r-pm", timeOfDay: "PM" }),
    ];
    const plan = computeDayPlan(
      makePlanParams({ routines, timeOfDay: "ANY" })
    );
    const skinSection = plan.sections.find((s) => s.key === "Skincare")!;

    expect(skinSection.routines).toHaveLength(2);
  });
});

// ========================================
// Flag filtering
// ========================================
describe("computeDayPlan — flag filtering", () => {
  it("shows all routines when no flags are set", () => {
    const plan = computeDayPlan(makePlanParams());
    const skinSection = plan.sections.find((s) => s.key === "Skincare")!;

    expect(skinSection.routines).toHaveLength(1);
  });

  it("excludes routine lacking the active flag", () => {
    const routine = makeRoutine({ tags: { office: false, wfh: false } });
    const plan = computeDayPlan(
      makePlanParams({
        routines: [routine],
        flags: { ...defaultFlags, office: true },
      })
    );
    const skinSection = plan.sections.find((s) => s.key === "Skincare")!;

    expect(skinSection.routines).toHaveLength(0);
  });

  it("includes routine matching an active flag", () => {
    const routine = makeRoutine({ tags: { wfh: true } });
    const plan = computeDayPlan(
      makePlanParams({
        routines: [routine],
        flags: { ...defaultFlags, wfh: true },
      })
    );
    const skinSection = plan.sections.find((s) => s.key === "Skincare")!;

    expect(skinSection.routines).toHaveLength(1);
  });
});

// ========================================
// Travel mode
// ========================================
describe("computeDayPlan — travel mode", () => {
  it("shows only first 2 steps when travel flag is set", () => {
    const routine = makeRoutine({
      tags: { travel: true },
      steps: [
        { order: 1, title: "First Step" },
        { order: 2, title: "Second Step" },
        { order: 3, title: "Third Step" },
      ],
    });
    const plan = computeDayPlan(
      makePlanParams({
        routines: [routine],
        flags: { ...defaultFlags, travel: true },
      })
    );
    const skinSection = plan.sections.find((s) => s.key === "Skincare")!;
    const steps = skinSection.routines[0]!.steps;

    expect(steps).toHaveLength(2);
    expect(steps[0]!.title).toBe("First Step");
    expect(steps[1]!.title).toBe("Second Step");
  });

  it("keeps all steps when routine has 2 or fewer steps", () => {
    const routine = makeRoutine({
      tags: { travel: true },
      steps: [
        { order: 1, title: "A" },
        { order: 2, title: "B" },
      ],
    });
    const plan = computeDayPlan(
      makePlanParams({
        routines: [routine],
        flags: { ...defaultFlags, travel: true },
      })
    );
    const skinSection = plan.sections.find((s) => s.key === "Skincare")!;

    expect(skinSection.routines[0]!.steps).toHaveLength(2);
  });

  it("adds travel mode notice to warnings", () => {
    const routine = makeRoutine({ tags: { travel: true } });
    const plan = computeDayPlan(
      makePlanParams({
        routines: [routine],
        flags: { ...defaultFlags, travel: true },
      })
    );

    expect(plan.warnings.some((w) => w.includes("Travel mode"))).toBe(true);
  });
});

// ========================================
// Conflict warnings
// ========================================
describe("computeDayPlan — conflict warnings", () => {
  it("warns when tretinoin and AHA/BHA peel used same PM", () => {
    const products = [
      makeProduct({ id: "p-tret", actives: ["Tretinoin"] }),
      makeProduct({ id: "p-peel-aha-bha", actives: ["AHA"] }),
    ];
    const routine = makeRoutine({
      timeOfDay: "PM",
      steps: [
        { order: 1, title: "Tret", productIds: ["p-tret"] },
        { order: 2, title: "Peel", productIds: ["p-peel-aha-bha"] },
      ],
    });
    const plan = computeDayPlan(
      makePlanParams({
        routines: [routine],
        products,
        timeOfDay: "PM",
      })
    );

    expect(plan.warnings.some((w) => w.includes("Tretinoin"))).toBe(true);
  });

  it("warns about strong actives when going out", () => {
    const products = [
      makeProduct({ id: "p-strong", cautionTags: ["strong-active"] }),
    ];
    const routine = makeRoutine({
      timeOfDay: "PM",
      tags: { goingOut: true },
      steps: [{ order: 1, title: "Apply", productIds: ["p-strong"] }],
    });
    const plan = computeDayPlan(
      makePlanParams({
        routines: [routine],
        products,
        timeOfDay: "PM",
        flags: { ...defaultFlags, goingOut: true },
      })
    );

    expect(plan.warnings.some((w) => w.includes("going out"))).toBe(true);
  });

  it("returns no warnings when there are no conflicts", () => {
    const plan = computeDayPlan(makePlanParams());

    expect(plan.warnings).toHaveLength(0);
  });
});

// ========================================
// Body area filtering
// ========================================
describe("computeDayPlan — body area filtering", () => {
  it("filters bodySpecific routine steps by selected areas", () => {
    const routine = makeRoutine({
      type: "bodySpecific",
      steps: [
        { order: 1, title: "Upper arm step", bodyAreas: ["UA"] },
        { order: 2, title: "Inner thigh step", bodyAreas: ["IT"] },
        { order: 3, title: "General step" },
      ],
    });
    const plan = computeDayPlan(
      makePlanParams({
        routines: [routine],
        bodyAreas: ["UA"],
      })
    );
    const section = plan.sections.find((s) => s.key === "Body Specifics")!;
    const steps = section.routines[0]!.steps;

    // UA step + general step (no body area restriction)
    expect(steps).toHaveLength(2);
    expect(steps[0]!.title).toBe("Upper arm step");
    expect(steps[1]!.title).toBe("General step");
  });
});

// ========================================
// Empty / edge cases
// ========================================
describe("computeDayPlan — edge cases", () => {
  it("returns empty sections with no routines", () => {
    const plan = computeDayPlan(makePlanParams({ routines: [] }));

    plan.sections.forEach((section) => {
      if (section.key !== "Wardrobe") {
        expect(section.routines).toHaveLength(0);
      }
    });
  });

  it("handles routines with no steps", () => {
    const routine = makeRoutine({ steps: [] });
    const plan = computeDayPlan(makePlanParams({ routines: [routine] }));
    const skinSection = plan.sections.find((s) => s.key === "Skincare")!;

    expect(skinSection.routines[0]!.steps).toHaveLength(0);
    expect(skinSection.totalSteps).toBe(0);
  });

  it("handles routines with undefined steps", () => {
    const routine: Routine = {
      ...makeRoutine(),
      steps: undefined as unknown as RoutineStep[],
    };
    const plan = computeDayPlan(makePlanParams({ routines: [routine] }));
    const skinSection = plan.sections.find((s) => s.key === "Skincare")!;

    expect(skinSection.routines[0]!.steps).toHaveLength(0);
  });
});
