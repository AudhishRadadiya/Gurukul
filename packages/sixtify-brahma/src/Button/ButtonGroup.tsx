import { ButtonGroup as MuiButtonGroup } from "@mui/material";
import { isFunction } from "lodash";
import type { ReactNode } from "react";
import { Button } from "./Button";

type ButtonObject = {
  icon: ReactNode;
  value: string;
  label: string;
  selected: boolean;
  onClick: (value: string) => void;
  size?: "small" | "medium" | "large";
};

type ButtonGroupProps = {
  renderButtons: ButtonObject[];
};

export const ButtonGroup = ({ renderButtons }: ButtonGroupProps) => {
  return (
    <MuiButtonGroup sx={{ boxShadow: "none" }} aria-label="Basic button group">
      {renderButtons?.map(
        ({ icon, value, label, selected, onClick, size = "medium" }) => (
          <Button
            variant={!selected ? "outlined" : "contained"}
            key={value}
            onClick={() => {
              if (isFunction(onClick)) {
                onClick(value);
              }
            }}
            startIcon={icon}
            size={size}
          >
            {label}
          </Button>
        )
      )}
    </MuiButtonGroup>
  );
};
