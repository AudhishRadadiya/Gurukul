import { LoadingCell } from "@codezee/sixtify-brahma";
import { Chip } from "@mui/material";

export type TableStatusProps = {
  loading?: boolean;
  value?: boolean;
};

export function TableStatusCell({
  loading = false,
  value,
}: Readonly<TableStatusProps>) {
  if (loading) {
    return <LoadingCell />;
  }

  if (value) {
    return <Chip label="Yes" />;
  }

  if (value === false) {
    return <Chip label="No" color="error" />;
  }
}
