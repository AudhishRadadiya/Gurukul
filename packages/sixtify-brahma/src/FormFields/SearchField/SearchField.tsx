import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { InputAdornment } from "@mui/material";
import type { FieldValues } from "react-hook-form";
import type { TextFieldProps } from "../TextField";
import { TextField } from "../TextField";

export function SearchField<P extends FieldValues>(props: TextFieldProps<P>) {
  const { styling = "custom" } = props;

  return (
    <TextField
      placeholder="Search"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchOutlinedIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
      InputLabelProps={
        styling === "default"
          ? {
              sx: {
                "&:not(.MuiInputLabel-shrink)": {
                  fontSize: "14px",
                  top: "50%",
                  transform: "translate(14px, -50%)",
                },
              },
            }
          : undefined
      }
      {...props}
      containerProps={{
        width: { sm: "auto", xs: "100%" },
        ...props.containerProps,
      }}
    />
  );
}
