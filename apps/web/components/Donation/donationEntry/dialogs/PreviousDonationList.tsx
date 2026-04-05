import type { CellKeyDownEvent, GridApi } from "ag-grid-community";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import type { DonationEntryFormFieldValues } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import type { PreviousDonationDetail } from "@web/components/Donation/donationEntry/dialogs/hooks/useGetPreviousDonationDetail";
import { useGetPreviousDonationDetail } from "@web/components/Donation/donationEntry/dialogs/hooks/useGetPreviousDonationDetail";
import { usePreviousDonationListColumns } from "@web/components/Donation/donationEntry/dialogs/hooks/usePreviousDonationListColumns";

type PreviousDonationListProps = {
  contactNumber: string;
  onClose: () => void;
  setToggleDonationEntryList: (data: boolean) => void;
};

export const donationEntryFields = [
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
  "pincode",
] as const;

export const PreviousDonationList = ({
  contactNumber,
  onClose,
  setToggleDonationEntryList,
}: PreviousDonationListProps) => {
  const [gridApi, setGridApi] =
    useState<GridApi<PreviousDonationDetail> | null>(null);

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const methods = useFormContext<DonationEntryFormFieldValues>();

  const { clearErrors, setValue } = methods;

  const { data, isFetching } = useGetPreviousDonationDetail({
    contact_no: contactNumber,
    endRow,
    startRow,
  });

  const { donationDetail, totalCount } = data;

  const handleFillData = (previousDonation: PreviousDonationDetail) => {
    const { first_name, last_name, middle_name } = previousDonation;

    const receiptName = [first_name, middle_name, last_name]
      .filter(Boolean)
      .join(" ");

    const previousDonationData = {
      address: previousDonation.address,
      city: previousDonation.city,
      email_id: previousDonation.email_id,
      pan_no: previousDonation.pan_no,
      pincode: previousDonation.pincode,
      state: previousDonation.state,
    };

    setValue("selected_previousDonation", previousDonationData, {
      shouldDirty: true,
    });

    donationEntryFields.forEach((field) => {
      if (field === "name_of_receipt" && !previousDonation[field]) {
        setValue(field, receiptName, { shouldDirty: true });
      }

      if (previousDonation[field]) {
        setValue(field, previousDonation[field], {
          shouldDirty: true,
        });
      }
    });

    clearErrors(donationEntryFields);
    setToggleDonationEntryList(false);
  };

  const { column } = usePreviousDonationListColumns({
    onAction: (actionType, previousDonation) => {
      if (actionType === "history") {
        handleFillData(previousDonation);
        onClose();
      } else if (actionType === "receiptEntry") {
        setToggleDonationEntryList(true);
      }
    },
  });

  const onGridReady = (params: { api: GridApi<PreviousDonationDetail> }) => {
    setGridApi(params.api);
  };

  // Focus first row on load
  useEffect(() => {
    if (!isFetching && donationDetail?.length > 0 && gridApi) {
      setTimeout(() => {
        gridApi.setFocusedCell(0, "name_of_receipt");

        const firstNode = gridApi.getDisplayedRowAtIndex(0);

        if (firstNode) {
          firstNode.setSelected(true);
        }
      }, 100);
    }
  }, [isFetching, donationDetail, gridApi]);

  const handleCellKeyDown = (
    event: CellKeyDownEvent<PreviousDonationDetail>
  ) => {
    if (event.event && "key" in event.event && event.event.key === "Enter") {
      const rowData = event.data;

      if (!rowData) {
        return;
      }

      handleFillData(rowData);

      if (rowData.is_have_event_donation) {
        setToggleDonationEntryList(true);
      } else {
        onClose();
      }
    }
  };

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
      onCellKeyDown={handleCellKeyDown}
      onGridReady={onGridReady}
      height={315}
    />
  );
};
