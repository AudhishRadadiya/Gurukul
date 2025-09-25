import {
  Stack,
  Typography,
  useTheme,
  type ListItemButtonProps as MuiListItemButtonProps,
} from "@mui/material";
import type { ReactNode } from "react";
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
        <Stack gap="5px" direction="column">
          <Tooltip toolTipLabel={label}>{label}</Tooltip>

          <Typography variant="caption" color={iron[800]}>
            {companyName}
          </Typography>
        </Stack>

        {actions}
      </Stack>
    </StyledListItemButton>
  );
}
