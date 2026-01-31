"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// ========================================
// Toast Types
// ========================================
interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error";
}

interface ToastContextType {
  toast: (options: Omit<Toast, "id">) => void;
}

// ========================================
// Context
// ========================================
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ========================================
// Provider Component
// ========================================
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((options: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, ...options };

    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "rounded-lg shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-right-5",
              t.variant === "success" && "bg-green-50 border border-green-200",
              t.variant === "error" && "bg-red-50 border border-red-200",
              (!t.variant || t.variant === "default") &&
                "bg-white border border-gray-200"
            )}
          >
            <div className="flex-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  t.variant === "success" && "text-green-800",
                  t.variant === "error" && "text-red-800",
                  (!t.variant || t.variant === "default") && "text-gray-900"
                )}
              >
                {t.title}
              </p>
              {t.description && (
                <p
                  className={cn(
                    "text-sm mt-1",
                    t.variant === "success" && "text-green-600",
                    t.variant === "error" && "text-red-600",
                    (!t.variant || t.variant === "default") && "text-gray-500"
                  )}
                >
                  {t.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ========================================
// Hook
// ========================================
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
