import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import { useEditBranchMaster } from "@web/components/settings/branch-master/BranchMasterList/Dialogs/hooks/useEditBranchMaster";
import { useGetBranchMasterDetails } from "@web/components/settings/branch-master/BranchMasterList/Dialogs/hooks/useGetBranchMasterDetails";
import {
  BranchMasterForm,
  type FormRef,
} from "@web/components/settings/branch-master/Dialogs/BranchMasterForm";
import { onError } from "@web/utils/errors";

type EditBranchMasterDialogProps = {
  branchId: string;
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
};

export const EditBranchMasterDialog = ({
  branchId,
  onClose,
  onEditSuccess,
  open,
}: EditBranchMasterDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { data: branchMasterData, isPending: isPendingBranchMasterData } =
    useGetBranchMasterDetails({
      branchId,
    });

  const { isPending, mutate } = useEditBranchMaster({
    branchId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onEditBranchMaster = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="Edit Branch"
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction onClick={onEditBranchMaster} loading={isPending} />
        </ButtonContainer>
      }
    >
      <BranchMasterForm
        ref={formRef}
        defaultValues={branchMasterData}
        loading={isPendingBranchMasterData}
      />
    </Dialog>
  );
};
