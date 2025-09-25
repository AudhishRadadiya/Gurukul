import type { TooltipProps as MuiTooltipProps } from "@mui/material";
import { Box, Tooltip as MuiTooltip, Typography } from "@mui/material";
import type { PropsWithChildren, ReactNode } from "react";

type TooltipProps = PropsWithChildren<{
  toolTipLabel: ReactNode;
  placement?: MuiTooltipProps["placement"];
  hidden?: MuiTooltipProps["hidden"];
}>;

export const Tooltip = ({
  toolTipLabel,
  children,
  placement = "top-start",
  hidden = false,
  ...rest
}: TooltipProps) => {
  return (
    <MuiTooltip
      arrow
      placement={placement}
      title={toolTipLabel}
      hidden={hidden}
      {...rest}
    >
      {typeof children === "string" ? (
        <Typography
          variant="body2"
          fontWeight={500}
          sx={{
            maxWidth: "150px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {children}
        </Typography>
      ) : (
        <Box display="inline-flex">{children}</Box>
      )}
    </MuiTooltip>
  );
};
