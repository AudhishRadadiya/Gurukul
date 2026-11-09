import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import {
  CsrCertificateForm,
  type CsrCertificateFormRef,
} from "@web/components/settings/csr-certificate/Dialogs/CsrCertificateForm";
import { useAddCsrCertificate } from "@web/components/settings/csr-certificate/Dialogs/hooks/useAddCsrCertificate";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type AddCsrCertificateDialogProps = {
  onAddSuccess: () => void;
  onClose: () => void;
  open: boolean;
};

export const AddCsrCertificateDialog = ({
  onAddSuccess,
  onClose,
  open,
}: AddCsrCertificateDialogProps) => {
  const formRef = useRef<CsrCertificateFormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useAddCsrCertificate({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onAddSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onCreateCsrCertificate = () => {
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
        label: t("csr.certificate.title"),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>
          <Button
            onClick={onCreateCsrCertificate}
            loading={isPending}
            disabled={isDisabled()}
          >
            {t("common.save.button")}
          </Button>
        </ButtonContainer>
      }
    >
      <CsrCertificateForm ref={formRef} />
    </Dialog>
  );
};
