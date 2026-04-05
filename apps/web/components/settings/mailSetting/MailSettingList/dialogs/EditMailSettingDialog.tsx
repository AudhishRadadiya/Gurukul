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
  MailSettingForm,
  type FormRef,
} from "@web/components/settings/mailSetting/dialogs/MailSettingForm";
import { useEditMailSetting } from "@web/components/settings/mailSetting/MailSettingList/dialogs/hooks/useEditMailSetting";
import { useGetMailSettingDetails } from "@web/components/settings/mailSetting/MailSettingList/dialogs/hooks/useGetMailSettingDetails";
import type { MailSettingDetail } from "@web/components/settings/mailSetting/MailSettingList/hooks/useGetMailSetting";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditMailSettingDialogProps = {
  emailSettingId: MailSettingDetail["email_setting_id"];
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
};

export const EditMailSettingDialog = ({
  emailSettingId,
  onClose,
  onEditSuccess,
  open,
}: EditMailSettingDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: mailSettingData, isPending: isPendingMailSettingData } =
    useGetMailSettingDetails({
      emailSettingId,
    });

  const { isPending, mutate } = useEditMailSetting({
    emailSettingId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onEditMailSetting = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title={t("common.edit.label", {
        label: t("mailSetting.label"),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEditMailSetting}
            loading={isPending}
            disabled={isDisabled()}
          />
        </ButtonContainer>
      }
    >
      <MailSettingForm
        ref={formRef}
        defaultValues={mailSettingData}
        loading={isPendingMailSettingData}
      />
    </Dialog>
  );
};
