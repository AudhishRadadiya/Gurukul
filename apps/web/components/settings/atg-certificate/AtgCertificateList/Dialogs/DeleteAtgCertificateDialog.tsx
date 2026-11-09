import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";

import { useDeleteAtgCertificate } from "@web/components/settings/atg-certificate/AtgCertificateList/Dialogs/hooks/useDeleteAtgCertificate";
import type { AtgCertificate } from "@web/components/settings/atg-certificate/AtgCertificateList/hooks/useGetAtgCertificate";
import { onError } from "@web/utils/errors";

type DeleteAtgCertificateDialogProps = {
  certificate: AtgCertificate;
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
};

export const DeleteAtgCertificateDialog = ({
  certificate,
  onClose,
  onDeleteSuccess,
  open,
}: DeleteAtgCertificateDialogProps) => {
  const { t } = useTranslation();

  const { isPending, mutate } = useDeleteAtgCertificate({
    certificateId: certificate.certificate_id,
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
        deleteMessage: certificate.branch_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
