"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  Button,
  ContentBox,
  PadBox,
  toasts,
  useDialogActions,
} from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { Plus } from "iconoir-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { EventAutocomplete } from "@web/components/common/Autocomplete/EventAutocomplete";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import { AddEventDonationEntryDialog } from "@web/components/Event/eventDonationEntry/dialogs/AddEventDonationEntryDialog";
import { EventDonationEntryBreadcrumbs } from "@web/components/Event/eventDonationEntry/EventDonationEntryBreadcrumbs";
import { EventDonationEntryList } from "@web/components/Event/eventDonationEntry/eventDonationEntryList/EventDonationEntryList";
import type { GetEventDonationEntryExportApiSuccessResponse } from "@web/components/Event/eventDonationEntry/eventDonationEntryList/hooks/useGetEventDonationEntryExport";
import { useGetEventDonationEntryExport } from "@web/components/Event/eventDonationEntry/eventDonationEntryList/hooks/useGetEventDonationEntryExport";
import { EVENT_DONATION_ENTRY_PERMISSION } from "@web/constants/permission/event/eventDonationEntry/permission";
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

  const { validateAccess } = useUserPermissions();

  const { control, watch } = useForm<EventDonationEntryProps>({
    defaultValues: {
      event_id: [],
    },
  });

  const eventId = watch("event_id");

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
        endRow,
        externalFilter: { event_id: eventId },
        filterModel: agGridFilterModel,
        startRow,
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

            <PermissionGuard
              canAccess={validateAccess(EVENT_DONATION_ENTRY_PERMISSION.CREATE)}
            >
              <Button
                variant="outlined"
                startIcon={<Plus width={25} height={25} />}
                onClick={() => {
                  onDialogOpen("add");
                }}
              >
                {t("common.button.add", {
                  label: t("common.event.donationEntry"),
                })}
              </Button>
            </PermissionGuard>
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
            <EventAutocomplete
              label=""
              multiple
              name="event_id"
              control={control}
              sx={{ minWidth: "250px" }}
            />

            <DataExport onExport={onExport} />
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
        />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
