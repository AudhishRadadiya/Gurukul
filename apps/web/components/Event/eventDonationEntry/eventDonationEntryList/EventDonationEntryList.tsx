import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { forwardRef, useState } from "react";
import type { FieldValues } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { DeleteEventDonationEntryDialog } from "@web/components/Event/eventDonationEntry/dialogs/DeleteEventDonationEntryDialog";
import { EditEventDonationEntryDialog } from "@web/components/Event/eventDonationEntry/dialogs/EditEventDonationEntryDialog";
import { ReceiptEntryDetailDialog } from "@web/components/Event/eventDonationEntry/dialogs/receiptEntryDetailDialog/ReceiptEntryDetailDialog";
import { useEventDonationEntryColumns } from "@web/components/Event/eventDonationEntry/eventDonationEntryList/hooks/useEventDonationEntryColumns";
import type { EventDonationEntry } from "@web/components/Event/eventDonationEntry/eventDonationEntryList/hooks/useGetEventDonationEntry";
import { useGetEventDonationEntry } from "@web/components/Event/eventDonationEntry/eventDonationEntryList/hooks/useGetEventDonationEntry";
import { EVENT_DONATION_ENTRY_PERMISSION } from "@web/constants/permission/event/eventDonationEntry/permission";
import { useBranch } from "@web/context/BranchContext";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";

export type EventDonationEntryListProps = {
  agGridFilterModel: FilterModel;
  endRow: number;
  eventId: string[];
  externalDateFilter?: FieldValues;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRows: number) => void;
  page: number;
  rowsPerPage: number;
  setAgGridFilterModel: (data: FilterModel) => void;
  startRow: number;
};

export const EventDonationEntryList = forwardRef(
  ({
    agGridFilterModel,
    endRow,
    eventId,
    externalDateFilter,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    setAgGridFilterModel,
    startRow,
  }: EventDonationEntryListProps) => {
    const { validateAccess } = useUserPermissions();

    const { branchIds } = useBranch();

    const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

    const [currentEventDonationEntry, setCurrentEventDonationEntry] =
      useState<EventDonationEntry>();

    const { data, isFetching, refetch } = useGetEventDonationEntry({
      endRow,
      externalFilter: {
        ...(eventId && { event_id: eventId }),
        ...externalDateFilter,
        branch_id: [branchIds],
      },
      filterModel: agGridFilterModel,
      startRow,
    });

    const { eventDonations, totalCount } = data;

    const { column } = useEventDonationEntryColumns();

    const dialogRenderer: DialogRenderer = {
      delete: currentEventDonationEntry && (
        <DeleteEventDonationEntryDialog
          open
          eventDonationEntryDetails={currentEventDonationEntry}
          onDeleteSuccess={() => {
            refetch();
          }}
          onClose={onDialogClose}
        />
      ),
      edit: currentEventDonationEntry && (
        <EditEventDonationEntryDialog
          open
          eventDonationId={currentEventDonationEntry.event_donation_id}
          onEditSuccess={() => {
            refetch();
          }}
          onClose={onDialogClose}
        />
      ),
      receiptEntry: currentEventDonationEntry && (
        <ReceiptEntryDetailDialog
          open
          onClose={onDialogClose}
          dailyDonationId={currentEventDonationEntry.event_donation_id}
        />
      ),
    };

    return (
      <>
        <AgGridV2<EventDonationEntry>
          isLoading={isFetching}
          page={page}
          columnDefs={column}
          rowsPerPage={rowsPerPage}
          rowData={eventDonations}
          onPageChange={onPageChange}
          count={totalCount}
          onRowsPerPageChange={onRowsPerPageChange}
          onFilterChange={setAgGridFilterModel}
          height={280}
          actions={[
            {
              isView: validateAccess(EVENT_DONATION_ENTRY_PERMISSION.EDIT),
              onClick: (data) => {
                onDialogOpen("edit");
                setCurrentEventDonationEntry(data);
              },
              title: t("common.edit"),
            },

            {
              isView: validateAccess(EVENT_DONATION_ENTRY_PERMISSION.DELETE),
              onClick: (data) => {
                onDialogOpen("delete");
                setCurrentEventDonationEntry(data);
              },
              title: t("common.delete"),
            },

            {
              onClick: (data) => {
                onDialogOpen("receiptEntry");
                setCurrentEventDonationEntry(data);
              },
              title: t("common.receipt.entry"),
            },
          ]}
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

EventDonationEntryList.displayName = "EventDonationEntryList";
