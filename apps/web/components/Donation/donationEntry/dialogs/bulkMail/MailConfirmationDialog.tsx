import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { SaveDialog, useDialogActions } from "@codezee/sixtify-brahma";
import { t } from "i18next";

import { BulkMailDialog } from "@web/components/Donation/donationEntry/dialogs/bulkMail/BulkMailDialog";

type MailConfirmationDialogProps = {
  onClose: () => void;
  open: boolean;
  selectedRows: string[];
};

export const MailConfirmationDialog = ({
  onClose,
  open,
  selectedRows,
}: MailConfirmationDialogProps) => {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const onMailConfirmation = () => {
    onDialogOpen("bulkMail");
  };

  const dialogRenderer: DialogRenderer = {
    bulkMail: (
      <BulkMailDialog
        open
        onClose={onDialogClose}
        onConfirmationClose={onClose}
        selectedRows={selectedRows}
      />
    ),
  };

  return (
    <>
      <SaveDialog
        title={t("common.bulk.email.confirmation.title")}
        open={open}
        onSave={onMailConfirmation}
        onClose={onClose}
        cancelText={t("common.no")}
        saveText={t("common.yes")}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
