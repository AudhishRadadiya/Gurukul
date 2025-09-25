import { BottomDialog } from "@codezee/sixtify-brahma";
import { Button } from "@mui/material";
import { t } from "i18next";

import { ReceiptEntryDetailList } from "@web/components/Event/eventDonationEntry/dialogs/receiptEntryDetailDialog/ReceiptEntryDetailList";

type ReceiptEntryDetailDialogProps = {
  dailyDonationId: string;
  onClose: () => void;
  open: boolean;
};

export const ReceiptEntryDetailDialog = ({
  dailyDonationId,
  onClose,
  open,
}: ReceiptEntryDetailDialogProps) => {
  return (
    <BottomDialog
      onClose={onClose}
      open={open}
      title={t("common.receipt.entry")}
      actions={
        <Button onClick={onClose} variant="outlined">
          {t("common.cancel.button")}
        </Button>
      }
    >
      <ReceiptEntryDetailList dailyDonationId={dailyDonationId} />
    </BottomDialog>
  );
};
