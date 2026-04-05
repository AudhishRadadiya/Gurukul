import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import _mapValues from "lodash/mapValues";
import _pick from "lodash/pick";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";

import type { FormRef } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import { DonationEntryForm } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import { donationEntryFormDefaultValues } from "@web/components/Donation/donationEntry/addDonationEntry/hooks/DonationEntryFormSchema";
import { useAddDonationEntry } from "@web/components/Donation/donationEntry/addDonationEntry/hooks/useAddDonationEntry";
import { cancelReceiptKeys } from "@web/queryKeysFactories/cancelReceipt";
import { donationEntryKeys } from "@web/queryKeysFactories/donationEntry";
import { onError } from "@web/utils/errors";

export const DONATION_ENTRY_PREFERENCES_KEY = "donationEntryPreferences";

const DONATION_ENTRY_PREFERENCE_FIELDS = [
  "atg",
  "direct_print",
  "focus_on_trust",
  "last_five_entry",
  "prasad",
  "print_receipt",
  "send_email",
  "send_sms",
  "send_whatsapp",
] as const;

export const AddDonationEntry = () => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const formRef = useRef<FormRef>(null);

  const defaultFormValues = useMemo(() => {
    const storedPreferences = localStorage.getItem(
      DONATION_ENTRY_PREFERENCES_KEY
    );

    if (!storedPreferences) {
      return donationEntryFormDefaultValues;
    }

    const donationEntryPreferences = JSON.parse(storedPreferences);

    return {
      ...donationEntryFormDefaultValues,
      ...donationEntryPreferences,
    };
  }, []);

  const { isPending, mutate } = useAddDonationEntry({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),

      onSuccess: async ({ data, message }, variables) => {
        toasts.success({ title: message });

        if (data.receipt) {
          const printUrl = `/print-pdf.html?pdf=${encodeURIComponent(data.receipt)}`;

          const url = variables.direct_print ? printUrl : data.receipt;

          window.open(url, "_blank");
        }

        const currentValues = formRef.current?.getValues();

        const shouldPreserveTrustFields = currentValues?.focus_on_trust;

        const donationEntryPreferencesToPersist = _mapValues(
          _pick(variables, DONATION_ENTRY_PREFERENCE_FIELDS),
          (value) => !!value
        );

        localStorage.setItem(
          DONATION_ENTRY_PREFERENCES_KEY,
          JSON.stringify(donationEntryPreferencesToPersist)
        );

        const resetValues = {
          aadhar_no: null,
          address: null,
          amount: 0,
          bank_id: null,
          business_name: null,
          cheque_no: null,
          city: null,
          contact_no: null,
          driving_licence_no: null,
          electors_number: null,
          email_id: null,
          event_reminder_date: null,
          event_reminder_note: null,
          event_type_id: null,
          first_name: null,
          is_bank_mode: false,
          is_reminder: false,
          last_name: null,
          middle_name: null,
          name_of_receipt: null,
          organize_remark: null,
          pan_no: null,
          passport_no: null,
          pincode: null,
          receipt_no: null,
          receipt_sequence: 0,
          ref_receipt_no: null,
          remarks: null,
          selected_previousDonation: {
            address: null,
            city: null,
            email_id: null,
            pan_no: null,
            pincode: null,
            state: null,
          },
          show_business_name: false,
          state: null,
          ...(shouldPreserveTrustFields
            ? {
                donation_mode_id: currentValues.donation_mode_id,
                focus_on_trust: currentValues.focus_on_trust,
                trust_id: currentValues.trust_id,
              }
            : {
                donation_mode_id: null,
                focus_on_trust: false,
                trust_id: null,
              }),
          ...donationEntryPreferencesToPersist,
        };

        formRef.current?.reset(resetValues, {
          keepDefaultValues: true,
        });

        if (
          shouldPreserveTrustFields &&
          currentValues.trust_id &&
          currentValues.donation_mode_id
        ) {
          await queryClient.invalidateQueries({
            queryKey: cancelReceiptKeys.generateReceiptNumber(
              currentValues.donation_mode_id,
              currentValues.trust_id
            ),
          });
        }

        await queryClient.invalidateQueries({
          queryKey: donationEntryKeys.latestReceiptNo(),
        });
      },
    },
  });

  const onCreateDonationEntry = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <PadBox padding={{ padding: "10px" }}>
      <Stack gap="10px">
        <DonationEntryForm
          defaultValues={defaultFormValues}
          ref={formRef}
          loading={isPending}
        />

        <PadBox padding={{ paddingRight: "20px" }}>
          <Stack direction="row" justifyContent="end" gap="10px">
            <Button
              variant="outlined"
              onClick={() => {
                router.push("/donation/donation-entry");
              }}
            >
              {t("common.cancel.button")}
            </Button>

            <Button loading={isPending} onClick={onCreateDonationEntry}>
              {t("common.save.button")}
            </Button>
          </Stack>
        </PadBox>
      </Stack>
    </PadBox>
  );
};
