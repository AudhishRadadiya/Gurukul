import { defaultPageSize } from "@codezee/sixtify-brahma";
import { useState } from "react";

export const usePaginationParams = () => {
  const [paginationParams, setPaginationParams] = useState({
    page: 0,
    rowsPerPage: defaultPageSize,
  });

  const { page, rowsPerPage } = paginationParams;

  const onPageChange = (currentPage: number) => {
    setPaginationParams((prev) => ({
      ...prev,
      page: currentPage,
    }));
  };

  const onRowsPerPageChange = (pageSize: number) => {
    setPaginationParams((prev) => ({
      ...prev,
      rowsPerPage: pageSize,
    }));
  };

  return {
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
  };
};
