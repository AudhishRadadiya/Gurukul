import {
  Stack,
  Typography,
  useTheme,
  type ListItemButtonProps as MuiListItemButtonProps,
} from "@mui/material";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Tooltip } from "../../Tooltip";
import { StyledListItemButton } from "./ListItemButton.styled";

export type ListItemButtonProps = MuiListItemButtonProps & {
  label: string;
  actions?: ReactNode;
  companyName?: string;
};

export function ListItemButton({
  label,
  selected,
  actions,
  companyName,
  ...restListItemButtonProps
}: ListItemButtonProps) {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const textRef = useRef<HTMLSpanElement | null>(null);

  const [isOverflowed, setIsOverflowed] = useState(false);

  //useMemo is not allowed on side effects.
  useEffect(() => {
    const el = textRef.current;

    if (!el) {
      return;
    }

    const handleResize = () => setIsOverflowed(el.scrollWidth > el.clientWidth);

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [label, companyName]);

  return (
    <StyledListItemButton
      selected={selected}
      alignItems="flex-start"
      {...restListItemButtonProps}
    >
      <Stack
        width="100%"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack gap="5px" direction="column" flex={1} display="grid">
          <Tooltip toolTipLabel={label} checkOverflow={!isOverflowed}>
            <Typography
              variant="body2"
              fontWeight={500}
              ref={textRef}
              sx={{
                width: "auto",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
              }}
            >
              {label}
            </Typography>
          </Tooltip>

          <Typography variant="caption" color={iron[800]}>
            {companyName}
          </Typography>
        </Stack>

        {actions}
      </Stack>
    </StyledListItemButton>
  );
}
