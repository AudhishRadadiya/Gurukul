import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import { useEditMasterEntry } from "@web/components/settings/masterEntry/dialogs/hooks/useEditMasterEntry";
import { useGetMasterEntryDetails } from "@web/components/settings/masterEntry/dialogs/hooks/useGetMasterEntryDetails";
import {
  MasterEntryForm,
  type FormRef,
} from "@web/components/settings/masterEntry/dialogs/MasterEntryForm";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditMasterEntryDialogProps = {
  masterParameterId: string;
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
};

export const EditMasterEntryDialog = ({
  masterParameterId,
  onClose,
  onEditSuccess,
  open,
}: EditMasterEntryDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: masterEntryData, isPending: isPendingMasterEntryData } =
    useGetMasterEntryDetails({
      masterParameterId,
    });

  const { isPending, mutate } = useEditMasterEntry({
    masterParameterId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onEditMasterEntry = () => {
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
        label: t("chequeReconciliation.label"),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEditMasterEntry}
            loading={isPending}
            disabled={isDisabled()}
          />
        </ButtonContainer>
      }
    >
      <MasterEntryForm
        ref={formRef}
        defaultValues={masterEntryData}
        loading={isPendingMasterEntryData}
      />
    </Dialog>
  );
};
