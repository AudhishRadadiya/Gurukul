import {
  TablePagination,
  type TablePaginationProps,
  useTheme,
} from "@mui/material";
import { useGetDeviceType } from "../utils";

export const Pagination = ({
  count,
  page,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  ...rest
}: TablePaginationProps) => {
  const theme = useTheme();

  const { grey } = theme.palette;

  const { layout } = useGetDeviceType();

  const isMobile = layout === "mobile";

  return (
    <TablePagination
      sx={{
        "& .MuiInputBase-root": {
          height: "30px",
        },
        "& .MuiToolbar-root": {
          paddingLeft: 0,
        },
        "& .MuiTablePagination-select": {
          backgroundColor: "transparent !important",
        },
        "& .MuiTablePagination-input": {
          border: `1.5px solid ${grey[400]}`,
          borderRadius: "5px",
          fontSize: "14px",
          padding: isMobile ? "2px 10px" : "4px 8px",
        },
      }}
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      labelRowsPerPage={!isMobile ? "Rows per page" : ""}
      {...rest}
    />
  );
};
