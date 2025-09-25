import { useMemo } from "react";
import type { FieldValues, UseControllerProps } from "react-hook-form";
import { useWatch } from "react-hook-form";

export const useDetectFormChange = <T extends FieldValues>(
  control: UseControllerProps<T>["control"],
  defaultValues: T
) => {
  const formData = useWatch({ control });

  const isFormChanged = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(defaultValues);
  }, [formData, defaultValues]);

  return { isFormChanged };
};
