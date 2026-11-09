import { useGetDeviceType } from "@codezee/sixtify-brahma";
import { MenuItem, Pagination, Select, Stack, Typography } from "@mui/material";
import { useMemo } from "react";

export const pageSizeDefault = 50;

const DEFAULT_PAGE_SIZE_OPTIONS = [20, 50, 100, 200, 500];

export type DonationEntryListPaginationProps = {
  fullCount: number | string;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  page: number;
  pageSizeOptions?: number[];
  rowsPerPage: number;
};

export const DonationEntryListPagination = ({
  fullCount,
  onPageChange,
  onRowsPerPageChange,
  page,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  rowsPerPage,
}: DonationEntryListPaginationProps) => {
  const { isMobile, isNarrowMobile } = useGetDeviceType();

  const shouldShowPagination = Number(fullCount) > pageSizeDefault;

  const totalPages = useMemo(() => {
    return Math.ceil(Number(fullCount) / rowsPerPage);
  }, [fullCount, rowsPerPage]);

  const RowsPerPageSelector = useMemo(() => {
    return (
      <Stack
        direction="row"
        gap={1}
        alignItems="center"
        justifyContent="flex-end"
        flexWrap="wrap"
      >
        <Stack direction="row" gap={1} alignItems="center">
          <Typography variant="body2" fontSize={13} fontWeight={300}>
            Go to page
          </Typography>

          <Select
            size="medium"
            sx={{ fontSize: 14, height: 30, width: 68 }}
            value={page + 1}
            onChange={(e) => {
              onPageChange(Number(e.target.value) - 1);
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 200,
                },
              },
            }}
          >
            {Array.from({ length: totalPages }, (_, i) => {
              return (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1}
                </MenuItem>
              );
            })}
          </Select>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" fontSize={13} fontWeight={300}>
            Rows per page
          </Typography>

          <Select
            size="medium"
            sx={{ fontSize: 14, height: 30, width: 68 }}
            value={rowsPerPage}
            onChange={(e) => {
              const newSize = Number(e.target.value);

              onRowsPerPageChange(newSize);
              onPageChange(0);
            }}
          >
            {pageSizeOptions.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>
    );
  }, [
    onPageChange,
    onRowsPerPageChange,
    page,
    pageSizeOptions,
    rowsPerPage,
    totalPages,
  ]);

  return (
    shouldShowPagination && (
      <Stack
        direction="row"
        gap={1}
        alignItems="center"
        flexWrap="wrap"
        justifyContent="flex-end"
      >
        {RowsPerPageSelector}

        <Pagination
          page={page + 1}
          count={totalPages}
          variant="outlined"
          shape="rounded"
          color="secondary"
          siblingCount={isMobile ? 0 : 1}
          size={isNarrowMobile ? "small" : "medium"}
          boundaryCount={1}
          showFirstButton
          showLastButton
          onChange={(_, newPage) => {
            onPageChange(newPage - 1);
          }}
        />
      </Stack>
    )
  );
};
