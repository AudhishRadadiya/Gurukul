import { Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { type Control, type FieldArrayWithId } from "react-hook-form";
import { SwitchField } from "../FormFields";
import { PadBox } from "../PadBox";
import type { SimpleColDef } from "./ColumnArrangerDialog";

export type ColumnItemProps = {
  field: FieldArrayWithId<{ columns: SimpleColDef[] }, "columns">;
  control: Control<{ columns: SimpleColDef[] }>;
  index: number;
};

export function ColumnItem({
  field,
  control,
  index,
}: Readonly<ColumnItemProps>) {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  return (
    <Stack direction="row" component="li">
      <Stack
        direction="row"
        alignItems="center"
        border="1px solid"
        flexGrow={1}
        borderColor={iron[700]}
      >
        <PadBox padding={{ paddingLeft: "24px" }}>
          <Typography sx={{ flexGrow: 1 }}>{field.headerName}</Typography>
        </PadBox>

        <SwitchField
          control={control}
          name={`columns.${index}.hide` as const}
        />
      </Stack>
    </Stack>
  );
}
