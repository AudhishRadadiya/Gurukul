import { Button, Dialog } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";

import type { DonationEntryFormNonNullFieldValues } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import type { FormRef } from "@web/components/Donation/donationEntry/dialogs/DonationReceiptEntryForm";
import { DonationReceiptEntryForm } from "@web/components/Donation/donationEntry/dialogs/DonationReceiptEntryForm";
import type { DonationReceiptEntryDetail } from "@web/components/Donation/donationEntry/dialogs/hooks/useGetDonationReceiptEntryDetail";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";

type EditDonationReceiptEntryDialogProps = {
  donationReceiptEntryDetails: DonationReceiptEntryDetail;
  onClose: () => void;
  open: boolean;
};

export const EditDonationReceiptEntryDialog = ({
  donationReceiptEntryDetails,
  onClose,
  open,
}: EditDonationReceiptEntryDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const methods = useFormContext<DonationEntryFormNonNullFieldValues>();

  const { setValue, watch } = methods;

  const eventDonationData = watch("event_donation");

  const filteredDonationData = eventDonationData?.filter(
    (item) =>
      item.event_donation_id !== donationReceiptEntryDetails.event_donation_id
  );

  const onEditDonationReceiptEntry = () => {
    formRef.current?.submitForm((formValues) => {
      if (formValues.amount) {
        const newEventDonation = [
          {
            amount: formValues.amount,
            event_donation_id: donationReceiptEntryDetails.event_donation_id,
          },
        ];

        const updatedEventDonations =
          filteredDonationData && !!filteredDonationData.length
            ? [...filteredDonationData, ...newEventDonation]
            : newEventDonation;

        const totalEventDonationAmount = updatedEventDonations?.reduce(
          (acc, curr) => acc + (curr.amount ?? 0),
          0
        );

        setValue("amount", totalEventDonationAmount, { shouldDirty: true });

        setValue("event_donation", updatedEventDonations, {
          shouldDirty: true,
        });
      }
    });

    onClose();
  };

  return (
    <Dialog
      maxWidth="xs"
      onClose={onClose}
      open={open}
      title={t("common.edit.label", {
        label: t("common.receipt.entry"),
      })}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <Button onClick={onEditDonationReceiptEntry} disabled={isDisabled()}>
            {t("common.save.button")}
          </Button>
        </Stack>
      }
    >
      <DonationReceiptEntryForm ref={formRef} />
    </Dialog>
  );
};
