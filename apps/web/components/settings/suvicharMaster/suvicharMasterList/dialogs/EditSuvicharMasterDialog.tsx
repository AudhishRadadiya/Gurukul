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
  SuvicharMasterForm,
  type FormRef,
} from "@web/components/settings/suvicharMaster/dialogs/SuvicharMasterForm";
import { useEditSuvicharMaster } from "@web/components/settings/suvicharMaster/suvicharMasterList/dialogs/hooks/useEditSuvicharMaster";
import { useGetSuvicharMasterDetails } from "@web/components/settings/suvicharMaster/suvicharMasterList/dialogs/hooks/useGetSuvicharMasterDetails";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditSuvicharMasterDialogProps = {
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
  suvicharId: string;
};

export const EditSuvicharMasterDialog = ({
  onClose,
  onEditSuccess,
  open,
  suvicharId,
}: EditSuvicharMasterDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: suvichaMasterData, isPending: isPendingSuvichaMasterData } =
    useGetSuvicharMasterDetails({
      suvicharId,
    });

  const { isPending, mutate } = useEditSuvicharMaster({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
    suvicharId,
  });

  const onEditSuvicharMaster = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="xs"
      onClose={onClose}
      open={open}
      title={t("common.edit.label", {
        label: t("common.master.label", {
          label: t("suvichar.menu.label"),
        }),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEditSuvicharMaster}
            loading={isPending}
            disabled={isDisabled()}
          />
        </ButtonContainer>
      }
    >
      <SuvicharMasterForm
        ref={formRef}
        defaultValues={suvichaMasterData}
        loading={isPendingSuvichaMasterData}
      />
    </Dialog>
  );
};
