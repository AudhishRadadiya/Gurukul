import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import { useEditSMSMaster } from "@web/components/settings/sms-master/dialogs/hooks/useEditSMSMaster";
import { useGetSMSMasterDetails } from "@web/components/settings/sms-master/dialogs/hooks/useGetSMSMasterDetails";
import type { FormRef } from "@web/components/settings/sms-master/dialogs/SMSMasterForm";
import { SMSMasterForm } from "@web/components/settings/sms-master/dialogs/SMSMasterForm";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditSMSMasterDialogProps = {
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
  smsMasterId: string;
};

export const EditSMSMasterDialog = ({
  onClose,
  onEditSuccess,
  open,
  smsMasterId,
}: EditSMSMasterDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: smsMasterData, isPending: isPendingSMSMasterData } =
    useGetSMSMasterDetails({
      smsMasterId,
    });

  const { isPending, mutate } = useEditSMSMaster({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
    smsMasterId,
  });

  const onEditSMSMaster = () => {
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
        label: t("common.master.label", {
          label: t("sms.label"),
        }),
      })}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditSMSMaster}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <SMSMasterForm
        ref={formRef}
        defaultValues={smsMasterData}
        loading={isPendingSMSMasterData}
      />
    </Dialog>
  );
};
