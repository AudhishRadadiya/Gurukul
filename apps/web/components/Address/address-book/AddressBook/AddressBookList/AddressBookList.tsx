import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  ActionButtons,
  Button,
  ColumnArrangerDialog,
  ColumnIconAction,
  PadBox,
  toasts,
  useDialogActions,
} from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Stack } from "@mui/material";
import type { FilterModel, IGetRowsParams } from "ag-grid-community";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  useGetAddress,
  type AddressBookDetails,
} from "@web/components/Address/address-book/AddressBook/AddressBookList/hooks/useGetAddressBook";
import { useGetAddressBookColumns } from "@web/components/Address/address-book/AddressBook/AddressBookList/hooks/useGetAddressBookColumns";
import { useGetAddressBookExport } from "@web/components/Address/address-book/AddressBook/AddressBookList/hooks/useGetAddressBookExport";
import type { GetAddressBookPdfApiSuccessResponse } from "@web/components/Address/address-book/AddressBook/AddressBookList/hooks/useGetAddressBookPdf";
import { useGetAddressBookPdf } from "@web/components/Address/address-book/AddressBook/AddressBookList/hooks/useGetAddressBookPdf";
import { useGetAddressPdf } from "@web/components/Address/address-book/AddressBook/AddressBookList/hooks/useGetAddressPdf";
import type { AddressBookColumnHideTypes } from "@web/components/Address/address-book/template/dialogs/hooks/templateTypes";
import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

type AddressBookListProps = {
  columnHide: AddressBookColumnHideTypes;
  setColumnHide: (col: AddressBookColumnHideTypes) => void;
};

export const AddressBookList = ({
  columnHide,
  setColumnHide,
}: AddressBookListProps) => {
  const router = useRouter();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { columns } = useGetAddressBookColumns({
    columnHide,
  });

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching } = useGetAddress({
    endRow,
    filterModel: agGridFilterModel,
    startRow,
  });

  const { addressBookDetails, totalCount } = data || {};

  const { isPending: isPendingGetAddressBook, mutate: printAddressBook } =
    useGetAddressBookPdf({
      addressBookIds: selectedRows,
      options: {
        onError: (error) => onError(error),
        onSuccess: ({ data, message }: GetAddressBookPdfApiSuccessResponse) => {
          toasts.success({ title: message });
          window.open(data.pdfUrl, "_blank");
        },
      },
    });

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

  const getExportParams = (): Partial<IGetRowsParams> => ({
    endRow: 1000,
    filterModel: agGridFilterModel,
    startRow: 0,
  });

  const { mutate: exportData } = useGetAddressBookExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({ data, message }) => {
        toasts.success({ title: message });
        window.open(data.pdfUrl, "_blank");
      },
    },
  });

  const handleExport = (fileType: FilType) => {
    exportData({
      body: getExportParams(),
      fileType,
    });
  };

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
  };

  return (
    <>
      <PadBox padding={{ padding: "3px 5px" }}>
        <Stack
          direction="row"
          gap="10px"
          justifyContent="end"
          alignItems="center"
        >
          <Button
            loading={isPendingGetAddressBook}
            variant="outlined"
            onClick={() => {
              printAddressBook();
            }}
            disabled={!selectedRows.length}
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
          >
            {t("address.book.btn.print.detail")}
          </Button>

          <ActionButtons
            buttons={[
              {
                dataCy: "export",
                dataPTag: "export",
                endIcon: <ExpandMoreIcon />,
                key: "right",
                label: "Export",
                menuItems: [
                  {
                    dataCy: "xls",
                    dataPTag: "xls",
                    key: "xls",
                    label: "Download XLS",
                    onClick: () => {
                      handleExport("excel");
                    },
                  },
                  {
                    dataCy: "pfd",
                    dataPTag: "pfd",
                    key: "pfd",
                    label: "Download PDF",
                    onClick: () => {
                      handleExport("pdf");
                    },
                  },
                ],
                menuPlacement: "left",
                size: "small",
                variant: "outlined",
              },
            ]}
          />
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => {
              router.push("/address/address-book?page=add-address-book");
            }}
          >
            {t("common.button.add", {
              label: t("address.label"),
            })}
          </Button>

          <ColumnIconAction
            onClick={() => {
              onDialogOpen("columnChooser");
            }}
          />
        </Stack>
      </PadBox>

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
        onFilterChange={setAgGridFilterModel}
        height={270}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
