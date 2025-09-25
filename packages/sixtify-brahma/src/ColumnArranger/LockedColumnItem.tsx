import LockIcon from "@mui/icons-material/Lock";
import { Stack, Typography, useTheme } from "@mui/material";
import { PadBox } from "../PadBox";
import type { SimpleColDef } from "./ColumnArrangerDialog";

export type LockedColumnItemProps = { column: SimpleColDef };

export function LockedColumnItem({ column }: Readonly<LockedColumnItemProps>) {
  const theme = useTheme();

  const { lightBlue, iron } = theme.palette.app.color;

  return (
    <Stack
      border="1px solid"
      width="100%"
      bgcolor={lightBlue[100]}
      borderColor={iron[700]}
    >
      <PadBox padding={{ padding: "0px 24px" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          minHeight="38px"
        >
          <Typography>{column.headerName}</Typography>

          <LockIcon htmlColor={iron[800]} />
        </Stack>
      </PadBox>
    </Stack>
  );
}
