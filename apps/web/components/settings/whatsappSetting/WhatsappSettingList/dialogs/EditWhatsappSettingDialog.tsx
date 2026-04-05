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
  WhatsappSettingForm,
  type FormRef,
} from "@web/components/settings/whatsappSetting/dialogs/WhatsappSettingForm";
import { useEditWhatsappSetting } from "@web/components/settings/whatsappSetting/WhatsappSettingList/dialogs/hooks/useEditWhatsappSetting";
import { useGetWhatsappSettingDetails } from "@web/components/settings/whatsappSetting/WhatsappSettingList/dialogs/hooks/useGetWhatsappSettingDetails";
import type { WhatsappSettingDetail } from "@web/components/settings/whatsappSetting/WhatsappSettingList/hooks/useGetWhatsappSetting";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditWhatsappSettingDialogProps = {
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
  whatsappSettingId: WhatsappSettingDetail["whatsapp_setting_id"];
};

export const EditWhatsappSettingDialog = ({
  onClose,
  onEditSuccess,
  open,
  whatsappSettingId,
}: EditWhatsappSettingDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: whatsappSettingData, isPending: isPendingWhatsappSettingData } =
    useGetWhatsappSettingDetails({
      whatsappSettingId,
    });

  const { isPending, mutate } = useEditWhatsappSetting({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
    whatsappSettingId,
  });

  const onEditWhatsappSetting = () => {
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
        label: t("whatsappSetting.label"),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEditWhatsappSetting}
            loading={isPending}
            disabled={isDisabled()}
          />
        </ButtonContainer>
      }
    >
      <WhatsappSettingForm
        ref={formRef}
        defaultValues={whatsappSettingData}
        loading={isPendingWhatsappSettingData}
      />
    </Dialog>
  );
};
