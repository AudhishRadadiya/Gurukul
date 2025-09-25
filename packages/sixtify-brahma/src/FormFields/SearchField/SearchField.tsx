import { InputAdornment } from "@mui/material";
import type { FieldValues } from "react-hook-form";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import type { TextFieldProps } from "../TextField";
import { TextField } from "../TextField";

export function SearchField<P extends FieldValues>(props: TextFieldProps<P>) {
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
      {...props}
    />
  );
}
