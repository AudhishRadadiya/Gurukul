import { Button, ContentBox, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Box, Stack } from "@mui/material";
import { t } from "i18next";
import { useMemo, useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import { useAddMailSetting } from "@web/components/settings/mailSetting/hooks/useAddMailSetting";
import { useEditMailSetting } from "@web/components/settings/mailSetting/hooks/useEditMailSetting";
import { useGetMailSettingDetails } from "@web/components/settings/mailSetting/hooks/useGetMailSettingDetails";
import type {
  FormRef,
  MailSettingFormFieldValues,
} from "@web/components/settings/mailSetting/MailSettingForm";
import { MailSettingForm } from "@web/components/settings/mailSetting/MailSettingForm";
import { EMAIL_SETTINGS_PERMISSION } from "@web/constants/permission/settings/emailSettings/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { onError } from "@web/utils/errors";

export const MailSetting = () => {
  const formRef = useRef<FormRef>(null);

  const { validateAccess } = useUserPermissions();

  const {
    data: mailSettingData,
    isPending: isGetPendingMailSetting,
    refetch,
  } = useGetMailSettingDetails();

  const { mutate } = useAddMailSetting({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        refetch();

        toasts.success({ title: data.message });
      },
    },
  });

  const { mutate: editMutate } = useEditMailSetting({
    emailSettingId: mailSettingData?.email_setting_id ?? "",
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        refetch();

        toasts.success({ title: data.message });
      },
    },
  });

  const onCreateMailSetting = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const onEditMailSetting = () => {
    formRef.current?.submitForm((formValues) => {
      editMutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (mailSettingData) {
      const {
        content,
        password,
        port_no,
        sender_email,
        smtp_enable,
        smtp_server,
      } = mailSettingData;

      const mailSettingFormFieldValues: MailSettingFormFieldValues = {
        content,
        password,
        port_no,
        sender_email,
        smtp_enable,
        smtp_server,
      };

      return mailSettingFormFieldValues;
    }
  }, [mailSettingData]);

  return (
    <Stack direction="column" gap="10px">
      <ContentBox>
        <PadBox padding={{ padding: "20px" }}>
          <MailSettingForm
            ref={formRef}
            loading={isGetPendingMailSetting}
            defaultValues={defaultValues}
          />

          <Box display="flex" justifyContent="end">
            {mailSettingData?.email_setting_id &&
            validateAccess(EMAIL_SETTINGS_PERMISSION.EDIT) ? (
              <EditAction
                loading={isGetPendingMailSetting}
                onClick={onEditMailSetting}
              />
            ) : (
              validateAccess(EMAIL_SETTINGS_PERMISSION.CREATE) && (
                <Button
                  loading={isGetPendingMailSetting}
                  onClick={onCreateMailSetting}
                >
                  {t("common.save.button")}
                </Button>
              )
            )}
          </Box>
        </PadBox>
      </ContentBox>
    </Stack>
  );
};
