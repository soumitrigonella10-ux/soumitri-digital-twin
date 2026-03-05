// ─────────────────────────────────────────────────────────────
// Wellness Products API — CRUD scoped to routineType="wellness"
//
// GET    /api/wellness          → list wellness products
// POST   /api/wellness          → create or update a wellness product
// PATCH  /api/wellness          → partial update
// DELETE /api/wellness?id=xxx   → delete a wellness product
//
// All mutations require admin authentication.
// ─────────────────────────────────────────────────────────────
import { createRoutineProductHandlers } from "@/lib/routine-products";

export const { GET, POST, PATCH, DELETE } = createRoutineProductHandlers("wellness");
