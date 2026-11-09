import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
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
import { useRef, useState } from "react";

import type { BusinessDetail } from "@web/components/Address/address-book/BusinessDetail/BusinessDetailList/hooks/useGetBusinessDetail";
import { useGetBusinessDetail } from "@web/components/Address/address-book/BusinessDetail/BusinessDetailList/hooks/useGetBusinessDetail";
import { useGetBusinessDetailColumns } from "@web/components/Address/address-book/BusinessDetail/BusinessDetailList/hooks/useGetBusinessDetailColumns";
import type { GetBusinessDetailExportApiSuccessResponse } from "@web/components/Address/address-book/BusinessDetail/BusinessDetailList/hooks/useGetBusinessDetailExport";
import { useGetBusinessDetailExport } from "@web/components/Address/address-book/BusinessDetail/BusinessDetailList/hooks/useGetBusinessDetailExport";
import type { BusinessDetailColumnHideTypes } from "@web/components/Address/address-book/template/dialogs/hooks/templateTypes";
import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import {
  ExportDialog,
  useExportDialog,
} from "@web/components/common/ExportDialog";
import { ExportModule } from "@web/constants/export";
import { useBranch } from "@web/context/BranchContext";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

type BusinessDetailListProps = {
  columnHide: BusinessDetailColumnHideTypes;
  setColumnHide: (col: BusinessDetailColumnHideTypes) => void;
};

export const BusinessDetailList = ({
  columnHide,
  setColumnHide,
}: BusinessDetailListProps) => {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { isMobile } = useGetDeviceType();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const { branchIds } = useBranch();

  const { allowPrintExport } = useUserPermissions();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching } = useGetBusinessDetail({
    endRow,
    externalFilter: { branch_id: [branchIds] },

    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { business_detail: rowData, totalCount } = data || {};

  const { columns } = useGetBusinessDetailColumns({
    columnHide,
  });

  const resetExportStateRef = useRef<(() => void) | null>(null);

  const {
    isPending: isPendingExportBusinessDetail,
    mutate: exportBusinessDetail,
  } = useGetBusinessDetailExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetBusinessDetailExportApiSuccessResponse) => {
        resetExportStateRef.current?.();
        onDialogClose();
        window.open(data.url, "_blank");
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
    exportModule: ExportModule.BUSINESS_DETAIL,
    onExport: (data) => {
      exportBusinessDetail(data);
    },
  });

  resetExportStateRef.current = resetExportState;

  const getExportBody = () => ({
    endRow: 0,
    externalFilter: {
      branch_id: [branchIds],
    },
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow: 0,
  });

  const onExport = (fileType: FilType) => {
    handleExport(fileType, getExportBody());
    onDialogOpen("exportOptions");
  };

  const dialogRenderer: DialogRenderer = {
    columnChooser: (
      <ColumnArrangerDialog<BusinessDetailColumnHideTypes>
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
        isLoading={isPendingExportBusinessDetail}
        isPendingSendExportOtp={isPendingSendExportOtp}
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
        >
          <PermissionGuard canAccess={allowPrintExport}>
            <DataExport onExport={onExport} />
          </PermissionGuard>

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
        <AgGridV2<BusinessDetail>
          isLoading={isFetching}
          page={page}
          columnDefs={columns}
          rowsPerPage={rowsPerPage}
          rowData={rowData}
          onPageChange={onPageChange}
          count={totalCount}
          onRowsPerPageChange={onRowsPerPageChange}
          onGridStateChange={setAgGridState}
          height={isMobile ? 230 : 290}
        />
      </Box>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
