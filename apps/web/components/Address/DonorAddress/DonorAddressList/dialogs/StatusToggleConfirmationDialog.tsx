import { SaveDialog, toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";

import { useEditDonorAddress } from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useEditDonorAddress";
import type { DonorAddress } from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useGetDonorAddress";
import { onError } from "@web/utils/errors";

type StatusToggleConfirmationDialogProps = {
  donorAddress: DonorAddress;
  onClose: () => void;
  onSaveSuccess: () => void;
  open: boolean;
};

export const StatusToggleConfirmationDialog = ({
  donorAddress,
  onClose,
  onSaveSuccess,
  open,
}: StatusToggleConfirmationDialogProps) => {
  const { isPending, mutate } = useEditDonorAddress({
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        onSaveSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onSaveTemplate = () => {
    mutate({
      donationId: donorAddress.donation_id,
      formValues: { is_ignored: !donorAddress.is_ignored },
    });
  };

  return (
    <SaveDialog
      title={t("common.donor.address.dialog.save.title", {
        action: donorAddress.is_ignored
          ? t("common.proceed")
          : t("common.ignored"),
        donorAddressName: donorAddress.first_name,
      })}
      isSaveLoading={isPending}
      open={open}
      onSave={onSaveTemplate}
      onClose={onClose}
    />
  );
};
