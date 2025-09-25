import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { Mail } from "iconoir-react";
import { useRef } from "react";

import type { FormRef } from "@web/components/Donation/donationEntry/dialogs/bulkMail/BulkMailForm";
import { BulkMailForm } from "@web/components/Donation/donationEntry/dialogs/bulkMail/BulkMailForm";
import { useDonationEntryBulkMail } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useDonationEntryBulkMail";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

type BulkMailDialogProps = {
  onClose: () => void;
  onConfirmationClose: () => void;
  open: boolean;
  selectedRows: string[];
};

export const BulkMailDialog = ({
  onClose,
  onConfirmationClose,
  open,
  selectedRows,
}: BulkMailDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useDonationEntryBulkMail({
    options: {
      onError: (error) => onError(error),

      onSuccess: ({ message }: EmptyApiSuccessResponse) => {
        toasts.success({ title: message });

        onConfirmationClose();

        onClose();
      },
    },
  });

  const onSendingBulkMail = () => {
    formRef.current?.submitForm((formValues) => {
      mutate({
        ...formValues,
        donation_id: selectedRows,
      });
    });
  };

  return (
    <Dialog
      maxWidth="xs"
      onClose={() => {
        onClose();
        onConfirmationClose();
      }}
      open={open}
      title={t("common.email.send")}
      actions={
        <Stack direction="row" gap="5px">
          <Button
            onClick={() => {
              onClose();
              onConfirmationClose();
            }}
            variant="outlined"
          >
            {t("common.cancel.button")}
          </Button>

          <Button
            onClick={onSendingBulkMail}
            loading={isPending}
            startIcon={<Mail width={20} height={22} />}
            disabled={isDisabled()}
          >
            {t("mail.label")}
          </Button>
        </Stack>
      }
    >
      <BulkMailForm ref={formRef} />
    </Dialog>
  );
};
