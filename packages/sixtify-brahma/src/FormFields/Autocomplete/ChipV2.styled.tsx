import type { StyledComponent } from "@emotion/styled";
import type { ChipProps } from "@mui/material";
import { Chip, styled } from "@mui/material";

export const StyledChipV2: StyledComponent<ChipProps> = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "disabled",
})(({ theme }) => {
  const { slate, iron } = theme.palette.app.color;

  return {
    "& .MuiChip-label": {
      padding: 0,
    },
    backgroundColor: iron[700],
    color: slate[900],
    fontWeight: 500,
    borderRadius: "100%",
    minWidth: "30px",
  };
});
