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
import { useEditAtgCertificate } from "@web/components/settings/atg-certificate/AtgCertificateList/Dialogs/hooks/useEditAtgCertificate";
import { useGetAtgCertificateDetails } from "@web/components/settings/atg-certificate/AtgCertificateList/Dialogs/hooks/useGetAtgCertificateDetails";
import type { FormRef } from "@web/components/settings/atg-certificate/Dialogs/AtgCertificateForm";
import { AtgCertificateForm } from "@web/components/settings/atg-certificate/Dialogs/AtgCertificateForm";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditAtgCertificateDialogProps = {
  certificateId: string;
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
};

export const EditAtgCertificateDialog = ({
  certificateId,
  onClose,
  onEditSuccess,
  open,
}: EditAtgCertificateDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: atgCertificateData, isPending: isPendingAtgCertificateData } =
    useGetAtgCertificateDetails({
      certificateId,
    });

  const { isPending, mutate } = useEditAtgCertificate({
    certificateId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onEditAtgCertificate = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const atgCertificateFormValues = useMemo(() => {
    if (atgCertificateData) {
      return {
        certificate_pdf: atgCertificateData.certificate_pdf
          ? [createAttachmentFromMediaUrl(atgCertificateData.certificate_pdf)]
          : null,
        financial_year_id: atgCertificateData.financial_year_id,
        tax_adj_number: atgCertificateData.tax_adj_number,
        trust_id: atgCertificateData.trust_id,
      };
    }
  }, [atgCertificateData]);

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit 80G Certificate"
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEditAtgCertificate}
            loading={isPending}
            disabled={isDisabled()}
          />
        </ButtonContainer>
      }
    >
      <AtgCertificateForm
        ref={formRef}
        defaultValues={atgCertificateFormValues}
        loading={isPendingAtgCertificateData}
      />
    </Dialog>
  );
};
