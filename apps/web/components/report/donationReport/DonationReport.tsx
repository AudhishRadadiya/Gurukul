import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import type { FormRef } from "@web/components/report/donationReport/DonationReportFrom";
import { DonationReportFrom } from "@web/components/report/donationReport/DonationReportFrom";
import type { GetDonationReportApiSuccessResponse } from "@web/components/report/donationReport/hooks/useGetDonationReport";
import { useGetDonationReport } from "@web/components/report/donationReport/hooks/useGetDonationReport";
import { onError } from "@web/utils/errors";

export const DonationReport = () => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { isPending, mutate } = useGetDonationReport({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: ({ data, message }: GetDonationReportApiSuccessResponse) => {
        toasts.success({ title: message });
        window.open(data.url, "_blank");
        router.push("/report/donation-report");
      },
    },
  });

  const onGenerateDonationReport = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <>
      <DonationReportFrom ref={formRef} />

      <PadBox padding={{ paddingTop: "20px" }}>
        <Stack direction="row" justifyContent="end" gap="10px">
          <Button
            variant="outlined"
            onClick={() => {
              router.push("/user/user-master");
            }}
          >
            {t("common.cancel.button")}
          </Button>

          <Button loading={isPending} onClick={onGenerateDonationReport}>
            {t("common.print.button")}
          </Button>
        </Stack>
      </PadBox>
    </>
  );
};
