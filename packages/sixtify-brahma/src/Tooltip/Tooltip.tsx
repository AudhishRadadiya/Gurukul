import type { TooltipProps as MuiTooltipProps } from "@mui/material";
import { Box, Tooltip as MuiTooltip, Typography } from "@mui/material";
import type { PropsWithChildren, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type TooltipProps = PropsWithChildren<{
  toolTipLabel: ReactNode;
  placement?: MuiTooltipProps["placement"];
  hidden?: MuiTooltipProps["hidden"];
  checkOverflow?: boolean;
}>;

export const Tooltip = ({
  toolTipLabel,
  children,
  placement = "top-start",
  hidden = false,
  checkOverflow = false,
  ...rest
}: TooltipProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [isOverflowed, setIsOverflowed] = useState(false);

  useEffect(() => {
    if (checkOverflow && wrapperRef.current) {
      const el = wrapperRef.current;

      setIsOverflowed(
        el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight
      );
    }
  }, [children]);

  return (
    <MuiTooltip
      arrow
      placement={placement}
      title={toolTipLabel}
      disableHoverListener={checkOverflow ? !isOverflowed || hidden : hidden}
      {...rest}
    >
      <Box
        ref={wrapperRef}
        sx={{
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          display: "inline-flex",
        }}
      >
        {typeof children === "string" ? (
          <Typography variant="body2" fontWeight={500}>
            {children}
          </Typography>
        ) : (
          children
        )}
      </Box>
    </MuiTooltip>
  );
};
