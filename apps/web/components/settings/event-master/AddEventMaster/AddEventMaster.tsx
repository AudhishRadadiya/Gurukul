import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import type { FormRef } from "@web/components/settings/event-master/AddEventMaster/EventMasterForm";
import { EventMasterForm } from "@web/components/settings/event-master/AddEventMaster/EventMasterForm";
import { useAddEventMaster } from "@web/components/settings/event-master/AddEventMaster/hooks/useAddEventMaster";
import { onError } from "@web/utils/errors";

export const AddEventMaster = () => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { isPending, mutate } = useAddEventMaster({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),

      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/settings/event-master");
      },
    },
  });

  const onAddEventMaster = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <PadBox padding={{ padding: "20px" }}>
      <Stack gap="10px">
        <EventMasterForm ref={formRef} />

        <PadBox padding={{ paddingRight: "20px" }}>
          <Stack direction="row" justifyContent="end" gap="10px">
            <Button
              variant="outlined"
              onClick={() => {
                router.push("/settings/event-master");
              }}
            >
              {t("common.cancel.button")}
            </Button>

            <Button loading={isPending} onClick={onAddEventMaster}>
              {t("common.save.button")}
            </Button>
          </Stack>
        </PadBox>
      </Stack>
    </PadBox>
  );
};
