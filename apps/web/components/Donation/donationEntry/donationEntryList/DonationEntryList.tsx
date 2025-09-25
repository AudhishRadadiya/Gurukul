import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  Button,
  ColumnArrangerDialog,
  ColumnIconAction,
  PadBox,
  toasts,
  useDialogActions,
} from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { Mail, PrintingPage } from "iconoir-react";
import _split from "lodash/split";
import { DateTime } from "luxon";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import type { DonationEntryApiSuccessResponse } from "@web/components/Donation/donationEntry/addDonationEntry/hooks/useAddDonationEntry";
import { MailConfirmationDialog } from "@web/components/Donation/donationEntry/dialogs/bulkMail/MailConfirmationDialog";
import { DonationEntryFilter } from "@web/components/Donation/donationEntry/donationEntryList/DonationEntryFilter";
import type { DonationEntryColumnHideTypes } from "@web/components/Donation/donationEntry/donationEntryList/hooks/templateTypes";
import { useCancelDonationEntry } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useCancelDonationEntry";
import { useDonationEntryColumns } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useDonationEntryColumns";
import type { GetDonationAddressPdfApiSuccessResponse } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationAddressPdf";
import { useGetDonationAddressPdf } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationAddressPdf";
import {
  type DonationEntry,
  useGetDonationEntry,
} from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationEntry";
import type { GetDonationEntryExportApiSuccessResponse } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationEntryExport";
import { useGetDonationEntryExport } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationEntryExport";
import type { GetDonationLetterApiSuccessResponse } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationLettet";
import { useGetDonationLetter } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationLettet";
import type { GetDonationReceiptApiSuccessResponse } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationReceipt";
import { useGetDonationReceipt } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationReceipt";
import { DONATION_ENTRY_PERMISSION } from "@web/constants/permission/donation/donationEntry/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

export type DonationEntryListProps = {
  columnHide: DonationEntryColumnHideTypes;
  isDonationEntryList: boolean;
  setColumnHide: (col: DonationEntryColumnHideTypes) => void;
};

const EVENT_SUMMARY = "event-summary";

export const fromFilterDate = DateTime.now().minus({ months: 3 }).toISODate();
export const toFilterDate = DateTime.now().toISODate();

export const DonationEntryList = ({
  columnHide,
  setColumnHide,
}: DonationEntryListProps) => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { validateAccess } = useUserPermissions();

  const params = Object.fromEntries(searchParams.entries());

  const { contact_no, event_type_id, page: moduleName, ...restParams } = params;

  const [filterListData, setFilterListData] = useState<FieldValues>({
    from_date: fromFilterDate,
    to_date: toFilterDate,
  });

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  useMemo(() => {
    const trustId = searchParams.get("trust_id");

    setFilterListData((prev) => ({
      ...prev,
      ...restParams,
      ...(!!trustId && {
        trust_id: EVENT_SUMMARY === moduleName ? _split(trustId, ",") : trustId,
      }),
    }));
  }, []);

  const {
    data: donationEntryList,
    isFetching,
    refetch,
  } = useGetDonationEntry({
    endRow,
    externalFilter: {
      ...filterListData,
      ...(contact_no && { contact_no }),
      ...(event_type_id && { event_type_id }),
    },
    filterModel: agGridFilterModel,
    startRow,
  });

  const { mutate } = useGetDonationEntryExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetDonationEntryExportApiSuccessResponse) => {
        window.open(data.url, "_blank");

        toasts.success({ title: message });
      },
    },
  });

  const onExport = (fileType: FilType) => {
    mutate({
      body: {
        endRow,
        externalFilter: filterListData,
        filterModel: agGridFilterModel,
        startRow,
      },
      fileType,
    });
  };

  const { columns } = useDonationEntryColumns({
    columnHide,
  });

  const dialogRenderer: DialogRenderer = {
    columnChooser: (
      <ColumnArrangerDialog<DonationEntryColumnHideTypes>
        columns={columns}
        title={t("common.column.chooser")}
        open
        onClose={onDialogClose}
        onSave={(columns) => {
          setColumnHide(columns);
        }}
      />
    ),
    confirmation: (
      <MailConfirmationDialog
        open
        onClose={onDialogClose}
        selectedRows={selectedRows}
      />
    ),
  };

  const { isPending: isPendingPrintAddress, mutate: printAddress } =
    useGetDonationAddressPdf({
      donationIds: selectedRows,
      options: {
        onError: (error) => onError(error),
        onSuccess: ({
          data,
          message,
        }: GetDonationAddressPdfApiSuccessResponse) => {
          toasts.success({ title: message });
          window.open(data.pdfUrl, "_blank");
        },
      },
    });

  const { mutate: donationLetter } = useGetDonationLetter({
    options: {
      onError: (error) => onError(error),

      onSuccess: ({ data, message }: GetDonationLetterApiSuccessResponse) => {
        toasts.success({ title: message });

        window.open(data.letterUrl, "_blank");
      },
    },
  });

  const { mutate: donationReceipt } = useGetDonationReceipt({
    options: {
      onError: (error) => onError(error),

      onSuccess: ({ data, message }: GetDonationReceiptApiSuccessResponse) => {
        toasts.success({ title: message });

        window.open(data.pdfUrl, "_blank");
      },
    },
  });

  const { mutate: cancelDonationEntry } = useCancelDonationEntry({
    options: {
      onError: (error) => onError(error),

      onSuccess: ({ message }: DonationEntryApiSuccessResponse) => {
        toasts.success({ title: message });

        refetch();
      },
    },
  });

  const { donationDetail, full_count } = donationEntryList;

  return (
    <>
      <PadBox padding={{ padding: "3px 5px" }}>
        <Stack
          direction="row"
          gap="10px"
          justifyContent="end"
          alignItems="center"
        >
          <DonationEntryFilter
            filterListData={filterListData}
            setFilterListData={setFilterListData}
          />

          <Button
            variant="outlined"
            startIcon={<Mail width={20} height={20} />}
            onClick={() => {
              onDialogOpen("confirmation");
            }}
            disabled={!selectedRows.length}
          >
            {t("common.bulk.mail")}
          </Button>

          <Button
            loading={isPendingPrintAddress}
            variant="outlined"
            startIcon={<PrintingPage width={20} height={20} />}
            onClick={() => {
              printAddress();
            }}
            disabled={!selectedRows.length}
          >
            {t("common.print.address")}
          </Button>

          <DataExport onExport={onExport} />

          <ColumnIconAction
            onClick={() => {
              onDialogOpen("columnChooser");
            }}
          />
        </Stack>
      </PadBox>

      <AgGridV2<DonationEntry>
        rowSelection="multiple"
        getRowId={(params) => params.data.donation_id}
        isLoading={isFetching}
        page={page}
        count={full_count}
        columnDefs={columns}
        onSelectionChanged={setSelectedRows}
        rowData={donationDetail}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onFilterChange={setAgGridFilterModel}
        onRowsPerPageChange={onRowsPerPageChange}
        height={255}
        actions={[
          {
            isView: validateAccess(DONATION_ENTRY_PERMISSION.EDIT),
            onClick: (data) => {
              router.push(
                `/donation/donation-entry/${data.donation_id}?page=edit-donation-entry`
              );
            },
            title: t("common.edit"),
          },
          {
            onClick: (data) => {
              donationLetter({
                donation_id: data.donation_id,
              });
            },
            title: t("common.donation.letter"),
          },
          {
            onClick: (data) => {
              donationReceipt({
                donation_id: data.donation_id,
              });
            },
            title: t("donationReceipt.label"),
          },
          {
            onClick: (data) => {
              cancelDonationEntry({
                donation_id: data.donation_id,
                is_cancel: true,
              });
            },
            title: t("common.cancel.button"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
