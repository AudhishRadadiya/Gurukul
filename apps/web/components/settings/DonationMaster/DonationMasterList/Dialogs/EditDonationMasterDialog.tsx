import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import type { FormRef } from "@web/components/settings/DonationMaster/Dialogs/DonationMasterForm";
import { DonationMasterForm } from "@web/components/settings/DonationMaster/Dialogs/DonationMasterForm";
import { useEditDonationMaster } from "@web/components/settings/DonationMaster/DonationMasterList/Dialogs/hooks/useEditDonationMaster";
import { useGetDonationMasterDetails } from "@web/components/settings/DonationMaster/DonationMasterList/Dialogs/hooks/useGetDonationMasterDetails";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditDonationMasterDialogProps = {
  donationMasterId: string;
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
};

export const EditDonationMasterDialog = ({
  donationMasterId,
  onClose,
  onEditSuccess,
  open,
}: EditDonationMasterDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: donationMasterData, isPending: isPendingDonationMasterData } =
    useGetDonationMasterDetails({
      donationMasterId,
    });

  const { isPending, mutate } = useEditDonationMaster({
    donationMasterId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onEditDonationMaster = () => {
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
          label: t("donation.menu.label"),
        }),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEditDonationMaster}
            loading={isPending}
            disabled={isDisabled()}
          />
        </ButtonContainer>
      }
    >
      <DonationMasterForm
        ref={formRef}
        defaultValues={donationMasterData}
        loading={isPendingDonationMasterData}
      />
    </Dialog>
  );
};
