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
  type FormRef,
  SmsSettingsForm,
} from "@web/components/settings/smsSettings/dialog/SmsSettingsForm";
import { useEditSmsSettings } from "@web/components/settings/smsSettings/smsSettingsList/dialog/hooks/useEditSmsSettings";
import { useGetSmsSettingsDetails } from "@web/components/settings/smsSettings/smsSettingsList/dialog/hooks/useGetSmsSettingsDetails";
import type { SmsSettingDetail } from "@web/components/settings/smsSettings/smsSettingsList/hooks/useGetSmsSettings";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditSmsSettingsDialogProps = {
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
  smsSettingId: SmsSettingDetail["sms_setting_id"];
};

export const EditSmsSettingsDialog = ({
  onClose,
  onEditSuccess,
  open,
  smsSettingId,
}: EditSmsSettingsDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: smsSettingData, isPending: isPendingSmsSettingData } =
    useGetSmsSettingsDetails({
      smsSettingId,
    });

  const { isPending, mutate } = useEditSmsSettings({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),

      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
    smsSettingId,
  });

  const onEditSmsSettings = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title={t("common.edit.label", {
        label: t("sms.settings.menu.label"),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            loading={isPending}
            onClick={onEditSmsSettings}
            disabled={isDisabled()}
          />
        </ButtonContainer>
      }
    >
      <SmsSettingsForm
        ref={formRef}
        defaultValues={smsSettingData}
        loading={isPendingSmsSettingData}
      />
    </Dialog>
  );
};
