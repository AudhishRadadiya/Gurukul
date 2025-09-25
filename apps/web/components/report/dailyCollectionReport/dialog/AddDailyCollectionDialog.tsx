import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import {
  CurrencyDetailFrom,
  type FormRef,
} from "@web/components/report/CurrencyDetailFrom";
import { useAddDonationCollection } from "@web/components/report/dailyCollectionReport/dialog/hooks/useAddDonationCollection";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type AddDailyCollectionDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const AddDailyCollectionDialog = ({
  onClose,
  open,
}: AddDailyCollectionDialogProps) => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useAddDonationCollection({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        toasts.success({ title: data.message });
        router.push("/donation/donation-entry");
      },
    },
  });

  const onCreateDailyCollection = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title={t("common.button.add", {
        label: t("common.currency.detail"),
      })}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <Button
            onClick={onCreateDailyCollection}
            loading={isPending}
            disabled={isDisabled()}
          >
            {t("common.save.button")}
          </Button>
        </Stack>
      }
    >
      <CurrencyDetailFrom ref={formRef} />
    </Dialog>
  );
};
