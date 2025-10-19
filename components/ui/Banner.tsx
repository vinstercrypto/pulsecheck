"use client";
import React from "react";

type Kind = "success" | "info" | "warning" | "error";
const KIND_STYLES: Record<Kind, string> = {
  success: "border-green-700 bg-green-900/40 text-green-100",
  info: "border-blue-700 bg-blue-900/40 text-blue-100",
  warning: "border-yellow-700 bg-yellow-900/40 text-yellow-100",
  error: "border-red-700 bg-red-900/40 text-red-100",
};

export function Banner({
  kind,
  message,
  onClose,
}: {
  kind: Kind;
  message: string;
  onClose?: () => void;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`mb-4 rounded-md border px-4 py-3 ${KIND_STYLES[kind]}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 text-sm leading-5">{message}</div>
        {onClose ? (
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={onClose}
            className="ml-2 h-11 w-11 -mr-2 flex items-center justify-center rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}
