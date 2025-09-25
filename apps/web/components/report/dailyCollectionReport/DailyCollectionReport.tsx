import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  Button,
  PadBox,
  toasts,
  useDialogActions,
} from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import {
  DailyCollectionReportFrom,
  type FormRef,
} from "@web/components/report/dailyCollectionReport/DailyCollectionReportFrom";
import { AddDailyCollectionDialog } from "@web/components/report/dailyCollectionReport/dialog/AddDailyCollectionDialog";
import type { ReportMode } from "@web/components/report/dailyCollectionReport/hooks/useGetDailyCollectionReport";
import { useGetDailyCollectionReport } from "@web/components/report/dailyCollectionReport/hooks/useGetDailyCollectionReport";
import type { GetDonationReportApiSuccessResponse } from "@web/components/report/donationReport/hooks/useGetDonationReport";

export const DailyCollectionReport = () => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { isPending, mutate } = useGetDailyCollectionReport({
    options: {
      onSuccess: ({ data, message }: GetDonationReportApiSuccessResponse) => {
        toasts.success({ title: message });
        window.open(data.url, "_blank");
        router.push("/donation/donation-entry");
      },
    },
  });

  const onGenerateDonationReport = (reportMode: ReportMode) => {
    formRef.current?.submitForm((formValues) => {
      return mutate({
        body: formValues,
        reportMode,
      });
    });
  };

  const buttons: { label: string; reportMode: ReportMode }[] = [
    { label: t("generate.btn"), reportMode: "report" },
    { label: t("print.donation.btn"), reportMode: "report_name" },
    { label: t("print.for.ac.btn"), reportMode: "account" },
  ];

  const dialogRenderer: DialogRenderer = {
    add: <AddDailyCollectionDialog open onClose={onDialogClose} />,
  };

  return (
    <>
      <DailyCollectionReportFrom ref={formRef} />

      <PadBox padding={{ paddingTop: "20px" }}>
        <Stack direction="row" justifyContent="end" gap="10px">
          <Button
            variant="outlined"
            onClick={() => {
              router.push("/donation/donation-entry");
            }}
          >
            {t("common.cancel.button")}
          </Button>

          {buttons.map(({ label, reportMode }) => (
            <Button
              key={reportMode}
              loading={isPending}
              onClick={() => onGenerateDonationReport(reportMode)}
            >
              {label}
            </Button>
          ))}

          <Button
            loading={isPending}
            onClick={() => {
              onDialogOpen("add");
            }}
          >
            {t("submit.collection")}
          </Button>
        </Stack>
      </PadBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
