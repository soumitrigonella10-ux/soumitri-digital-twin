// ─────────────────────────────────────────────────────────────
// AdminCrudModal — Reusable modal shell for CRUD operations
//
// Provides: overlay, panel, header, scrollable body, footer
// with consistent styling matching the app's design language.
// ─────────────────────────────────────────────────────────────
"use client";

import { X, Loader2, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// ── Modal Shell ──────────────────────────────────────────────

interface AdminCrudModalProps {
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  success?: boolean;
  error?: string | null;
  submitLabel?: string;
  accentColor?: string; // tailwind bg class e.g. "bg-pink-500"
  children: ReactNode;
}

export function AdminCrudModal({
  title,
  onClose,
  onSubmit,
  isSubmitting = false,
  success = false,
  error = null,
  submitLabel = "Save",
  accentColor = "bg-stone-800",
  children,
}: AdminCrudModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[3vh] sm:pt-[5vh]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#FFF8F0] rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto border border-stone-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-stone-200 flex items-center justify-between">
          <h2 className="font-serif italic text-xl font-bold text-stone-800">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {children}
        </div>

        {/* Error */}
        {error && (
          <div className="px-6 pb-2">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-stone-500 hover:text-stone-700"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className={cn(
              "px-5 py-2 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2",
              success ? "bg-green-500" : accentColor,
              isSubmitting && "opacity-70 cursor-not-allowed"
            )}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {success && <Check className="w-4 h-4" />}
            {success ? "Saved!" : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Form Field Components ────────────────────────────────────

interface FieldProps {
  label: string;
  children: ReactNode;
}

export function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:ring-2 focus:ring-stone-400/40 focus:border-stone-400 outline-none";

export const selectClass =
  "w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:ring-2 focus:ring-stone-400/40 focus:border-stone-400 outline-none appearance-none cursor-pointer";

// ── Delete Confirmation ──────────────────────────────────────

interface DeleteConfirmProps {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmModal({ itemName, onConfirm, onCancel, isDeleting = false }: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 border border-stone-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Delete Item</h3>
            <p className="text-sm text-gray-500">This cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-5">
          Are you sure you want to delete <strong>{itemName}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 flex items-center gap-2"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Admin Add Button (for headers) ───────────────────────────

interface AdminAddButtonProps {
  onClick: () => void;
  label?: string;
  accentColor?: string;
}

export function AdminAddButton({ onClick, label = "Add", accentColor = "bg-stone-800" }: AdminAddButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-all hover:opacity-90 flex items-center gap-1",
        accentColor
      )}
    >
      <span className="text-base leading-none">+</span>
      {label}
    </button>
  );
}
