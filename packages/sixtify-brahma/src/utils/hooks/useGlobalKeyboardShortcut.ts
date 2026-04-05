import _castArray from "lodash/castArray";
import _every from "lodash/every";
import { useEffect } from "react";
import type { OnAction } from "../types";

export type ModifierType = "ctrl" | "shift" | "alt" | "meta";

type UseGlobalKeyboardShortcutArgs = {
  key: string;
  onTrigger: OnAction;
  modifierKeys?: ModifierType | ModifierType[];
  withoutModifiers?: boolean;
};

export const useGlobalKeyboardShortcut = ({
  key,
  onTrigger,
  modifierKeys = "ctrl",
  withoutModifiers = false,
}: UseGlobalKeyboardShortcutArgs) => {
  useEffect(() => {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    const handler = (e: KeyboardEvent) => {
      const normalizedCode = key.length === 1 ? `Key${key.toUpperCase()}` : key;

      const keyMatch = e.code?.toLowerCase() === normalizedCode?.toLowerCase();

      if (withoutModifiers) {
        const hasNoModifiers =
          !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey;

        if (keyMatch && hasNoModifiers && !e.repeat) {
          e.preventDefault();
          e.stopPropagation();
          onTrigger();
        }

        return;
      }

      const normalizedModifierKeys = _castArray(modifierKeys);

      const modifierMatch = _every(normalizedModifierKeys, (mod) => {
        switch (mod) {
          case "ctrl":
            return e.ctrlKey || e.metaKey;

          case "shift":
            return e.shiftKey;

          case "alt":
            return e.altKey;

          case "meta":
            return e.metaKey;

          default:
            return true;
        }
      });

      const requiredModifiers = normalizedModifierKeys;

      let requiredModifiersCount = 0;

      if (requiredModifiers.includes("ctrl") && (e.ctrlKey || e.metaKey)) {
        requiredModifiersCount++;
      }

      if (requiredModifiers.includes("shift") && e.shiftKey) {
        requiredModifiersCount++;
      }

      if (requiredModifiers.includes("alt") && e.altKey) {
        requiredModifiersCount++;
      }

      const hasExtraModifiers =
        (e.ctrlKey && !requiredModifiers.includes("ctrl")) ||
        (e.metaKey &&
          !requiredModifiers.includes("ctrl") &&
          !requiredModifiers.includes("meta")) ||
        (e.shiftKey && !requiredModifiers.includes("shift")) ||
        (e.altKey && !requiredModifiers.includes("alt"));

      if (
        keyMatch &&
        modifierMatch &&
        requiredModifiersCount === normalizedModifierKeys.length &&
        !hasExtraModifiers &&
        !e.repeat
      ) {
        e.preventDefault();
        e.stopPropagation();
        onTrigger();
      }
    };

    window.addEventListener("keydown", handler, true);

    return () => window.removeEventListener("keydown", handler, true);
  }, [key, modifierKeys, onTrigger, withoutModifiers]);
};
