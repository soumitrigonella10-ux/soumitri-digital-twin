// ─────────────────────────────────────────────────────────────
// Body Specifics Products API — CRUD scoped to routineType="bodySpecific"
//
// GET    /api/body-specifics          → list body-specific products
// POST   /api/body-specifics          → create or update
// PATCH  /api/body-specifics          → partial update
// DELETE /api/body-specifics?id=xxx   → delete
//
// All mutations require admin authentication.
// ─────────────────────────────────────────────────────────────
import { createRoutineProductHandlers } from "@/lib/routine-products";

export const { GET, POST, PATCH, DELETE } = createRoutineProductHandlers("bodySpecific");
