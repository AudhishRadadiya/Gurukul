import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { EditDonationReceiptEntryDialog } from "@web/components/Donation/donationEntry/dialogs/EditDonationReceiptEntryDialog";
import { useDonationReceiptEntryListColumns } from "@web/components/Donation/donationEntry/dialogs/hooks/useDonationReceiptEntryListColumns";
import type { DonationReceiptEntryDetail } from "@web/components/Donation/donationEntry/dialogs/hooks/useGetDonationReceiptEntryDetail";
import { useGetDonationReceiptEntryDetail } from "@web/components/Donation/donationEntry/dialogs/hooks/useGetDonationReceiptEntryDetail";

type DonationReceiptEntryListProps = {
  contactNumber: string;
};

export const DonationReceiptEntryList = ({
  contactNumber,
}: DonationReceiptEntryListProps) => {
  const [currentDonationReceiptEntry, setCurrentDonationReceiptEntry] =
    useState<DonationReceiptEntryDetail>({
      address: "",
      amount: 0,
      city: "",
      date: "",
      donar_name: "",
      event_donation_id: "",
      event_master_name: "",
      full_count: "",
      hastak_name: "",
      pending_amount: 0,
      received_amount: 0,
      remark: "",
    });

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching } = useGetDonationReceiptEntryDetail({
    endRow,
    externalFilter: { contact_no: contactNumber },
    startRow,
  });

  const { eventDonations, totalCount } = data;

  const { column } = useDonationReceiptEntryListColumns();

  const dialogRenderer: DialogRenderer = {
    edit: (
      <EditDonationReceiptEntryDialog
        open
        onClose={onDialogClose}
        donationReceiptEntryDetails={currentDonationReceiptEntry}
      />
    ),
  };

  return (
    <>
      <AgGridV2<DonationReceiptEntryDetail>
        isLoading={isFetching}
        page={page}
        count={totalCount}
        columnDefs={column}
        rowData={eventDonations}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        height={315}
        actions={[
          {
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentDonationReceiptEntry(data);
            },
            title: t("common.edit"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
