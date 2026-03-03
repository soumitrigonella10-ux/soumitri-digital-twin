// ─────────────────────────────────────────────────────────────
// Skincare Products API — CRUD scoped to routineType="skin"
//
// GET    /api/skincare          → list skin products
// POST   /api/skincare          → create or update a skin product
// PATCH  /api/skincare          → partial update
// DELETE /api/skincare?id=xxx   → delete a skin product
//
// All mutations require admin authentication.
// ─────────────────────────────────────────────────────────────
import { createRoutineProductHandlers } from "@/lib/routine-products";

export const { GET, POST, PATCH, DELETE } = createRoutineProductHandlers("skin");
