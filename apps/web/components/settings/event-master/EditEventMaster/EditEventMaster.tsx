import { Button, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import {
  EventMasterForm,
  type EventMasterFormFieldValues,
  type FormRef,
} from "@web/components/settings/event-master/AddEventMaster/EventMasterForm";
import { useEditEventMaster } from "@web/components/settings/event-master/EditEventMaster/hooks/useEditEventMaster";
import { useGetEventMasterDetails } from "@web/components/settings/event-master/EditEventMaster/hooks/useGetEventMasterDetails";
import { onError } from "@web/utils/errors";

type EditEventMasterProps = {
  eventMasterId: string;
};

export const EditEventMaster = ({ eventMasterId }: EditEventMasterProps) => {
  const formRef = useRef<FormRef>(null);

  const router = useRouter();

  const { data: eventMasterData, isPending: isPendingEventMasterData } =
    useGetEventMasterDetails({
      eventMasterId,
    });

  const { isPending, mutate } = useEditEventMaster({
    eventMasterId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),

      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/settings/event-master");
      },
    },
  });

  const onEditTrustMaster = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (eventMasterData) {
      const eventMasterFormFieldValues: EventMasterFormFieldValues = {
        ...eventMasterData,
        event_dropdown: eventMasterData.event_dropdown?.map((item) => ({
          ...item,
          is_old: true,
        })),
        event_items: eventMasterData.event_items?.map((item) => ({
          ...item,
          is_old: true,
        })),
      };

      return eventMasterFormFieldValues;
    }
  }, [eventMasterData]);

  return (
    <Stack spacing={2}>
      <EventMasterForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingEventMasterData}
        trustValue={eventMasterData?.trust_id}
        isOnlineValue={eventMasterData?.is_online}
      />

      <Stack direction="row" gap="15px" justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={() => {
            router.push("/settings/event-master");
          }}
        >
          {t("common.cancel.button")}
        </Button>

        <EditAction onClick={onEditTrustMaster} loading={isPending} />
      </Stack>
    </Stack>
  );
};
