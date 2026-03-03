// ─────────────────────────────────────────────────────────────
// Haircare Products API — CRUD scoped to routineType="hair"
//
// GET    /api/haircare          → list hair products
// POST   /api/haircare          → create or update a hair product
// PATCH  /api/haircare          → partial update
// DELETE /api/haircare?id=xxx   → delete a hair product
//
// All mutations require admin authentication.
// ─────────────────────────────────────────────────────────────
import { createRoutineProductHandlers } from "@/lib/routine-products";

export const { GET, POST, PATCH, DELETE } = createRoutineProductHandlers("hair");
