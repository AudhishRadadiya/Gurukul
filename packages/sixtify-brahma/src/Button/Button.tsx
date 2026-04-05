import type { ButtonProps as MuiButtonProps } from "@mui/material";
import { CircularProgress, Button as MuiButton } from "@mui/material";
import _isFunction from "lodash/isFunction";
import { type ModifierType, useGlobalKeyboardShortcut } from "../utils";
import type { OnAction } from "../utils/types";

export type ButtonProps = MuiButtonProps & {
  loading?: boolean;
  enableKeyboardShortcut?: boolean;
  shortcutKey?: string;
  modifierKeys?: ModifierType[];
  onClick?: OnAction;
};

export const Button = ({
  loading = false,
  children,
  disabled = false,
  enableKeyboardShortcut = true,
  shortcutKey,
  modifierKeys = ["ctrl", "alt"],
  onClick,
  ...rest
}: ButtonProps) => {
  useGlobalKeyboardShortcut({
    key: shortcutKey ?? "",
    modifierKeys,
    onTrigger: () => {
      if (
        !disabled &&
        !loading &&
        enableKeyboardShortcut &&
        _isFunction(onClick)
      ) {
        onClick();
      }
    },
  });

  return (
    <MuiButton disabled={loading || disabled} onClick={onClick} {...rest}>
      {loading ? <CircularProgress size={28} /> : children}
    </MuiButton>
  );
};
