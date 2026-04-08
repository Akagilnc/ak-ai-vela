"use client";

import { FieldHint } from "./field-hint";
import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  hint?: string;
  glossary?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

export function FormField({ label, hint, glossary, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center text-sm font-medium text-vela-text">
        {label}
        {required && <span className="text-vela-error ml-0.5">*</span>}
        {hint && <FieldHint hint={hint} glossary={glossary} />}
      </label>
      {children}
      {error && (
        <p className="text-sm text-vela-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// Shared input styles
export const inputClass =
  "w-full px-3 py-2.5 text-base border border-vela-border rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-vela-primary focus:border-transparent transition-colors";

export const selectClass =
  "w-full px-3 py-2.5 text-base border border-vela-border rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-vela-primary focus:border-transparent transition-colors";

export const inputErrorClass =
  "border-vela-error focus:ring-vela-error";
