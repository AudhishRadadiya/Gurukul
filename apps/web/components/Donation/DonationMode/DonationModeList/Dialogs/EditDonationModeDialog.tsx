import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import type { FormRef } from "@web/components/Donation/DonationMode/Dialogs/DonationModeForm";
import { DonationModeForm } from "@web/components/Donation/DonationMode/Dialogs/DonationModeForm";
import { useEditDonationMode } from "@web/components/Donation/DonationMode/DonationModeList/Dialogs/hooks/useEditDonationMode";
import { useGetDonationModeDetails } from "@web/components/Donation/DonationMode/DonationModeList/Dialogs/hooks/useGetDonationModeDetails";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditDonationModeDialogProps = {
  donationModeId: string;
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
};

export const EditDonationModeDialog = ({
  donationModeId,
  onClose,
  onEditSuccess,
  open,
}: EditDonationModeDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: donationModeData, isPending: isPendingDonationModeData } =
    useGetDonationModeDetails({
      donationModeId,
    });

  const { isPending, mutate } = useEditDonationMode({
    donationModeId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onEditDonationMode = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title={t("common.edit.label", {
        label: t("common.mode.label", {
          label: t("donation.menu.label"),
        }),
      })}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEditDonationMode}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <DonationModeForm
        ref={formRef}
        defaultValues={donationModeData}
        loading={isPendingDonationModeData}
      />
    </Dialog>
  );
};
