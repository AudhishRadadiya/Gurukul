import { toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import type { EventDropdownFormFieldValues } from "@web/components/settings/event-master/AddEventMaster/EventDropdown/Dialog/EventDropdownForm";
import { DeleteEventDropdownDialog } from "@web/components/settings/event-master/AddEventMaster/EventDropdown/EventDropdownList/Dialog/DeleteEventDropdownDialog";
import { EditEventDropdownDialog } from "@web/components/settings/event-master/AddEventMaster/EventDropdown/EventDropdownList/Dialog/EditEventDropdownDialog";
import { useEventDropdownColumns } from "@web/components/settings/event-master/AddEventMaster/EventDropdown/EventDropdownList/hooks/useEventDropdownColumns";
import type { EventItemFormFieldValues } from "@web/components/settings/event-master/AddEventMaster/EventItem/Dialog/EventItemForm";
import type { EventMasterFormFieldValues } from "@web/components/settings/event-master/AddEventMaster/EventMasterForm";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

type EventDropdownListProps = {
  eventDropdownFormValues: EventDropdownFormFieldValues[];
  eventItemsFormValues: EventItemFormFieldValues[];
  loading?: boolean;
  setValue: UseFormSetValue<EventMasterFormFieldValues>;
};

export const EventDropdownList = ({
  eventDropdownFormValues,
  eventItemsFormValues,
  loading = false,
  setValue,
}: EventDropdownListProps) => {
  const [currentEventDropdown, setCurrentEventDropdown] =
    useState<EventDropdownFormFieldValues>();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { column } = useEventDropdownColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentEventDropdown && (
      <DeleteEventDropdownDialog
        open
        setValue={setValue}
        onClose={onDialogClose}
        eventDropdown={currentEventDropdown}
        eventDropdownFormValues={eventDropdownFormValues}
      />
    ),

    edit: currentEventDropdown && (
      <EditEventDropdownDialog
        open
        onClose={onDialogClose}
        eventDropdown={currentEventDropdown}
        onEdit={(formValues) => {
          const exceptEventDropdownFormValues = eventDropdownFormValues.filter(
            (item) => item.event_dropdown_id !== formValues.event_dropdown_id
          );

          const eventDropdownAndItems = [
            ...exceptEventDropdownFormValues,
            ...eventItemsFormValues,
          ];

          const isDuplicateSequence = eventDropdownAndItems.some(
            (event) => event.sequence === formValues.sequence
          );

          if (isDuplicateSequence) {
            toasts.warning({ title: t("common.unique.sequence.message") });

            return;
          }

          const eventDropdownData = eventDropdownFormValues.map(
            (eventDropdown) => {
              if (
                eventDropdown.event_dropdown_id ===
                currentEventDropdown.event_dropdown_id
              ) {
                return { ...eventDropdown, ...formValues };
              }

              return eventDropdown;
            }
          );

          setValue("event_dropdown", eventDropdownData);
          onDialogClose();
        }}
      />
    ),
  };

  return (
    <>
      <AgGridV2<EventDropdownFormFieldValues>
        isLoading={loading}
        rowData={eventDropdownFormValues}
        rowModelType="clientSide"
        columnDefs={column}
        height={550}
        actions={[
          {
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentEventDropdown(data);
            },
            title: t("common.edit"),
          },

          {
            onClick: (data) => {
              onDialogOpen("delete");
              setCurrentEventDropdown(data);
            },
            title: t("common.delete"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
