import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import type { FormRef } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import { DonationEntryForm } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import { useAddDonationEntry } from "@web/components/Donation/donationEntry/addDonationEntry/hooks/useAddDonationEntry";
import { onError } from "@web/utils/errors";

export const AddDonationEntry = () => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { isPending, mutate } = useAddDonationEntry({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),

      onSuccess: ({ data, message }) => {
        toasts.success({ title: message });

        if (data.receipt) {
          window.open(data.receipt, "_blank");
        }

        formRef.current?.reset({
          aadhar_no: "",
          address: "",
          amount: 0,
          bank_id: "",
          business_name: "",
          cheque_no: "",
          city: "",
          contact_no: "",
          driving_licence_no: "",
          electors_number: "",
          email_id: "",
          event_reminder_date: "",
          event_reminder_note: "",
          event_type_id: "",
          first_name: "",
          is_bank_mode: false,
          is_reminder: false,
          last_name: "",
          middle_name: "",
          mode_of_receipt: "",
          name_of_receipt: "",
          organize_remark: "",
          pan_no: "",
          passport_no: "",
          pincode: "",
          receipt_no: "",
          receipt_sequence: 0,
          ref_receipt_no: "",
          remarks: "",
          show_business_name: false,
          state: "",
          trust_data: {
            label: "",
            value: "",
          },
          trust_id: "",
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
        <DonationEntryForm ref={formRef} loading={isPending} />

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
