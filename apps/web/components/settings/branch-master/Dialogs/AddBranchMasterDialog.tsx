import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";

import {
  BranchMasterForm,
  type FormRef,
} from "@web/components/settings/branch-master/Dialogs/BranchMasterForm";
import { useAddBranchMaster } from "@web/components/settings/branch-master/Dialogs/hooks/useAddBranchMaster";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type AddBranchMasterDialogProps = {
  onAddSuccess: () => void;
  onClose: () => void;
  open: boolean;
};

export const AddBranchMasterDialog = ({
  onAddSuccess,
  onClose,
  open,
}: AddBranchMasterDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useAddBranchMaster({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();

        onAddSuccess();

        toasts.success({ title: data.message });
      },
    },
  });

  const onCreateBranchMaster = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="Add Branch"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onCreateBranchMaster}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <BranchMasterForm ref={formRef} />
    </Dialog>
  );
};
