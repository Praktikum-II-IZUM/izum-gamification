"use client";

import * as React from "react";
import { useToast } from "./use-toast";

export type ToastActionElement = React.ReactElement;
export type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center justify-between transition-opacity duration-300 ${
            toast.open ? 'toast-enter' : 'toast-exit'
          }`}
          style={{ 
            display: toast.open ? "flex" : "none",
            opacity: toast.open ? 1 : 0,
            transition: "opacity 300ms ease-in-out"
          }}
          onClick={(e) => {
            e.stopPropagation();
            dismiss(toast.id);
          }}
        >
          <div>
            {toast.title && <strong>{toast.title}</strong>}
            {toast.description && <p className="mt-1">{toast.description}</p>}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dismiss(toast.id);
            }}
            className="text-gray-400 hover:text-gray-200"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
