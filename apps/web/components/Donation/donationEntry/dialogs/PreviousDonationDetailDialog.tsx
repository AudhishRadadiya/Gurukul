import { BottomDialog } from "@codezee/sixtify-brahma";
import { Button } from "@mui/material";
import { t } from "i18next";

import { DonationReceiptEntryList } from "@web/components/Donation/donationEntry/dialogs/DonationReceiptEntryList";
import { PreviousDonationList } from "@web/components/Donation/donationEntry/dialogs/PreviousDonationList";

type PreviousDonationDetailDialogProps = {
  contactNumber: string;
  onClose: () => void;
  open: boolean;
  setToggleDonationEntryList: (data: boolean) => void;
  toggleDonationEntryList: boolean;
};

export const PreviousDonationDetailDialog = ({
  contactNumber,
  onClose,
  open,
  setToggleDonationEntryList,
  toggleDonationEntryList,
}: PreviousDonationDetailDialogProps) => {
  const backProps = toggleDonationEntryList
    ? {
        backTitle: t("common.previous.donation.detail"),
        onBack: () => setToggleDonationEntryList(false),
      }
    : {};

  return (
    <BottomDialog
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose();
        }
      }}
      onClose={onClose}
      open={open}
      title={
        toggleDonationEntryList
          ? t("common.donation.receipt.entry")
          : t("common.previous.donation.detail")
      }
      actions={
        <Button onClick={onClose} variant="outlined">
          {t("common.cancel.button")}
        </Button>
      }
      {...backProps}
    >
      {toggleDonationEntryList ? (
        <DonationReceiptEntryList contactNumber={contactNumber} />
      ) : (
        <PreviousDonationList
          onClose={onClose}
          contactNumber={contactNumber}
          setToggleDonationEntryList={setToggleDonationEntryList}
        />
      )}
    </BottomDialog>
  );
};
