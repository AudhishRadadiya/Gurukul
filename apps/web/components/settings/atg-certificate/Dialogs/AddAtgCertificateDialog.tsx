import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import type { FormRef } from "@web/components/settings/atg-certificate/Dialogs/AtgCertificateForm";
import { AtgCertificateForm } from "@web/components/settings/atg-certificate/Dialogs/AtgCertificateForm";
import { useAddAtgCertificate } from "@web/components/settings/atg-certificate/Dialogs/hooks/useAddAtgCertificate";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type AddAtgCertificateDialogProps = {
  onAddSuccess: () => void;
  onClose: () => void;
  open: boolean;
};

export const AddAtgCertificateDialog = ({
  onAddSuccess,
  onClose,
  open,
}: AddAtgCertificateDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useAddAtgCertificate({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onAddSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onCreateAtgCertificate = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Add 80G Certificate"
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <Button
            onClick={onCreateAtgCertificate}
            loading={isPending}
            disabled={isDisabled()}
          >
            {t("common.save.button")}
          </Button>
        </ButtonContainer>
      }
    >
      <AtgCertificateForm ref={formRef} />
    </Dialog>
  );
};
