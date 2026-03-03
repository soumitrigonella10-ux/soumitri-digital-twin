// ─────────────────────────────────────────────────────────────
// Body Care Products API — CRUD scoped to routineType="body"
//
// GET    /api/bodycare          → list body products
// POST   /api/bodycare          → create or update a body product
// PATCH  /api/bodycare          → partial update
// DELETE /api/bodycare?id=xxx   → delete a body product
//
// All mutations require admin authentication.
// ─────────────────────────────────────────────────────────────
import { createRoutineProductHandlers } from "@/lib/routine-products";

export const { GET, POST, PATCH, DELETE } = createRoutineProductHandlers("body");
