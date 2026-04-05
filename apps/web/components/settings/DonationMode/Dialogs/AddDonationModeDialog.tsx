import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import type { FormRef } from "@web/components/settings/DonationMode/Dialogs/DonationModeForm";
import { DonationModeForm } from "@web/components/settings/DonationMode/Dialogs/DonationModeForm";
import { useAddDonationMode } from "@web/components/settings/DonationMode/Dialogs/hooks/useAddDonationMode";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type AddDonationModeDialogProps = {
  onAddSuccess: () => void;
  onClose: () => void;
  open: boolean;
};

export const AddDonationModeDialog = ({
  onAddSuccess,
  onClose,
  open,
}: AddDonationModeDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { t } = useTranslation();

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useAddDonationMode({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),

      onSuccess: (data) => {
        onClose();

        onAddSuccess();

        toasts.success({ title: data.message });
      },
    },
  });

  const onCreateDonationMode = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title={t("common.button.add", {
        label: t("common.mode.label", {
          label: t("donation.menu.label"),
        }),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <Button
            onClick={onCreateDonationMode}
            loading={isPending}
            disabled={isDisabled()}
          >
            {t("common.save.button")}
          </Button>
        </ButtonContainer>
      }
    >
      <DonationModeForm ref={formRef} />
    </Dialog>
  );
};
