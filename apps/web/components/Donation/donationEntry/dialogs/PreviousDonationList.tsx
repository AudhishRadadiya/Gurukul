import { useFormContext } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import type { DonationEntryFormNonNullFieldValues } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import type { PreviousDonationDetail } from "@web/components/Donation/donationEntry/dialogs/hooks/useGetPreviousDonationDetail";
import { useGetPreviousDonationDetail } from "@web/components/Donation/donationEntry/dialogs/hooks/useGetPreviousDonationDetail";
import { usePreviousDonationListColumns } from "@web/components/Donation/donationEntry/dialogs/hooks/usePreviousDonationListColumns";

type PreviousDonationListProps = {
  contactNumber: string;
  setToggleDonationEntryList: (data: boolean) => void;
};

const donationEntryFields = [
  "first_name",
  "middle_name",
  "last_name",
  "name_of_receipt",
  "address",
  "city",
  "email_id",
  "pan_no",
  "driving_licence_no",
  "aadhar_no",
] as const;

export const PreviousDonationList = ({
  contactNumber,
  setToggleDonationEntryList,
}: PreviousDonationListProps) => {
  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const methods = useFormContext<DonationEntryFormNonNullFieldValues>();

  const { clearErrors, setValue } = methods;

  const { data, isFetching } = useGetPreviousDonationDetail({
    contact_no: contactNumber,
    endRow,
    startRow,
  });

  const { donationDetail, totalCount } = data;

  const { column } = usePreviousDonationListColumns({
    onAction: (actionType, previousDonation) => {
      if (actionType === "receiptEntry") {
        setToggleDonationEntryList(true);
      }

      donationEntryFields.forEach((field) => {
        setValue(field, previousDonation[field], {
          shouldDirty: true,
        });
      });

      clearErrors(donationEntryFields);
    },
  });

  return (
    <AgGridV2<PreviousDonationDetail>
      isLoading={isFetching}
      page={page}
      count={totalCount}
      columnDefs={column}
      rowData={donationDetail}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      height={315}
    />
  );
};
