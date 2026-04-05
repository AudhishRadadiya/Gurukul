import type { GridApi } from "ag-grid-community";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import type z from "zod";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import type { EventDonationSchema } from "@web/components/Donation/donationEntry/addDonationEntry/hooks/DonationEntryFormSchema";
import { useDonationReceiptEntryListColumns } from "@web/components/Donation/donationEntry/dialogs/hooks/useDonationReceiptEntryListColumns";
import type { DonationReceiptEntryDetail } from "@web/components/Donation/donationEntry/dialogs/hooks/useGetDonationReceiptEntryDetail";
import { useGetDonationReceiptEntryDetail } from "@web/components/Donation/donationEntry/dialogs/hooks/useGetDonationReceiptEntryDetail";

type DonationReceiptEntryListProps = {
  contactNumber: string;
};

export type EventDonationFormFieldValues = z.infer<typeof EventDonationSchema>;

export const DonationReceiptEntryList = ({
  contactNumber,
}: DonationReceiptEntryListProps) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const methods = useFormContext();

  const { setValue, watch } = methods;

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching } = useGetDonationReceiptEntryDetail({
    endRow,
    externalFilter: { contact_no: contactNumber },
    startRow,
  });

  const { eventDonations, totalCount } = data;

  const eventDonationData = watch("event_donation");

  const handleAmountEdit = (
    rowData: DonationReceiptEntryDetail,
    newAmount: number
  ) => {
    const filteredDonationData: EventDonationFormFieldValues[] =
      eventDonationData?.filter(
        ({ event_donation_id }: EventDonationFormFieldValues) =>
          event_donation_id !== rowData.event_donation_id
      ) || [];

    const updatedEventDonation: EventDonationFormFieldValues = {
      amount: newAmount,
      event_donation_id: rowData.event_donation_id,
    };

    const updatedEventDonations: EventDonationFormFieldValues[] = [
      ...filteredDonationData,
      updatedEventDonation,
    ];

    const totalEventDonationAmount = updatedEventDonations.reduce(
      (acc, curr) => acc + (curr.amount ?? 0),
      0
    );

    setValue("amount", totalEventDonationAmount, { shouldDirty: true });
    setValue("event_donation", updatedEventDonations, { shouldDirty: true });

    if (gridApi) {
      gridApi.refreshCells({ force: true });
    }
  };

  const { column } = useDonationReceiptEntryListColumns({
    onAmountEdit: handleAmountEdit,
  });

  const onGridReady = (params: { api: GridApi }) => {
    setGridApi(params.api);
  };

  useEffect(() => {
    if (!isFetching && eventDonations?.length > 0 && gridApi) {
      setTimeout(() => {
        gridApi.setFocusedCell(0, "event_master_name");

        const firstNode = gridApi.getDisplayedRowAtIndex(0);

        if (firstNode) {
          firstNode.setSelected(true);
        }
      }, 100);
    }
  }, [isFetching, eventDonations, gridApi]);

  return (
    <AgGridV2<DonationReceiptEntryDetail>
      isLoading={isFetching}
      page={page}
      count={totalCount}
      columnDefs={column}
      rowData={eventDonations}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      onGridReady={onGridReady}
      height={315}
    />
  );
};
