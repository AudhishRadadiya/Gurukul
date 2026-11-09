import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useMemo, useRef } from "react";

import { createAttachmentFromMediaUrl } from "@web/components/common/DocumentUploadField";
import { EditAction } from "@web/components/common/EditAction";
import { useEditCsrCertificate } from "@web/components/settings/csr-certificate/CsrCertificateList/Dialogs/hooks/useEditCsrCertificate";
import { useGetCsrCertificateDetails } from "@web/components/settings/csr-certificate/CsrCertificateList/Dialogs/hooks/useGetCsrCertificateDetails";
import {
  CsrCertificateForm,
  type CsrCertificateFormRef,
} from "@web/components/settings/csr-certificate/Dialogs/CsrCertificateForm";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditCsrCertificateDialogProps = {
  certificateId: string;
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
};

export const EditCsrCertificateDialog = ({
  certificateId,
  onClose,
  onEditSuccess,
  open,
}: EditCsrCertificateDialogProps) => {
  const formRef = useRef<CsrCertificateFormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: csrCertificateData, isPending: isPendingCsrCertificateData } =
    useGetCsrCertificateDetails({
      certificateId,
    });

  const { isPending, mutate } = useEditCsrCertificate({
    certificateId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (result) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: result.message });
      },
    },
  });

  const onEditCsrCertificate = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (csrCertificateData) {
      return {
        certificate_pdf: csrCertificateData.certificate_pdf
          ? [createAttachmentFromMediaUrl(csrCertificateData.certificate_pdf)]
          : null,
        csr_number: csrCertificateData.csr_number,
        financial_year_id: csrCertificateData.financial_year_id,
        trust_id: csrCertificateData.trust_id,
      };
    }
  }, [csrCertificateData]);

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title={t("common.edit.label", {
        label: t("csr.certificate.title"),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEditCsrCertificate}
            loading={isPending}
            disabled={isDisabled()}
          />
        </ButtonContainer>
      }
    >
      <CsrCertificateForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingCsrCertificateData}
      />
    </Dialog>
  );
};
