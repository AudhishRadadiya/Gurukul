import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";

import { useDeleteWebBanner } from "@web/components/web-banner/WebBannerList/dialogs/hooks/useDeleteWebBanner";
import type { WebBannerDetail } from "@web/components/web-banner/WebBannerList/hooks/useGetWebBanner";
import { onError } from "@web/utils/errors";

type DeleteWebBannerDialogProps = {
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
  webBannerDetails: WebBannerDetail;
};

export const DeleteWebBannerDialog = ({
  onClose,
  onDeleteSuccess,
  open,
  webBannerDetails,
}: DeleteWebBannerDialogProps) => {
  const { isPending, mutate } = useDeleteWebBanner({
    bannerId: webBannerDetails.banner_id,
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
        deleteMessage: webBannerDetails.event_names,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
