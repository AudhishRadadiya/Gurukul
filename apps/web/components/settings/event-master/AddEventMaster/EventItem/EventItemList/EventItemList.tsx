import { toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import type { EventDropdownFormFieldValues } from "@web/components/settings/event-master/AddEventMaster/EventDropdown/Dialog/EventDropdownForm";
import type { EventItemFormFieldValues } from "@web/components/settings/event-master/AddEventMaster/EventItem/Dialog/EventItemForm";
import { DeleteEventItemDialog } from "@web/components/settings/event-master/AddEventMaster/EventItem/EventItemList/Dialog/DeleteEventItemDialog";
import { EditEventItemDialog } from "@web/components/settings/event-master/AddEventMaster/EventItem/EventItemList/Dialog/EditEventItemDialog";
import { useEventItemColumns } from "@web/components/settings/event-master/AddEventMaster/EventItem/EventItemList/hooks/useEventItemColumns";
import type { EventMasterFormFieldValues } from "@web/components/settings/event-master/AddEventMaster/EventMasterForm";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

type EventItemListProps = {
  eventDropdownFormValues: EventDropdownFormFieldValues[];
  eventItemFormValues: EventItemFormFieldValues[];
  loading?: boolean;
  setValue: UseFormSetValue<EventMasterFormFieldValues>;
};

export const EventItemList = ({
  eventDropdownFormValues,
  eventItemFormValues,
  loading = false,
  setValue,
}: EventItemListProps) => {
  const [currentEventItem, setCurrentEventItem] =
    useState<EventItemFormFieldValues>();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { column } = useEventItemColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentEventItem && (
      <DeleteEventItemDialog
        open
        setValue={setValue}
        onClose={onDialogClose}
        eventItem={currentEventItem}
        eventItemFormValues={eventItemFormValues}
      />
    ),

    edit: currentEventItem && (
      <EditEventItemDialog
        open
        onClose={onDialogClose}
        eventItem={currentEventItem}
        onEdit={(formValues) => {
          const exceptCurrentEventItemFormValues = eventItemFormValues.filter(
            (item) => item.event_item_id !== formValues.event_item_id
          );

          const eventDropdownAndItems = [
            ...eventDropdownFormValues,
            ...exceptCurrentEventItemFormValues,
          ];

          const isDuplicateSequence = eventDropdownAndItems.some(
            (event) => event.sequence === formValues.sequence
          );

          if (isDuplicateSequence) {
            toasts.warning({ title: t("common.unique.sequence.message") });

            return;
          }

          const eventItemData = eventItemFormValues.map((eventItem) => {
            if (eventItem.event_item_id === currentEventItem.event_item_id) {
              return { ...eventItem, ...formValues };
            }

            return eventItem;
          });

          setValue("event_items", eventItemData);

          onDialogClose();
        }}
      />
    ),
  };

  return (
    <>
      <AgGridV2<EventItemFormFieldValues>
        isLoading={loading}
        rowData={eventItemFormValues}
        rowModelType="clientSide"
        columnDefs={column}
        height={550}
        actions={[
          {
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentEventItem(data);
            },
            title: t("common.edit"),
          },

          {
            onClick: (data) => {
              onDialogOpen("delete");
              setCurrentEventItem(data);
            },
            title: t("common.delete"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
