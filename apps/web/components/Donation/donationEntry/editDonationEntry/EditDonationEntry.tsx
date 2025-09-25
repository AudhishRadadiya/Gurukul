import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import type { FormRef } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
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

      onSuccess: ({ data, message }) => {
        toasts.success({ title: message });

        window.open(data.receipt, "_blank");

        router.push("/donation/donation-entry");
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
          ref={formRef}
          loading={isDonationEntryLoading}
          defaultValues={donationEntryDetails}
        />

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
