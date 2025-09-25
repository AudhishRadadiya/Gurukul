import { Stack } from "@mui/material";
import type { Control, UseFieldArrayReturn } from "react-hook-form";
import type { SimpleColDef } from "./ColumnArrangerDialog";
import { ColumnItem } from "./ColumnItem";
import { LockedColumnItem } from "./LockedColumnItem";

export type ColumnArrangerProps = {
  lockedColumns: SimpleColDef[];
  fields: UseFieldArrayReturn<{ columns: SimpleColDef[] }, "columns">["fields"];
  control: Control<{ columns: SimpleColDef[] }>;
};

export function ColumnArranger({
  lockedColumns,
  fields,
  control,
}: Readonly<ColumnArrangerProps>) {
  const ulStyleReset = { m: 0, p: 0 };

  return (
    <>
      {lockedColumns.map((column) => {
        return <LockedColumnItem key={column.field} column={column} />;
      })}

      <Stack component="ul" sx={ulStyleReset}>
        {fields.map((field, index) => {
          return (
            <ColumnItem
              key={field.id}
              field={field}
              control={control}
              index={index}
            />
          );
        })}
      </Stack>
    </>
  );
}
