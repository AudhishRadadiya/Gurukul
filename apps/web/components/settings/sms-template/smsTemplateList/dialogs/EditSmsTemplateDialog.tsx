import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useMemo, useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import {
  SmsTemplateForm,
  type FormRef,
  type SmsTemplateFormFieldValues,
} from "@web/components/settings/sms-template/dialogs/SmsTemplateForm";
import { useEditSmsTemplate } from "@web/components/settings/sms-template/smsTemplateList/dialogs/hooks/useEditSmsTemplate";
import { useGetSmsTemplateDetails } from "@web/components/settings/sms-template/smsTemplateList/dialogs/hooks/useGetSmsTemplateDetails";
import type { SmsTemplateDetail } from "@web/components/settings/sms-template/smsTemplateList/hooks/useGetSmsTemplate";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditSmsTemplateDialogProps = {
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
  smsTemplateId: SmsTemplateDetail["sms_template_id"];
};

export const EditSmsTemplateDialog = ({
  onClose,
  onEditSuccess,
  open,
  smsTemplateId,
}: EditSmsTemplateDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: smsTemplateData, isPending: isPendingFinancialYearMasterData } =
    useGetSmsTemplateDetails({
      smsTemplateId,
    });

  const { isPending, mutate } = useEditSmsTemplate({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
    smsTemplateId,
  });

  const onEditSmsTemplate = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (smsTemplateData) {
      const smsTemplateFormFieldValues: SmsTemplateFormFieldValues = {
        is_active: smsTemplateData.is_active,
        is_sms: smsTemplateData.is_sms,
        is_whatsapp: smsTemplateData.is_whatsapp,
        temp_template_parameter: null,
        template_name: smsTemplateData.template_name,
        template_parameter_text: smsTemplateData.template_parameter_text,
        template_type: smsTemplateData.template_type,
      };

      return smsTemplateFormFieldValues;
    }
  }, [smsTemplateData]);

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title={t("common.edit.label", {
        label: t("sms.template.menu.label"),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditSmsTemplate}
            loading={isPending}
            disabled={isDisabled()}
          />
        </ButtonContainer>
      }
    >
      <SmsTemplateForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingFinancialYearMasterData}
      />
    </Dialog>
  );
};
