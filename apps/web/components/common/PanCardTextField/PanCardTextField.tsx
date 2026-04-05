import type { TextFieldProps } from "@codezee/sixtify-brahma";
import { TextField } from "@codezee/sixtify-brahma";
import _includes from "lodash/includes";
import type { KeyboardEvent } from "react";
import type { FieldValues } from "react-hook-form";

import { singleDigit, singleLetter } from "@web/utils/regex";

export type PanCardTextFieldProps<P extends FieldValues> = Omit<
  TextFieldProps<P>,
  "characterType" | "letterCase" | "isCapitalize" | "maxLength"
>;

export function PanCardTextField<P extends FieldValues>({
  control,
  defaultValue,
  name,
  rules,
  ...textFieldProps
}: Readonly<PanCardTextFieldProps<P>>) {
  const isControlKey = (event: KeyboardEvent<HTMLDivElement>): boolean => {
    const { ctrlKey, key } = event;

    const navigationKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
    ] as const;

    const ctrlCombos = ctrlKey && ["a", "c", "v", "x", "z"].includes(key);

    return _includes(navigationKeys, key) || ctrlCombos;
  };

  const isValidKeyForPosition = (key: string, position: number): boolean => {
    // Handle numeric keypad keys (e.g., "Numpad0" -> "0")
    const normalizedKey = key.startsWith("Numpad")
      ? key.replace("Numpad", "")
      : key;

    const isFirstFiveOrLast = position < 5 || position === 9;

    const isMiddleFour = position >= 5 && position < 9;

    if (isFirstFiveOrLast) {
      return singleLetter.test(normalizedKey);
    }

    if (isMiddleFour) {
      return singleDigit.test(normalizedKey);
    }

    return false;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isControlKey(event)) {
      return;
    }

    const input = event.currentTarget.querySelector("input");

    if (!input) {
      return;
    }

    const currentInputValue = input.value || "";

    const cursorPosition = input.selectionStart ?? 0;

    const hasSelection = input.selectionStart !== input.selectionEnd;

    // Prevent input if max length reached and no selection
    if (currentInputValue.length >= 10 && !hasSelection) {
      event.preventDefault();

      return;
    }

    // Validate key for the current cursor position (where it will be inserted)
    if (!isValidKeyForPosition(event.key, cursorPosition)) {
      event.preventDefault();
    }
  };

  return (
    <TextField
      control={control}
      name={name}
      isCapitalize
      defaultValue={defaultValue}
      rules={rules}
      {...textFieldProps}
      maxLength={10}
      characterType="any-character"
      letterCase="mixed"
      isTrimStartDisabled={true}
      onKeyDown={handleKeyDown}
    />
  );
}
