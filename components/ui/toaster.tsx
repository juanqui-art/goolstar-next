"use client";

import { Toaster as Sonner } from "sonner";

/**
 * Toast notification provider component
 * Add this to your root layout to enable toast notifications
 */
export function Toaster() {
  return (
    <Sonner
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-950 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gray-500",
          actionButton:
            "group-[.toast]:bg-gray-900 group-[.toast]:text-gray-50",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500",
        },
      }}
    />
  );
}
