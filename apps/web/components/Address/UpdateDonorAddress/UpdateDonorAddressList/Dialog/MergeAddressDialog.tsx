import { toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";

import type { MismatchedAddressList } from "@web/components/Address/UpdateDonorAddress/UpdateDonorAddressList/hooks/useGetUpdateDonorAddress";
import { useMergeAddress } from "@web/components/Address/UpdateDonorAddress/UpdateDonorAddressList/hooks/useMergeAddress";
import { UpdateDialog } from "@web/components/common/Dialogs/UpdateDialog";
import { onError } from "@web/utils/errors";

type MergeAddressDialogProps = {
  address: MismatchedAddressList;
  onClose: () => void;
  onMergeSuccess: () => void;
  open: boolean;
};

export const MergeAddressDialog = ({
  address,
  onClose,
  onMergeSuccess,
  open,
}: MergeAddressDialogProps) => {
  const { t } = useTranslation();

  const { isPending, mutate } = useMergeAddress({
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        onClose();
        onMergeSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const handleMerge = () => {
    mutate({
      contact_id: address.contact_id,
      donation_id: address.donation_id,
    });
  };

  return (
    <UpdateDialog
      title={t("dialog.merge.address.message", {
        contactName: `${address.first_name} ${address.surname || ""}`.trim(),
      })}
      open={open}
      isUpdateLoading={isPending}
      onUpdate={handleMerge}
      onClose={onClose}
    />
  );
};
