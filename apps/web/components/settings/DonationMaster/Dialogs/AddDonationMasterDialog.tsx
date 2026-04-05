import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import type { FormRef } from "@web/components/settings/DonationMaster/Dialogs/DonationMasterForm";
import { DonationMasterForm } from "@web/components/settings/DonationMaster/Dialogs/DonationMasterForm";
import { useAddDonationMaster } from "@web/components/settings/DonationMaster/Dialogs/hooks/useAddDonationMaster";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type AddDonationMasterDialogProps = {
  onAddSuccess: () => void;
  onClose: () => void;
  open: boolean;
};

export const AddDonationMasterDialog = ({
  onAddSuccess,
  onClose,
  open,
}: AddDonationMasterDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { t } = useTranslation();

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useAddDonationMaster({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),

      onSuccess: (data) => {
        onClose();

        onAddSuccess();

        toasts.success({ title: data.message });
      },
    },
  });

  const onCreateDonationMaster = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="xs"
      onClose={onClose}
      open={open}
      title={t("common.button.add", {
        label: t("common.master.label", {
          label: t("donation.menu.label"),
        }),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <Button
            onClick={onCreateDonationMaster}
            loading={isPending}
            disabled={isDisabled()}
          >
            {t("common.save.button")}
          </Button>
        </ButtonContainer>
      }
    >
      <DonationMasterForm ref={formRef} />
    </Dialog>
  );
};
