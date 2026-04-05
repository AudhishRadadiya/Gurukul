import { FormControl, Typography } from "@mui/material";
import type { FormControlProps } from "@mui/material/FormControl";
import { alpha, styled, type CSSObject } from "@mui/material/styles";
import type { TypographyProps } from "@mui/material/Typography";

export const StyledFormControl: React.FC<FormControlProps> = styled(
  FormControl
)(({ theme, disabled }) => {
  const { lightBlue, iron } = theme.palette.app.color;

  const styles: CSSObject = {
    "& .MuiInputBase-root": {
      backgroundColor: disabled ? alpha(lightBlue[100], 0.3) : iron[600],
    },
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flexWrap: "nowrap",
      overflow: "hidden",
    },
    "& .MuiList-root": {
      maxHeight: 300,
      overflowY: "auto",
      "&::-webkit-scrollbar": {
        width: "6px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: lightBlue[100],
      },
    },
  };

  return styles;
});

export const GroupHeader: React.FC<TypographyProps> = styled(Typography)(({
  theme,
}) => {
  const { butterflyBlue } = theme.palette.app.color;

  const styles: CSSObject = {
    position: "sticky",
    top: 0,
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: 600,
    color: butterflyBlue[900],
    backgroundColor: butterflyBlue[500],
    zIndex: 1,
  };

  return styles;
});
