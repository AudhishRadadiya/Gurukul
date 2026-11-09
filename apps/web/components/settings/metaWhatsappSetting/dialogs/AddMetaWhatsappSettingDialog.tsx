import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import { useAddMetaWhatsappSetting } from "@web/components/settings/metaWhatsappSetting/dialogs/hooks/useAddMetaWhatsappSetting";
import {
  MetaWhatsappSettingForm,
  type FormRef,
} from "@web/components/settings/metaWhatsappSetting/dialogs/MetaWhatsappSettingForm";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type AddMetaWhatsappSettingDialogProps = {
  onAddSuccess: () => void;
  onClose: () => void;
  open: boolean;
};

export const AddMetaWhatsappSettingDialog = ({
  onAddSuccess,
  onClose,
  open,
}: AddMetaWhatsappSettingDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useAddMetaWhatsappSetting({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onAddSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onCreateMetaWhatsappSetting = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title={t("metaWhatsappSetting.label")}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <Button
            onClick={onCreateMetaWhatsappSetting}
            loading={isPending}
            disabled={isDisabled()}
          >
            {t("common.save.button")}
          </Button>
        </ButtonContainer>
      }
    >
      <MetaWhatsappSettingForm ref={formRef} />
    </Dialog>
  );
};
