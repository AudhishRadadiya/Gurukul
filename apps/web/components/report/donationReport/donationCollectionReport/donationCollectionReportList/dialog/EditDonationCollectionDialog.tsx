import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import {
  CurrencyDetailFrom,
  type FormRef,
} from "@web/components/report/CurrencyDetailFrom";
import { useEditDonationCollection } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/dialog/hooks/useEditDonationCollection";
import { useGetCurrencyDetail } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/dialog/hooks/useGetCurrencyDetail";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditDonationCollectionDialogProps = {
  dailyDonationId: string;
  onClose: () => void;
  open: boolean;
};

export const EditDonationCollectionDialog = ({
  dailyDonationId,
  onClose,
  open,
}: EditDonationCollectionDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: currencyData, isFetching } = useGetCurrencyDetail({
    dailyDonationId,
  });

  const { isPending, mutate } = useEditDonationCollection({
    dailyDonationId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        toasts.success({ title: data.message });
      },
    },
  });

  const onEditDonationCollection = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title={t("common.edit.label", {
        label: t("common.currency.detail"),
      })}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEditDonationCollection}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <CurrencyDetailFrom
        ref={formRef}
        defaultValues={currencyData}
        loading={isFetching}
      />
    </Dialog>
  );
};
