import { useMemo } from "react";
import type { FieldErrors } from "react-hook-form";

import type { ButtonId } from "@web/context/DisabledButtonsCacheContext/buttonIds";
import { buttonIds } from "@web/context/DisabledButtonsCacheContext/buttonIds";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";

type useEnableDisableButtonToggleProps = {
  buttonId?: ButtonId;
  errors: FieldErrors;
  isFormChanged: boolean;
};

export const submitButtonId = buttonIds.onSubmit;

export const editButtonId = buttonIds.onEdit;

export const useEnableDisableButtonToggle = ({
  buttonId = submitButtonId,
  errors,
  isFormChanged,
}: useEnableDisableButtonToggleProps) => {
  const { disable, enable, isDisabled } = useDisabledButtonsCache(buttonId);

  useMemo(() => {
    const hasErrors = Object.keys(errors ?? {}).length > 0;

    if (!hasErrors && isFormChanged && isDisabled()) {
      enable();
    } else if ((hasErrors || !isFormChanged) && !isDisabled()) {
      disable();
    }
  }, [errors, isFormChanged, isDisabled, enable, disable]);
};
