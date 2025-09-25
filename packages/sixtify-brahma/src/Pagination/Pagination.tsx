import {
  TablePagination,
  type TablePaginationProps,
  useTheme,
} from "@mui/material";

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

  return (
    <TablePagination
      sx={{
        "& .MuiInputBase-root": {
          paddingRight: "10px",
        },
        "& .MuiTablePagination-select": {
          backgroundColor: "transparent !important",
        },
        "& .MuiTablePagination-input": {
          border: `1.5px solid ${grey[400]}`,
          borderRadius: "5px",
        },
      }}
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      {...rest}
    />
  );
};
