import { useGetDeviceType, type ButtonProps } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";

type ButtonLayoutProviderProps = {
  isLabelCollapsed?: boolean;
  label: string;
  onClick: () => void;
  startIcon?: React.ReactElement;
} & Omit<ButtonProps, "onClick">;

export const ButtonLayoutProvider = ({
  isLabelCollapsed,
  label,
  onClick,
  startIcon,
  ...rest
}: ButtonLayoutProviderProps) => {
  const { isMobile } = useGetDeviceType();

  const showCollapsedLabel = isLabelCollapsed || isMobile;

  return (
    <Button
      variant="outlined"
      onClick={onClick}
      {...(showCollapsedLabel
        ? {
            children: startIcon ? (
              React.cloneElement(startIcon, {
                fontSize: "small",
              })
            ) : (
              <Add fontSize="small" />
            ),
            sx: {
              borderRadius: "6px",
              height: "36px",
              minWidth: "36px",
              width: "36px",
            },
          }
        : {
            children: label,
            startIcon: startIcon ? startIcon : <Add />,
          })}
      {...rest}
    />
  );
};
