import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { EditAction } from "@web/components/common/EditAction";
import type { FormRef } from "@web/components/settings/master-type/Dialogs/MasterTypeFrom";
import { MasterTypeFrom } from "@web/components/settings/master-type/Dialogs/MasterTypeFrom";
import { useEditMasterType } from "@web/components/settings/master-type/MasterTypeList/Dialogs/hooks/useEditMasterType";
import { useGetMasterTypeDetails } from "@web/components/settings/master-type/MasterTypeList/Dialogs/hooks/useGetMasterTypeDetails";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditMasterTypeDialogProps = {
  masterTypeId: string;
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
};

export const EditMasterTypeDialog = ({
  masterTypeId,
  onClose,
  onEditSuccess,
  open,
}: EditMasterTypeDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { t } = useTranslation();

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: masterTypeData, isPending: isPendingMasterTypeData } =
    useGetMasterTypeDetails({
      masterTypeId,
    });

  const { isPending, mutate } = useEditMasterType({
    masterTypeId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onEditMasterTypeMaster = () => {
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
        label: t("master.type.menu.label"),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEditMasterTypeMaster}
            loading={isPending}
            disabled={isDisabled()}
          />
        </ButtonContainer>
      }
    >
      <MasterTypeFrom
        ref={formRef}
        defaultValues={masterTypeData}
        loading={isPendingMasterTypeData}
      />
    </Dialog>
  );
};
