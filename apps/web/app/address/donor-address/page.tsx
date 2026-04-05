"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  ActionButtons,
  Button,
  ContentBox,
  DatePicker,
  PadBox,
  toasts,
  useDialogActions,
} from "@codezee/sixtify-brahma";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { DonorAddressBreadcrumbs } from "@web/components/Address/DonorAddress/DonorAddressBreadcrumbs";
import { DonorAddressList } from "@web/components/Address/DonorAddress/DonorAddressList/DonorAddressList";
import { useEditAllInActiveDonorAddress } from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useEditAllInActiveDonorAddress";
import {
  type GetDonorAddressPDFApiSuccessResponse,
  useGetDonorAddressExport,
} from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useGetDonorAddressExport";
import { DateFilterPeriodAutocomplete } from "@web/components/common/Autocomplete/DateFilterPeriodAutocomplete";
import type { Status } from "@web/components/common/Autocomplete/hooks/useGetStatusOptions";
import { StatusAutocomplete } from "@web/components/common/Autocomplete/StatusAutocomplete";
import {
  ExportDialog,
  useExportDialog,
} from "@web/components/common/ExportDialog";
import { ALL } from "@web/components/common/hooks/constant";
import { ExportModule } from "@web/constants/export";
import { useBranch } from "@web/context/BranchContext";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { donorAddressKeys } from "@web/queryKeysFactories/donorAddress";
import type { FilType, GetListArgsAg2 } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

export type DonorAddressValues = {
  status: Status;
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { allowPrintExport } = useUserPermissions();

  const { branchIds } = useBranch();

  const formMethods = useForm<DonorAddressValues>({
    defaultValues: {
      status: ALL,
    },
  });

  const { control: statusControl, watch: watchStatus } = formMethods;

  const status = watchStatus("status");

  const { control: dateControl, fromDate, toDate } = useDateFilters();

  const queryClient = useQueryClient();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const resetExportStateRef = useRef<(() => void) | null>(null);

  const { isPending: isPendingExportDonorAddress, mutate: exportDonorAddress } =
    useGetDonorAddressExport({
      options: {
        onError: (error) => onError(error),
        onSuccess: ({
          data,
          message,
        }: GetDonorAddressPDFApiSuccessResponse) => {
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
    exportModule: ExportModule.DONATION_ADDRESS,
    onExport: (data) => {
      exportDonorAddress(data);
    },
  });

  resetExportStateRef.current = resetExportState;

  const getExportBody = (): GetListArgsAg2 => ({
    endRow: 0,
    externalFilter: {
      branch_id: [branchIds],
      from_date: fromDate,
      status,
      to_date: toDate,
    },
    filterModel: {},
    startRow: 0,
  });

  const getDonorAddressExport = (fileType: FilType) => {
    handleExport(fileType, getExportBody());
    onDialogOpen("exportOptions");
  };

  const { mutate: editAllInActiveDonorAddress } =
    useEditAllInActiveDonorAddress({
      options: {
        onError: (error) => onError(error),
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: donorAddressKeys.all,
          });

          toasts.success({ title: data.message });
        },
      },
    });

  const dialogRenderer: DialogRenderer = {
    exportOptions: (
      <ExportDialog
        error={otpError}
        open
        showOtpForm={showOtpForm}
        onClose={onDialogClose}
        onMaskSelect={handleMaskSelect}
        onOriginalSelect={handleOriginalSelect}
        onSubmit={handleOtpSubmit}
        isLoading={isPendingExportDonorAddress}
        isPendingSendExportOtp={isPendingSendExportOtp}
      />
    ),
  };

  return (
    <>
      <FormProvider {...formMethods}>
        <Stack gap="10px">
          <DonorAddressBreadcrumbs />

          <ContentBox>
            <PadBox padding={{ padding: "10px" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle1">
                  {t("common.donor.label", {
                    label: t("address.label"),
                  })}
                </Typography>

                <Stack direction="row" gap="10px" alignItems="center">
                  <DateFilterPeriodAutocomplete
                    name="date_filter_period"
                    control={dateControl}
                    clearIcon
                    sx={{ width: "160px" }}
                  />

                  <DatePicker
                    control={dateControl}
                    name="from_date"
                    clearable={false}
                    containerProps={{ width: "160px" }}
                  />

                  <DatePicker
                    control={dateControl}
                    name="to_date"
                    minDate={
                      fromDate ? DateTime.fromISO(fromDate) : DateTime.now()
                    }
                    clearable={false}
                    containerProps={{ width: "160px" }}
                  />

                  <Button
                    variant="outlined"
                    onClick={() => {
                      editAllInActiveDonorAddress({
                        donation_ids: selectedRows,
                      });
                    }}
                    disabled={!selectedRows.length}
                  >
                    {t("allInactive.label")}
                  </Button>

                  <PermissionGuard canAccess={allowPrintExport}>
                    <ActionButtons
                      buttons={[
                        {
                          dataCy: "export",
                          dataPTag: "export",
                          endIcon: <ExpandMoreIcon />,
                          key: "right",
                          label: t("export.label"),
                          menuItems: [
                            {
                              dataCy: "xls",
                              dataPTag: "xls",
                              key: "xls",
                              label: t("common.file.label", {
                                label: t("excel.label"),
                              }),
                              onClick: () => {
                                getDonorAddressExport("excel");
                              },
                            },
                            {
                              dataCy: "pfd",
                              dataPTag: "pfd",
                              key: "pfd",
                              label: t("common.file.label", {
                                label: t("pdf.label"),
                              }),
                              onClick: () => {
                                getDonorAddressExport("pdf");
                              },
                            },
                          ],
                          menuPlacement: "left",
                          size: "small",
                          variant: "outlined",
                        },
                      ]}
                    />
                  </PermissionGuard>

                  <StatusAutocomplete
                    name="status"
                    control={statusControl}
                    closeText="Close"
                  />
                </Stack>
              </Stack>
            </PadBox>

            <DonorAddressList
              setSelectedRows={setSelectedRows}
              status={status}
              externalDateFilter={{
                from_date: fromDate,
                to_date: toDate,
              }}
            />
          </ContentBox>
        </Stack>
      </FormProvider>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
