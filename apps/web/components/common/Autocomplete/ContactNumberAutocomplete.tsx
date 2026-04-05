import _includes from "lodash/includes";
import type { KeyboardEvent } from "react";
import type { FieldValues } from "react-hook-form";

import type { CommonAutocompleteProps } from "@web/components/common/Autocomplete/CommonAutocomplete";
import { CommonAutocomplete } from "@web/components/common/Autocomplete/CommonAutocomplete";
import { digit } from "@web/utils/regex";

export type ContactNumberAutocompleteProps<P extends FieldValues> = Omit<
  CommonAutocompleteProps<P>,
  "onKeyDown"
> & {
  maxLength?: number;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
};

const MAX_CONTACT_LENGTH = 10;

export function ContactNumberAutocomplete<P extends FieldValues>({
  control,
  maxLength = MAX_CONTACT_LENGTH,
  name,
  onKeyDown: customOnKeyDown,
  ...props
}: Readonly<ContactNumberAutocompleteProps<P>>) {
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

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // Call custom onKeyDown first if provided (for Tab key handling, etc.)
    if (customOnKeyDown) {
      customOnKeyDown(event);
    }

    // If event was prevented by custom handler, don't process further
    if (event.defaultPrevented) {
      return;
    }

    if (isControlKey(event)) {
      return;
    }

    // Find the input element within the autocomplete
    const input = event.currentTarget.querySelector("input");

    if (!input) {
      return;
    }

    const currentInputValue = input.value || "";

    const hasSelection = input.selectionStart !== input.selectionEnd;

    // Prevent input if max length reached and no selection
    if (currentInputValue.length >= maxLength && !hasSelection) {
      event.preventDefault();

      return;
    }

    // Only allow digits
    if (!digit.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <CommonAutocomplete
      {...props}
      control={control}
      name={name}
      freeSolo
      createOptionOnType
      characterType="string-number"
      onKeyDown={handleKeyDown}
    />
  );
}
