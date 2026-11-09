import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import { useEditAddressTypeMaster } from "@web/components/settings/address-type-master/AddressTypeMasterList/Dialogs/hooks/useEditAddressTypeMaster";
import { useGetAddressTypeDetails } from "@web/components/settings/address-type-master/AddressTypeMasterList/Dialogs/hooks/useGetAddressTypeDetails";
import {
  AddressTypeFrom,
  type FormRef,
} from "@web/components/settings/address-type-master/Dialogs/AddressTypeFrom";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditAddressTypeMasterDialogProps = {
  addressTypeId: string;
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
};

export const EditAddressTypeMasterDialog = ({
  addressTypeId,
  onClose,
  onEditSuccess,
  open,
}: EditAddressTypeMasterDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: addressTypeData, isPending: isPendingBranchMasterData } =
    useGetAddressTypeDetails({
      addressTypeId,
    });

  const { isPending, mutate } = useEditAddressTypeMaster({
    addressTypeId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onEditAddressTypeMaster = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="xs"
      onClose={onClose}
      open={open}
      title="Edit Address Type"
      actions={
        <ButtonContainer columnsOnMobile={2}>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEditAddressTypeMaster}
            loading={isPending}
            disabled={isDisabled()}
          />
        </ButtonContainer>
      }
    >
      <AddressTypeFrom
        ref={formRef}
        defaultValues={addressTypeData}
        loading={isPendingBranchMasterData}
      />
    </Dialog>
  );
};
