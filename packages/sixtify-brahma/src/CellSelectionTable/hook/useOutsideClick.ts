import { type RefObject, useEffect } from "react";

const OVERLAY_ROLES = new Set([
  "dialog",
  "alertdialog",
  "menu",
  "listbox",
  "tooltip",
  "combobox",
]);

export function isClickInsideAnyOverlay(event: MouseEvent): boolean {
  const path = (
    event.composedPath ? event.composedPath() : []
  ) as Array<EventTarget>;

  for (const node of path) {
    if (!(node instanceof Element)) {
      continue;
    }

    if (node.getAttribute("aria-modal") === "true") {
      return true;
    }

    const role = node.getAttribute("role");

    if (role && OVERLAY_ROLES.has(role)) {
      return true;
    }
  }

  return getComputedStyle(document.body).overflow === "hidden";
}

export function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T>,
  onOutsideClick: () => void
) {
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (isClickInsideAnyOverlay(event)) {
        return;
      }

      const target = event.target as Node;

      const el = ref.current;

      if (el && el.contains(target)) {
        return;
      }

      onOutsideClick();
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [ref, onOutsideClick]);
}
