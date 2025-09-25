import { t } from "i18next";
import { useRouter } from "next/navigation";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";

import type { CancelReceiptListRef } from "@web/app/donation/cancel-receipt/page";
import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { useCancelReceiptColumns } from "@web/components/Donation/cancelReceipt/cancelReceiptList/hooks/useCancelReceiptColumns";
import type { CancelReceipt } from "@web/components/Donation/cancelReceipt/cancelReceiptList/hooks/useGetCancelReceipt";
import { useGetCancelReceipt } from "@web/components/Donation/cancelReceipt/cancelReceiptList/hooks/useGetCancelReceipt";

export const CancelReceiptList = forwardRef(
  (_, ref: ForwardedRef<CancelReceiptListRef>) => {
    const router = useRouter();

    const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
      usePaginationParams();

    const startRow = page * rowsPerPage;

    const endRow = startRow + rowsPerPage;

    const { data, isFetching, refetch } = useGetCancelReceipt({
      endRow,
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
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={cancelDonations}
        onPageChange={onPageChange}
        count={full_count}
        onRowsPerPageChange={onRowsPerPageChange}
        height={200}
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
