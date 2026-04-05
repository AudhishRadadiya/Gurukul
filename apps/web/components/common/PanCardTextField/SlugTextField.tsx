import type { TextFieldProps } from "@codezee/sixtify-brahma";
import { TextField } from "@codezee/sixtify-brahma";
import { useRef } from "react";
import type { FieldValues } from "react-hook-form";
import { useController } from "react-hook-form";

export type SlugTextFieldProps<P extends FieldValues> = Omit<
  TextFieldProps<P>,
  "characterType" | "letterCase" | "isCapitalize"
>;

export function SlugTextField<P extends FieldValues>({
  control,
  defaultValue,
  name,
  rules,
  ...textFieldProps
}: Readonly<SlugTextFieldProps<P>>) {
  const { field } = useController({ control, defaultValue, name, rules });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === " ") {
      event.preventDefault();

      const input = inputRef.current;

      if (input) {
        const cursorPosition = input.selectionStart ?? 0;

        const currentValue = input.value || "";

        const newValue =
          currentValue.slice(0, cursorPosition) +
          "-" +
          currentValue.slice(cursorPosition);

        field.onChange(newValue || null);

        requestAnimationFrame(() => {
          input.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
        });
      }
    }

    if (textFieldProps.onKeyDown) {
      textFieldProps.onKeyDown(event);
    }
  };

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;

    const originalValue = input.value;

    const transformedValue = originalValue.replaceAll(" ", "-");

    // Replace spaces with hyphens
    if (originalValue !== transformedValue) {
      const cursorPosition = input.selectionStart ?? 0;

      field.onChange(transformedValue || null);

      requestAnimationFrame(() => {
        if (inputRef.current) {
          const newPosition = Math.min(cursorPosition, transformedValue.length);

          inputRef.current.setSelectionRange(newPosition, newPosition);
        }
      });
    }
  };

  return (
    <TextField
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      {...textFieldProps}
      characterType="string-hyphens"
      letterCase="lowercase"
      isTrimStartDisabled
      onKeyDown={handleKeyDown}
      inputProps={{
        ...textFieldProps.inputProps,
        onInput: handleInput,
        ref: (node: HTMLInputElement | null) => {
          inputRef.current = node;

          if (
            textFieldProps.inputProps?.ref &&
            typeof textFieldProps.inputProps.ref !== "string"
          ) {
            if (typeof textFieldProps.inputProps.ref === "function") {
              textFieldProps.inputProps.ref(node);
            } else {
              textFieldProps.inputProps.ref.current = node;
            }
          }
        },
      }}
    />
  );
}
