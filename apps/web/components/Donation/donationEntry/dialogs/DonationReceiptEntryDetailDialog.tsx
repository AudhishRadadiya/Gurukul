import { BottomDialog } from "@codezee/sixtify-brahma";
import { Button } from "@mui/material";
import { t } from "i18next";

import { DonationReceiptEntryList } from "@web/components/Donation/donationEntry/dialogs/DonationReceiptEntryList";

type DonationReceiptEntryDetailDialogProps = {
  contactNumber: string;
  onClose: () => void;
  open: boolean;
};

export const DonationReceiptEntryDetailDialog = ({
  contactNumber,
  onClose,
  open,
}: DonationReceiptEntryDetailDialogProps) => {
  return (
    <BottomDialog
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose();
        }
      }}
      onClose={onClose}
      open={open}
      title={t("common.donation.receipt.entry")}
      actions={
        <Button onClick={onClose} variant="outlined">
          {t("common.cancel.button")}
        </Button>
      }
    >
      <DonationReceiptEntryList contactNumber={contactNumber} />
    </BottomDialog>
  );
};
