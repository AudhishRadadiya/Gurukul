import type { StyledComponent } from "@emotion/styled";
import type { ChipProps } from "@mui/material";
import { alpha, Chip, chipClasses, styled } from "@mui/material";

export const StyledChip: StyledComponent<ChipProps> = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "disabled",
})(({ theme, disabled }) => {
  const { black, iron } = theme.palette.app.color;

  return {
    backgroundColor: alpha(iron[700], 0.6),
    color: disabled ? iron[700] : black[900],
    borderRadius: "50px",
    padding: 0,

    [`& .${chipClasses.deleteIcon}`]: {
      color: alpha(iron[800], 0.7),
      borderRadius: "50%",
      transition: "color 100ms ease",
      "&:hover": {
        color: iron[800],
      },
      cursor: disabled ? "auto" : "pointer",
    },
    opacity: disabled ? 0.6 : 1,
    "&.Mui-disabled": {
      pointerEvents: "none",
      cursor: "auto",
    },
  };
});
