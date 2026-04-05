"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  ContentBox,
  DatePicker,
  PadBox,
  toasts,
  useDialogActions,
} from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DateFilterPeriodAutocomplete } from "@web/components/common/Autocomplete/DateFilterPeriodAutocomplete";
import { FilterEventAutocomplete } from "@web/components/common/Autocomplete/FilterEventAutocomplete";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddEventDonationEntryDialog } from "@web/components/Event/eventDonationEntry/dialogs/AddEventDonationEntryDialog";
import { EventDonationEntryBreadcrumbs } from "@web/components/Event/eventDonationEntry/EventDonationEntryBreadcrumbs";
import { EventDonationEntryList } from "@web/components/Event/eventDonationEntry/eventDonationEntryList/EventDonationEntryList";
import type { GetEventDonationEntryExportApiSuccessResponse } from "@web/components/Event/eventDonationEntry/eventDonationEntryList/hooks/useGetEventDonationEntryExport";
import { useGetEventDonationEntryExport } from "@web/components/Event/eventDonationEntry/eventDonationEntryList/hooks/useGetEventDonationEntryExport";
import { EVENT_DONATION_ENTRY_PERMISSION } from "@web/constants/permission/event/eventDonationEntry/permission";
import { useBranch } from "@web/context/BranchContext";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { eventDonationEntryKeys } from "@web/queryKeysFactories/eventDonationEntryKeys";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

type EventDonationEntryProps = {
  event_id: string[];
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const queryClient = useQueryClient();

  const { branchIds } = useBranch();

  const { allowPrintExport, validateAccess } = useUserPermissions();

  const { control: eventControl, watch: watchEvent } =
    useForm<EventDonationEntryProps>({
      defaultValues: {
        event_id: [],
      },
    });

  const eventId = watchEvent("event_id");

  const { control: dateControl, fromDate, toDate } = useDateFilters();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const { mutate } = useGetEventDonationEntryExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetEventDonationEntryExportApiSuccessResponse) => {
        window.open(data.url, "_blank");

        toasts.success({ title: message });
      },
    },
  });

  const onExport = (fileType: FilType) => {
    mutate({
      body: {
        endRow: 0,
        externalFilter: {
          branch_id: [branchIds],
          event_id: eventId,
          from_date: fromDate,
          to_date: toDate,
        },
        filterModel: agGridFilterModel,
        startRow: 0,
      },
      fileType,
    });
  };

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddEventDonationEntryDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: eventDonationEntryKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <EventDonationEntryBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">
              {t("common.event.donationEntry")}
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
                minDate={fromDate ? DateTime.fromISO(fromDate) : DateTime.now()}
                clearable={false}
                containerProps={{ width: "160px" }}
              />

              <PermissionGuard
                canAccess={validateAccess(
                  EVENT_DONATION_ENTRY_PERMISSION.CREATE
                )}
              >
                <ButtonLayoutProvider
                  variant="outlined"
                  onClick={() => {
                    onDialogOpen("add");
                  }}
                  label={t("common.button.add", {
                    label: t("common.event.donationEntry"),
                  })}
                />
              </PermissionGuard>
            </Stack>
          </Stack>
        </PadBox>
      </ContentBox>

      <ContentBox>
        <PadBox padding={{ padding: "15px" }}>
          <Stack
            direction="row"
            justifyContent="end"
            alignItems="center"
            gap="5px"
          >
            <FilterEventAutocomplete
              isUserWise
              label=""
              multiple
              name="event_id"
              control={eventControl}
              sx={{ minWidth: "250px" }}
            />

            <PermissionGuard canAccess={allowPrintExport}>
              <DataExport onExport={onExport} />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <EventDonationEntryList
          page={page}
          endRow={endRow}
          eventId={eventId}
          startRow={startRow}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          agGridFilterModel={agGridFilterModel}
          onRowsPerPageChange={onRowsPerPageChange}
          setAgGridFilterModel={setAgGridFilterModel}
          externalDateFilter={{
            from_date: fromDate,
            to_date: toDate,
          }}
        />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
