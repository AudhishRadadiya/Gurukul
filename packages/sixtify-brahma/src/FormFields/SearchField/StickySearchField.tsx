import { Box, Paper, type PaperProps, type SxProps } from "@mui/material";
import type { FieldValues } from "react-hook-form";
import { PadBox } from "../../PadBox";
import type { TextFieldProps } from "../TextField";
import { SearchField } from "./SearchField";

type StickySearchFieldProps<T extends FieldValues> = TextFieldProps<T> & {
  top?: object | string;
  paperSx?: PaperProps;
  boxSx?: SxProps;
};

export const StickySearchField = <T extends FieldValues>({
  top = "0px",
  paperSx,
  boxSx,
  ...props
}: StickySearchFieldProps<T>) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        position: "sticky",
        top,
        zIndex: 100,
        ...paperSx,
      }}
    >
      <PadBox padding={{ padding: "5px" }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", ...boxSx }}>
          <SearchField {...props} />
        </Box>
      </PadBox>
    </Paper>
  );
};
