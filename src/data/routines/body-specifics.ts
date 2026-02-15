import { Routine } from "@/types";

// ========================================
// BODY SPECIFICS ROUTINES
// ========================================
export const bodySpecificsRoutines: Routine[] = [
  {
    id: "r-body-specific",
    type: "bodySpecific",
    name: "Body Specifics Care",
    schedule: { weekday: [1, 4] },
    timeOfDay: "ANY",
    tags: { office: true, wfh: true, travel: false, goingOut: true },
    steps: [
      {
        order: 1,
        title: "UA (Underarm) Care",
        durationMin: 3,
        bodyAreas: ["UA"],
        productIds: ["p-underarm-serum"],
      },
      {
        order: 2,
        title: "IT (Inner Thigh) Care",
        durationMin: 2,
        bodyAreas: ["IT"],
      },
      {
        order: 3,
        title: "BL (Bikini Line) Care",
        durationMin: 5,
        bodyAreas: ["BL"],
        productIds: ["p-ingrown-serum", "p-bikini-soothing"],
      },
      {
        order: 4,
        title: "IA (Intimate Area) Care",
        durationMin: 2,
        bodyAreas: ["IA"],
        productIds: ["p-intimate-wash"],
      },
      {
        order: 5,
        title: "B&S (Butt & Stomach) Care",
        durationMin: 3,
        bodyAreas: ["B&S"],
      },
    ],
  },
];
