"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product, TimeOfDay } from "@/types";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface EditFormState {
  displayOrder?: number | undefined;
  timeOfDay?: TimeOfDay | undefined;
  weekdays?: number[] | undefined;
}

export interface EditProductModalProps {
  product: Product;
  editForm: EditFormState;
  onEditFormChange: (form: EditFormState) => void;
  onSave: (product: Product) => void;
  onCancel: () => void;
  accentColorClass: string;
}

export function EditProductModal({
  product,
  editForm,
  onEditFormChange,
  onSave,
  onCancel,
  accentColorClass,
}: EditProductModalProps) {
  const toggleWeekday = (day: number) => {
    const current = editForm.weekdays || [];
    if (current.includes(day)) {
      onEditFormChange({ ...editForm, weekdays: current.filter((d) => d !== day) });
    } else {
      onEditFormChange({ ...editForm, weekdays: [...current, day].sort() });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Edit {product.name}</h3>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
            <input
              type="number"
              min="1"
              value={editForm.displayOrder || ""}
              onChange={(e) =>
                onEditFormChange({ ...editForm, displayOrder: parseInt(e.target.value) || 1 })
              }
              className={cn(
                "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2",
                `focus:ring-${accentColorClass}`
              )}
              style={{ outlineColor: undefined }}
            />
          </div>

          {/* Time of Day */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time of Day</label>
            <div className="flex gap-2">
              {(["AM", "PM", "ANY"] as TimeOfDay[]).map((time) => (
                <button
                  key={time}
                  onClick={() => onEditFormChange({ ...editForm, timeOfDay: time })}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    editForm.timeOfDay === time
                      ? `${accentColorClass} text-white`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Weekdays */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Active Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day, idx) => (
                <button
                  key={day}
                  onClick={() => toggleWeekday(idx)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    editForm.weekdays?.includes(idx)
                      ? `${accentColorClass} text-white`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(product)}
              className={cn(
                "px-4 py-2 rounded-lg text-white transition-all",
                accentColorClass,
                `hover:opacity-90`
              )}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
