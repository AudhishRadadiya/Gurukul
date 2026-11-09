import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  Button,
  ColumnArrangerDialog,
  ColumnIconAction,
  PadBox,
  toasts,
  useDialogActions,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Box, Stack } from "@mui/material";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";

import {
  useGetAddress,
  type AddressBookDetails,
} from "@web/components/Address/address-book/AddressBook/AddressBookList/hooks/useGetAddressBook";
import { useGetAddressBookColumns } from "@web/components/Address/address-book/AddressBook/AddressBookList/hooks/useGetAddressBookColumns";
import type { GetAddressBookExportApiSuccessResponse } from "@web/components/Address/address-book/AddressBook/AddressBookList/hooks/useGetAddressBookExport";
import { useGetAddressBookExport } from "@web/components/Address/address-book/AddressBook/AddressBookList/hooks/useGetAddressBookExport";
import type { GetAddressBookPdfApiSuccessResponse } from "@web/components/Address/address-book/AddressBook/AddressBookList/hooks/useGetAddressBookPdf";
import { useGetAddressBookPdf } from "@web/components/Address/address-book/AddressBook/AddressBookList/hooks/useGetAddressBookPdf";
import { useGetAddressPdf } from "@web/components/Address/address-book/AddressBook/AddressBookList/hooks/useGetAddressPdf";
import { usePrintAddressBookDialog } from "@web/components/Address/address-book/AddressBook/AddressBookList/hooks/usePrintAddressBookDialog";
import type { AddressBookColumnHideTypes } from "@web/components/Address/address-book/template/dialogs/hooks/templateTypes";
import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import {
  ExportDialog,
  useExportDialog,
} from "@web/components/common/ExportDialog";
import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { ExportModule } from "@web/constants/export";
import { useBranch } from "@web/context/BranchContext";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

type AddressBookListProps = {
  columnHide: AddressBookColumnHideTypes;
  externalDateFilter?: FieldValues;
  setColumnHide: (col: AddressBookColumnHideTypes) => void;
};

export const AddressBookList = ({
  columnHide,
  externalDateFilter,
  setColumnHide,
}: AddressBookListProps) => {
  const router = useRouter();

  const { isMobile } = useGetDeviceType();

  const buttonSize = isMobile ? "small" : "medium";

  const { branchIds } = useBranch();

  const { allowPrintExport } = useUserPermissions();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { columns } = useGetAddressBookColumns({
    columnHide,
  });

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching } = useGetAddress({
    endRow,
    externalFilter: { ...externalDateFilter, branch_id: [branchIds] },
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { addressBookDetails, totalCount } = data || {};

  const resetExportStateRef = useRef<(() => void) | null>(null);

  const resetPrintStateRef = useRef<(() => void) | null>(null);

  const { isPending: isPendingExportAddressBook, mutate: exportAddressBook } =
    useGetAddressBookExport({
      options: {
        onError: (error) => onError(error),
        onSuccess: ({
          data,
          message,
        }: GetAddressBookExportApiSuccessResponse) => {
          resetExportStateRef.current?.();
          onDialogClose();

          window.open(data.pdfUrl, "_blank");

          toasts.success({ title: message });
        },
      },
    });

  const {
    handleExport,
    handleMaskSelect,
    handleOriginalSelect,
    handleOtpSubmit,
    isPendingSendExportOtp,
    otpError,
    resetExportState,
    showOtpForm,
  } = useExportDialog({
    exportModule: ExportModule.ADDRESS_BOOK,
    onExport: (data) => {
      exportAddressBook(data);
    },
  });

  resetExportStateRef.current = resetExportState;

  const getExportBody = () => ({
    endRow: 0,
    externalFilter: { ...externalDateFilter, branch_id: [branchIds] },
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow: 0,
  });

  const onExport = (fileType: FilType) => {
    handleExport(fileType, getExportBody());
    onDialogOpen("exportOptions");
  };

  const { isPending: isPendingGetAddressBook, mutate: printAddressBook } =
    useGetAddressBookPdf({
      addressBookIds: selectedRows,
      options: {
        onError: (error) => onError(error),
        onSuccess: ({ data, message }: GetAddressBookPdfApiSuccessResponse) => {
          resetPrintStateRef.current?.();
          onDialogClose();

          toasts.success({ title: message });
          window.open(data.pdfUrl, "_blank");
        },
      },
    });

  const {
    handleMaskSelect: handlePrintMaskSelect,
    handleOriginalSelect: handlePrintOriginalSelect,
    handleOtpSubmit: handlePrintOtpSubmit,
    handlePrintInit,
    isPendingSendExportOtp: isPendingSendPrintOtp,
    otpError: printOtpError,
    resetPrintState,
    showOtpForm: showPrintOtpForm,
  } = usePrintAddressBookDialog({
    exportModule: ExportModule.ADDRESS_BOOK,
    onPrint: (data) => {
      printAddressBook(data);
    },
  });

  resetPrintStateRef.current = resetPrintState;

  const onPrintAddressBook = () => {
    handlePrintInit();
    onDialogOpen("printAddressBookOptions");
  };

  const { isPending: isPendingPrintAddress, mutate: printAddress } =
    useGetAddressPdf({
      addressBookIds: selectedRows,
      options: {
        onError: (error) => onError(error),
        onSuccess: ({ data, message }: GetAddressBookPdfApiSuccessResponse) => {
          toasts.success({ title: message });
          window.open(data.pdfUrl, "_blank");
        },
      },
    });

  const dialogRenderer: DialogRenderer = {
    columnChooser: (
      <ColumnArrangerDialog<AddressBookColumnHideTypes>
        columns={columns}
        title={t("common.column.chooser")}
        open
        onClose={onDialogClose}
        onSave={(columns) => {
          setColumnHide(columns);
        }}
      />
    ),
    exportOptions: (
      <ExportDialog
        error={otpError}
        open
        showOtpForm={showOtpForm}
        onClose={onDialogClose}
        onMaskSelect={handleMaskSelect}
        onOriginalSelect={handleOriginalSelect}
        onSubmit={handleOtpSubmit}
        isLoading={isPendingExportAddressBook}
        isPendingSendExportOtp={isPendingSendExportOtp}
      />
    ),
    printAddressBookOptions: (
      <ExportDialog
        error={printOtpError}
        open
        showOtpForm={showPrintOtpForm}
        onClose={onDialogClose}
        onMaskSelect={handlePrintMaskSelect}
        onOriginalSelect={handlePrintOriginalSelect}
        onSubmit={handlePrintOtpSubmit}
        isLoading={isPendingGetAddressBook}
        isPendingSendExportOtp={isPendingSendPrintOtp}
      />
    ),
  };

  return (
    <>
      <PadBox padding={{ padding: { md: "3px 5px", xs: "8px 10px" } }}>
        <Stack
          direction="row"
          gap={1}
          justifyContent={{ md: "flex-end", xs: "flex-start" }}
          alignItems="center"
          flexWrap="wrap"
          sx={{ minWidth: 0, width: "100%" }}
        >
          <PermissionGuard canAccess={allowPrintExport}>
            <Button
              loading={isPendingGetAddressBook}
              variant="outlined"
              onClick={onPrintAddressBook}
              disabled={!selectedRows.length}
              size={buttonSize}
            >
              {t("address.book.btn.print.book")}
            </Button>

            <Button
              loading={isPendingPrintAddress}
              variant="outlined"
              onClick={() => {
                printAddress();
              }}
              disabled={!selectedRows.length}
              size={buttonSize}
            >
              {t("address.book.btn.print.detail")}
            </Button>

            <Box sx={{ flexShrink: 0 }}>
              <DataExport onExport={onExport} />
            </Box>
          </PermissionGuard>

          <ButtonLayoutProvider
            onClick={() => {
              router.push("/address/address-book?page=add-address-book");
            }}
            label={t("common.button.add", {
              label: t("address.label"),
            })}
            sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
          />

          <Box sx={{ flexShrink: 0, ml: { md: 0, xs: "auto" } }}>
            <ColumnIconAction
              onClick={() => {
                onDialogOpen("columnChooser");
              }}
            />
          </Box>
        </Stack>
      </PadBox>

      <Box sx={{ overflow: "hidden", width: "100%" }}>
        <AgGridV2<AddressBookDetails>
          rowSelection="multiple"
          getRowId={(params) => params.data.contact_id}
          isLoading={isFetching}
          page={page}
          columnDefs={columns}
          onSelectionChanged={setSelectedRows}
          rowsPerPage={rowsPerPage}
          rowData={addressBookDetails}
          onPageChange={onPageChange}
          count={totalCount}
          actions={[
            {
              onClick: (data) => {
                router.push(
                  `/address/address-book/${data.contact_id}?page=edit-address-book`
                );
              },
              title: t("common.edit"),
            },
          ]}
          onRowsPerPageChange={onRowsPerPageChange}
          onGridStateChange={setAgGridState}
          height={isMobile ? 250 : 300}
        />
      </Box>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
