import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import {
  MetaWhatsappSettingForm,
  type FormRef,
} from "@web/components/settings/metaWhatsappSetting/dialogs/MetaWhatsappSettingForm";
import { useEditMetaWhatsappSetting } from "@web/components/settings/metaWhatsappSetting/MetaWhatsappSettingList/dialogs/hooks/useEditMetaWhatsappSetting";
import { useGetMetaWhatsappSettingDetails } from "@web/components/settings/metaWhatsappSetting/MetaWhatsappSettingList/dialogs/hooks/useGetMetaWhatsappSettingDetails";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditMetaWhatsappSettingDialogProps = {
  metaWhatsappSettingId: string;
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
};

export const EditMetaWhatsappSettingDialog = ({
  metaWhatsappSettingId,
  onClose,
  onEditSuccess,
  open,
}: EditMetaWhatsappSettingDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const {
    data: metaWhatsappSettingData,
    isPending: isPendingMetaWhatsappSettingData,
  } = useGetMetaWhatsappSettingDetails({
    metaWhatsappSettingId,
  });

  const { isPending, mutate } = useEditMetaWhatsappSetting({
    metaWhatsappSettingId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();

        onEditSuccess();

        toasts.success({ title: data.message });
      },
    },
  });

  const onEditMetaWhatsappSetting = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title={t("common.edit.label", {
        label: t("metaWhatsappSetting.label"),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEditMetaWhatsappSetting}
            loading={isPending}
            disabled={isDisabled()}
          />
        </ButtonContainer>
      }
    >
      <MetaWhatsappSettingForm
        ref={formRef}
        defaultValues={metaWhatsappSettingData}
        loading={isPendingMetaWhatsappSettingData}
      />
    </Dialog>
  );
};
