import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import _mapValues from "lodash/mapValues";
import _pick from "lodash/pick";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";

import { DONATION_ENTRY_PREFERENCE_FIELDS } from "@web/components/Donation/donationEntry/addDonationEntry/AddDonationEntry";
import type {
  DonationEntryFormFieldValues,
  FormRef,
} from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import { DonationEntryForm } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import { useAddDonationEntry } from "@web/components/Donation/donationEntry/addDonationEntry/hooks/useAddDonationEntry";
import { useGetDonationEntryDetails } from "@web/components/Donation/donationEntry/editDonationEntry/hooks/useGetDonationEntryDetails";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { cancelReceiptKeys } from "@web/queryKeysFactories/cancelReceipt";
import { donationEntryKeys } from "@web/queryKeysFactories/donationEntry";
import { onError } from "@web/utils/errors";

type CloneDonationEntryProps = {
  donationId: string;
};

export const CloneDonationEntry = ({ donationId }: CloneDonationEntryProps) => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: donationEntryDetails, isLoading: isDonationEntryLoading } =
    useGetDonationEntryDetails({
      donationId,
    });

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

        const resetValues = {
          aadhar_no: null,
          address: null,
          amount: 0,
          bank_id: null,
          business_name: null,
          cheque_no: null,
          city: null,
          contact_no: "",
          driving_licence_no: null,
          electors_number: null,
          email_id: null,
          event_reminder_date: null,
          event_reminder_note: null,
          event_type_id: null,
          first_name: "",
          is_bank_mode: false,
          is_reminder: false,
          last_name: "",
          middle_name: "",
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
    <PadBox padding={{ padding: { sm: "10px", xs: "8px" } }}>
      <Stack gap="10px">
        <DonationEntryForm ref={formRef} loading={isDonationEntryLoading} />

        <PadBox padding={{ paddingRight: { sm: "20px", xs: 0 } }}>
          <Stack
            direction="row"
            justifyContent={{ sm: "end", xs: "stretch" }}
            gap="10px"
            sx={{
              "& .MuiButton-root": {
                flex: { sm: "0 0 auto", xs: 1 },
              },
            }}
          >
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
