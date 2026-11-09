import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";

import { useDeleteCsrCertificate } from "@web/components/settings/csr-certificate/CsrCertificateList/Dialogs/hooks/useDeleteCsrCertificate";
import type { CsrCertificate } from "@web/components/settings/csr-certificate/CsrCertificateList/hooks/useGetCsrCertificate";
import { onError } from "@web/utils/errors";

type DeleteCsrCertificateDialogProps = {
  certificate: CsrCertificate;
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
};

export const DeleteCsrCertificateDialog = ({
  certificate,
  onClose,
  onDeleteSuccess,
  open,
}: DeleteCsrCertificateDialogProps) => {
  const { t } = useTranslation();

  const { isPending, mutate } = useDeleteCsrCertificate({
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
        deleteMessage: certificate.trust_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={onClose}
    />
  );
};
