import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";

import type {
  DonationEntryFormFieldValues,
  FormRef,
} from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import { DonationEntryForm } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import { useAddDonationEntry } from "@web/components/Donation/donationEntry/addDonationEntry/hooks/useAddDonationEntry";
import { useGetDonationEntryDetails } from "@web/components/Donation/donationEntry/editDonationEntry/hooks/useGetDonationEntryDetails";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type CloneDonationEntryProps = {
  donationId: string;
};

export const CloneDonationEntry = ({ donationId }: CloneDonationEntryProps) => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: donationEntryDetails, isLoading: isDonationEntryLoading } =
    useGetDonationEntryDetails({
      donationId,
    });

  const { isPending, mutate } = useAddDonationEntry({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),

      onSuccess: ({ data, message }, variables) => {
        toasts.success({ title: message });

        if (data.receipt) {
          const printUrl = `/print-pdf.html?pdf=${encodeURIComponent(data.receipt)}`;

          const url = variables.direct_print ? printUrl : data.receipt;

          window.open(url, "_blank");
        }
      },
    },
  });

  const onCloneDonationEntry = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  useMemo(() => {
    if (donationEntryDetails) {
      const donationEntryFormFieldValues: DonationEntryFormFieldValues = {
        ...donationEntryDetails,
        amount: 0,
        date: DateTime.now().toISODate(),
        focus_on_trust: false,
        last_five_entry: true,
        receipt_no: null,
        selected_previousDonation: {
          address: donationEntryDetails.address ?? null,
          city: donationEntryDetails.city ?? null,
          email_id: donationEntryDetails.email_id ?? null,
          pan_no: donationEntryDetails.pan_no ?? null,
          pincode: donationEntryDetails.pincode ?? null,
          state: donationEntryDetails.state ?? null,
        },
      };

      formRef.current?.reset(donationEntryFormFieldValues, {
        keepDefaultValues: true,
      });
    }
  }, [donationEntryDetails]);

  return (
    <PadBox padding={{ padding: "10px" }}>
      <Stack gap="10px">
        <DonationEntryForm ref={formRef} loading={isDonationEntryLoading} />

        <PadBox padding={{ paddingRight: "20px" }}>
          <Stack direction="row" justifyContent="end" gap="10px">
            <Button
              variant="outlined"
              onClick={() => {
                router.push("/donation/donation-entry");
              }}
              loading={isPending}
            >
              {t("common.cancel.button")}
            </Button>

            <Button
              loading={isPending}
              disabled={isDisabled()}
              onClick={onCloneDonationEntry}
            >
              {t("common.save.button")}
            </Button>
          </Stack>
        </PadBox>
      </Stack>
    </PadBox>
  );
};
