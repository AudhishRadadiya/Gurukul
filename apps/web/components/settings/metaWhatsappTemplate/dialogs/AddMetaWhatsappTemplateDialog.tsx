import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import { useAddMetaWhatsappTemplate } from "@web/components/settings/metaWhatsappTemplate/dialogs/hooks/useAddMetaWhatsappTemplate";
import {
  MetaWhatsappTemplateForm,
  type FormRef,
} from "@web/components/settings/metaWhatsappTemplate/dialogs/MetaWhatsappTemplateForm";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type AddMetaWhatsappTemplateDialogProps = {
  onAddSuccess: () => void;
  onClose: () => void;
  open: boolean;
};

export const AddMetaWhatsappTemplateDialog = ({
  onAddSuccess,
  onClose,
  open,
}: AddMetaWhatsappTemplateDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useAddMetaWhatsappTemplate({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onAddSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onCreate = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title={t("metaWhatsappTemplate.label")}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <Button
            onClick={onCreate}
            loading={isPending}
            disabled={isDisabled()}
          >
            {t("common.save.button")}
          </Button>
        </ButtonContainer>
      }
    >
      <MetaWhatsappTemplateForm ref={formRef} loading={isPending} />
    </Dialog>
  );
};
