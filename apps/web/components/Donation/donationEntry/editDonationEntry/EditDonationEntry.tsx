import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";

import type {
  DonationEntryFormFieldValues,
  FormRef,
} from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import { DonationEntryForm } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import { useEditDonationEntry } from "@web/components/Donation/donationEntry/editDonationEntry/hooks/useEditDonationEntry";
import { useGetDonationEntryDetails } from "@web/components/Donation/donationEntry/editDonationEntry/hooks/useGetDonationEntryDetails";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditDonationEntryProps = {
  donationId: string;
};
export const EditDonationEntry = ({ donationId }: EditDonationEntryProps) => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: donationEntryDetails, isLoading: isDonationEntryLoading } =
    useGetDonationEntryDetails({
      donationId,
    });

  const { isPending, mutate } = useEditDonationEntry({
    donationId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),

      onSuccess: ({ data, message }, variables) => {
        toasts.success({ title: message });

        if (data.receipt) {
          const printUrl = `/print-pdf.html?pdf=${encodeURIComponent(data.receipt)}`;

          const url = variables.direct_print ? printUrl : data.receipt;

          window.open(url, "_blank");
        }

        router.push("/donation/donation-entry");
      },
    },
  });

  const onCreateDonationEntry = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (donationEntryDetails) {
      const donationEntryFormFieldValues: DonationEntryFormFieldValues = {
        ...donationEntryDetails,
        focus_on_trust: false,
        last_five_entry: true,
        selected_previousDonation: {
          address: donationEntryDetails.address ?? null,
          city: donationEntryDetails.city ?? null,
          email_id: donationEntryDetails.email_id ?? null,
          pan_no: donationEntryDetails.pan_no ?? null,
          pincode: donationEntryDetails.pincode ?? null,
          state: donationEntryDetails.state ?? null,
        },
        show_id_fields: false,
      };

      return donationEntryFormFieldValues;
    }
  }, [donationEntryDetails]);

  return (
    <PadBox padding={{ padding: { sm: "10px", xs: "8px" } }}>
      <Stack gap="10px">
        <DonationEntryForm
          ref={formRef}
          loading={isDonationEntryLoading}
          defaultValues={defaultValues}
        />

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
              onClick={onCreateDonationEntry}
            >
              {t("common.save.button")}
            </Button>
          </Stack>
        </PadBox>
      </Stack>
    </PadBox>
  );
};
