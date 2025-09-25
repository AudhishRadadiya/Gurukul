import type { Control, FieldErrors, FieldValues } from "react-hook-form";

import type { ButtonId } from "@web/app/context/DisabledButtonsCacheContext/buttonIds";
import { useDetectFormChange } from "@web/hooks/useDetectFormChange";
import { useEnableDisableButtonToggle } from "@web/hooks/useEnableDisableButtonToggle";

type useEnableDisableButtonProps<T extends FieldValues> = {
  buttonId?: ButtonId;
  control: Control<T>;
  defaultValues: T;
  errors: FieldErrors<T>;
};

export const useEnableDisableButton = <T extends FieldValues>({
  buttonId,
  control,
  defaultValues,
  errors,
}: useEnableDisableButtonProps<T>) => {
  const { isFormChanged } = useDetectFormChange(control, defaultValues);

  useEnableDisableButtonToggle({ buttonId, errors, isFormChanged });

  return { isFormChanged };
};
