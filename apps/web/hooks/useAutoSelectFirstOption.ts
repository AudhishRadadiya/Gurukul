import _first from "lodash/first";
import { useEffect } from "react";
import type { FieldValues, Path, UseFormSetValue } from "react-hook-form";

type UseAutoSelectFirstOptionProps<T extends FieldValues> = {
  currentValue: string | number | null | undefined;
  enabled?: boolean;
  fieldName: Path<T>;
  options?: Array<{ label: string; value: string | number }>;
  setValue: UseFormSetValue<T>;
};

export function useAutoSelectFirstOption<T extends FieldValues>({
  currentValue,
  enabled = true,
  fieldName,
  options,
  setValue,
}: UseAutoSelectFirstOptionProps<T>) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const hasOptions = options && options.length > 0;

    if (hasOptions) {
      const hasNoSelection = !currentValue;

      if (hasNoSelection) {
        const firstOption = _first(options);

        if (firstOption) {
          setValue(fieldName, firstOption.value as never);
        }
      }
    }
  }, [options, currentValue, setValue, fieldName, enabled]);
}
