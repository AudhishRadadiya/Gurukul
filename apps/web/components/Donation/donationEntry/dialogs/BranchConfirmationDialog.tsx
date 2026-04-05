import { SaveDialog } from "@codezee/sixtify-brahma";
import { t } from "i18next";

type BranchConfirmationDialogProps = {
  branchName?: string;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
};

export const BranchConfirmationDialog = ({
  branchName,
  onClose,
  onConfirm,
  open,
}: BranchConfirmationDialogProps) => {
  const dialogTitle = branchName
    ? t("donation.entry.branch.confirmation.message", {
        branchName,
      })
    : t("donation.entry.branch.confirmation.default");

  return (
    <SaveDialog
      title={dialogTitle}
      open={open}
      onSave={onConfirm}
      onClose={onClose}
      cancelText={t("common.cancel.button")}
      saveText={t("common.yes")}
    />
  );
};
