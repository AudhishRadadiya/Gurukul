import type { ButtonProps } from "@mui/material";
import { Button } from "../Button";
import { useGlobalKeyboardShortcut } from "../utils";
import type { OnAction } from "../utils/types";

export type FormActionButtonType = "cancel" | "save" | "update";

type FormActionButtonProps = ButtonProps & {
  onClick: OnAction;
} & Partial<{
    actionType: FormActionButtonType;
    label: string;
    shortcutKey: string;
    withoutModifiers: boolean;
    loading: boolean;
    disabled: boolean;
    disableKeyboardShortcut: boolean;
  }>;

export const FormActionButton = ({
  actionType,
  onClick,
  shortcutKey,
  label,
  withoutModifiers = false,
  loading = false,
  disabled = false,
  disableKeyboardShortcut = false,
  variant = "contained",
  ...rest
}: Readonly<FormActionButtonProps>) => {
  const getShortcutKey = () => {
    if (actionType == "cancel") {
      return "Escape";
    }

    if (shortcutKey) {
      return shortcutKey;
    }

    return "s";
  };

  const getLabel = () => {
    if (label) {
      return label;
    }

    if (actionType == "cancel") {
      return "Cancel";
    }

    if (actionType == "update") {
      return "Update";
    }

    return "Save";
  };

  useGlobalKeyboardShortcut({
    key: getShortcutKey(),
    withoutModifiers: actionType == "cancel" ? true : withoutModifiers,
    modifierKeys: actionType != "cancel" ? ["ctrl", "shift"] : undefined,
    onTrigger: () => {
      if (!disabled && !loading && !disableKeyboardShortcut) {
        onClick();
      }
    },
  });

  return (
    <Button
      onClick={onClick}
      variant={variant}
      loading={loading}
      disabled={disabled}
      {...rest}
    >
      {getLabel()}
    </Button>
  );
};
