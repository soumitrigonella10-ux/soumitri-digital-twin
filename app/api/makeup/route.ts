// ─────────────────────────────────────────────────────────────
// Makeup Products API — CRUD scoped to routineType="makeup"
//
// GET    /api/makeup          → list makeup products
// POST   /api/makeup          → create or update a makeup product
// PATCH  /api/makeup          → partial update
// DELETE /api/makeup?id=xxx   → delete a makeup product
//
// All mutations require admin authentication.
// ─────────────────────────────────────────────────────────────
import { createRoutineProductHandlers } from "@/lib/routine-products";

export const { GET, POST, PATCH, DELETE } = createRoutineProductHandlers("makeup");
