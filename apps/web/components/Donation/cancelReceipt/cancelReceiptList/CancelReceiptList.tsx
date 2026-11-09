import { useTheme } from "@mui/material";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useState } from "react";
import type { FieldValues } from "react-hook-form";

import type { CancelReceiptListRef } from "@web/app/donation/cancel-receipt/page";
import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { useCancelReceiptColumns } from "@web/components/Donation/cancelReceipt/cancelReceiptList/hooks/useCancelReceiptColumns";
import type { CancelReceipt } from "@web/components/Donation/cancelReceipt/cancelReceiptList/hooks/useGetCancelReceipt";
import { useGetCancelReceipt } from "@web/components/Donation/cancelReceipt/cancelReceiptList/hooks/useGetCancelReceipt";
import { useBranch } from "@web/context/BranchContext";
import { filterSearchParams } from "@web/utils/helper";

export type CancelReceiptListProps = {
  externalFilter?: FieldValues;
  search: string;
};

export const CancelReceiptList = forwardRef(
  (
    { externalFilter = {}, search }: CancelReceiptListProps,
    ref: ForwardedRef<CancelReceiptListRef>
  ) => {
    const router = useRouter();

    const theme = useTheme();

    const { red } = theme.palette.app.color;

    const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
      usePaginationParams();

    const { branchIds } = useBranch();

    const startRow = page * rowsPerPage;

    const endRow = startRow + rowsPerPage;

    const [agGridState, setAgGridState] = useState<{
      filterModel: FilterModel;
      sortModel: SortModelItem[];
    }>({
      filterModel: {},
      sortModel: [],
    });

    const { data, isFetching, refetch } = useGetCancelReceipt({
      endRow,
      externalFilter: { ...externalFilter, branch_id: [branchIds] },
      filterModel: agGridState.filterModel,
      quickFilter: filterSearchParams(search),
      sortModel: agGridState.sortModel,
      startRow,
    });

    const { cancelDonations, full_count } = data;

    const { column } = useCancelReceiptColumns();

    useImperativeHandle(ref, () => ({
      refreshCancelReceiptList() {
        refetch();
      },
    }));

    return (
      <AgGridV2<CancelReceipt>
        defaultColDef={{
          cellStyle: () => {
            return {
              color: red[500],
            };
          },
        }}
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={cancelDonations}
        onPageChange={onPageChange}
        count={full_count}
        onGridStateChange={setAgGridState}
        onRowsPerPageChange={onRowsPerPageChange}
        height={160}
        actions={[
          {
            onClick: (data) => {
              router.push(
                `/donation/donation-entry/${data.donation_id}?page=edit-donation-entry`
              );
            },
            title: t("common.edit"),
          },
        ]}
      />
    );
  }
);

CancelReceiptList.displayName = "CancelReceiptList";
