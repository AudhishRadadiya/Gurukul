import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";

import {
  AddressTypeFrom,
  type FormRef,
} from "@web/components/settings/address-type-master/Dialogs/AddressTypeFrom";
import { useAddAddressType } from "@web/components/settings/address-type-master/Dialogs/hooks/useAddAddressType";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type AddAddressTypeDialogProps = {
  onAddSuccess: () => void;
  onClose: () => void;
  open: boolean;
};

export const AddAddressTypeDialog = ({
  onAddSuccess,
  onClose,
  open,
}: AddAddressTypeDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useAddAddressType({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();

        onAddSuccess();

        toasts.success({ title: data.message });
      },
    },
  });

  const onCreateAddressTypeMaster = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="xs"
      onClose={onClose}
      open={open}
      title="Add Address Type"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onCreateAddressTypeMaster}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <AddressTypeFrom ref={formRef} />
    </Dialog>
  );
};
