import { useState, useMemo, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Product, TimeOfDay, RoutineType } from "@/types";
import type { EditFormState } from "@/components/routines/EditProductModal";

interface UseRoutineProductsOptions {
  routineType: RoutineType;
}

interface ColumnProgress {
  total: number;
  completed: number;
  percentage: number;
}

function computeProgress(products: Product[], completedSet: Set<string>): ColumnProgress {
  const total = products.length;
  const completed = products.filter((p) => completedSet.has(p.id)).length;
  return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
}

export function useRoutineProducts({ routineType }: UseRoutineProductsOptions) {
  const { data, upsertProduct } = useAppStore();
  const [activeDayFilter, setActiveDayFilter] = useState<number | "ALL">("ALL");
  const [completedProducts, setCompletedProducts] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({});
  const [error, setError] = useState<Error | null>(null);

  // Filter products by routine type, sorted by display order
  const filteredProducts = useMemo(() => {
    try {
      if (!data?.products || !Array.isArray(data.products)) {
        return [];
      }
      return data.products
        .filter((p) => p.routineType === routineType)
        .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
    } catch (e) {
      const err = e instanceof Error ? e : new Error("Failed to filter products");
      setError(err);
      return [];
    }
  }, [data?.products, routineType]);

  // Time-of-day + day filtering helpers
  const filterByTimeAndDay = useCallback(
    (products: Product[], timeOfDay: TimeOfDay | TimeOfDay[]) => {
      const times = Array.isArray(timeOfDay) ? timeOfDay : [timeOfDay];
      let filtered = products.filter(
        (p) => times.includes(p.timeOfDay as TimeOfDay) || p.timeOfDay === "ANY"
      );

      if (activeDayFilter !== "ALL") {
        filtered = filtered.filter(
          (p) => !p.weekdays || p.weekdays.includes(activeDayFilter)
        );
      }

      return filtered;
    },
    [activeDayFilter]
  );

  // AM/PM column products
  const morningProducts = useMemo(
    () => filterByTimeAndDay(filteredProducts, "AM"),
    [filteredProducts, filterByTimeAndDay]
  );

  const eveningProducts = useMemo(
    () => filterByTimeAndDay(filteredProducts, "PM"),
    [filteredProducts, filterByTimeAndDay]
  );

  const middayProducts = useMemo(
    () => filterByTimeAndDay(filteredProducts, "MIDDAY"),
    [filteredProducts, filterByTimeAndDay]
  );

  // Progress
  const morningProgress = useMemo(() => computeProgress(morningProducts, completedProducts), [morningProducts, completedProducts]);
  const eveningProgress = useMemo(() => computeProgress(eveningProducts, completedProducts), [eveningProducts, completedProducts]);
  const middayProgress = useMemo(() => computeProgress(middayProducts, completedProducts), [middayProducts, completedProducts]);

  // Actions
  const toggleProductCompletion = useCallback((productId: string) => {
    setCompletedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

  const handleEditStart = useCallback((product: Product) => {
    setEditingProduct(product.id);
    setEditForm({
      displayOrder: product.displayOrder,
      timeOfDay: product.timeOfDay,
      weekdays: product.weekdays,
    });
  }, []);

  const handleEditSave = useCallback(
    (product: Product) => {
      try {
        const updates: Partial<Product> = {};
        if (editForm.displayOrder !== undefined) updates.displayOrder = editForm.displayOrder;
        if (editForm.timeOfDay !== undefined) updates.timeOfDay = editForm.timeOfDay;
        if (editForm.weekdays !== undefined) updates.weekdays = editForm.weekdays;
        upsertProduct({ ...product, ...updates });
        setEditingProduct(null);
        setEditForm({});
      } catch (e) {
        const err = e instanceof Error ? e : new Error("Failed to save product edit");
        setError(err);
      }
    },
    [editForm, upsertProduct]
  );

  const handleEditCancel = useCallback(() => {
    setEditingProduct(null);
    setEditForm({});
  }, []);

  // Resolve the product being edited
  const editingProductData = useMemo(
    () => (editingProduct ? data.products.find((p) => p.id === editingProduct) ?? null : null),
    [editingProduct, data.products]
  );

  return {
    // All products for this routine type
    filteredProducts,
    // Time-filtered columns
    morningProducts,
    eveningProducts,
    middayProducts,
    // Progress
    morningProgress,
    eveningProgress,
    middayProgress,
    // Completions
    completedProducts,
    toggleProductCompletion,
    // Day filter
    activeDayFilter,
    setActiveDayFilter,
    // Edit modal
    editingProduct,
    editingProductData,
    editForm,
    setEditForm,
    handleEditStart,
    handleEditSave,
    handleEditCancel,
    // Error state
    error,
    clearError: () => setError(null),
    // Utility
    filterByTimeAndDay,
    computeProgress,
  };
}
