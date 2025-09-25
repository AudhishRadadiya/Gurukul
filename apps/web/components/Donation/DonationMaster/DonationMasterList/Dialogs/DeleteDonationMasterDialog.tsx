import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";

import { useDeleteDonationMaster } from "@web/components/Donation/DonationMaster/DonationMasterList/Dialogs/hooks/useDeleteDonationMaster";
import type { DonationMaster } from "@web/components/Donation/DonationMaster/DonationMasterList/hooks/useGetDonationMaster";
import { onError } from "@web/utils/errors";

type DeleteDonationMasterDialogProps = {
  donationMaster: DonationMaster;
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
};

export const DeleteDonationMasterDialog = ({
  donationMaster,
  onClose,
  onDeleteSuccess,
  open,
}: DeleteDonationMasterDialogProps) => {
  const { isPending, mutate } = useDeleteDonationMaster({
    donationMasterId: donationMaster.donation_master_id,
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        onClose();
        onDeleteSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  return (
    <DeleteDialog
      title={t("dialog.delete.message", {
        deleteMessage: donationMaster.donation_master_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
