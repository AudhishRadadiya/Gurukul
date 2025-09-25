import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import { useAddSuvicharMaster } from "@web/components/Donation/suvicharMaster/dialogs/hooks/useAddSuvicharMaster";
import {
  SuvicharMasterForm,
  type FormRef,
} from "@web/components/Donation/suvicharMaster/dialogs/SuvicharMasterForm";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type AddSuvicharMasterDialogProps = {
  onAddSuccess: () => void;
  onClose: () => void;
  open: boolean;
};

export const AddSuvicharMasterDialog = ({
  onAddSuccess,
  onClose,
  open,
}: AddSuvicharMasterDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useAddSuvicharMaster({
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
        label: t("suvichar.menu.label"),
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
      <SuvicharMasterForm ref={formRef} />
    </Dialog>
  );
};
