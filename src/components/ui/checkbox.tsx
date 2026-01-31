"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          className="peer sr-only"
          onChange={(e) => {
            props.onChange?.(e);
            onCheckedChange?.(e.target.checked);
          }}
          {...props}
        />
        <div
          className={cn(
            "h-5 w-5 shrink-0 rounded-md border border-gray-300 cursor-pointer",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-gray-950 peer-focus-visible:ring-offset-2",
            "peer-checked:bg-gray-900 peer-checked:border-gray-900",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            "transition-colors",
            className
          )}
          onClick={() => {
            const input = ref as React.RefObject<HTMLInputElement>;
            if (input?.current) {
              input.current.click();
            }
          }}
        >
          <Check
            className={cn(
              "h-4 w-4 text-white absolute top-0.5 left-0.5",
              "opacity-0 peer-checked:opacity-100 transition-opacity"
            )}
          />
        </div>
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
