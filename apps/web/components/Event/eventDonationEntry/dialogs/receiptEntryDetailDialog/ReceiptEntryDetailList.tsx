import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import type { ReceiptEntryDonationDetail } from "@web/components/Event/eventDonationEntry/dialogs/receiptEntryDetailDialog/hooks/useGetReceiptEntryDetail";
import { useGetReceiptEntryDetail } from "@web/components/Event/eventDonationEntry/dialogs/receiptEntryDetailDialog/hooks/useGetReceiptEntryDetail";
import { useReceiptEntryDetailListColumns } from "@web/components/Event/eventDonationEntry/dialogs/receiptEntryDetailDialog/useReceiptEntryDetailListColumns";

type ReceiptEntryDetailListProps = {
  dailyDonationId: string;
};

export const ReceiptEntryDetailList = ({
  dailyDonationId,
}: ReceiptEntryDetailListProps) => {
  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching } = useGetReceiptEntryDetail({
    endRow,
    externalFilter: {
      daily_donation_id: dailyDonationId,
    },
    startRow,
  });

  const { eventDonations, totalCount } = data;

  const { column } = useReceiptEntryDetailListColumns();

  return (
    <AgGridV2<ReceiptEntryDonationDetail>
      isLoading={isFetching}
      page={page}
      count={totalCount}
      columnDefs={column}
      rowData={eventDonations}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      height={315}
    />
  );
};
