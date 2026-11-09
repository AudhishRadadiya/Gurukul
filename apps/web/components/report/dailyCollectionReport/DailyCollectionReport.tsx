import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  Button,
  PadBox,
  toasts,
  useDialogActions,
  useGetDeviceType,
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
  const { isMobile } = useGetDeviceType();

  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { isPending, mutate } = useGetDailyCollectionReport({
    options: {
      onSuccess: ({ data, message }: GetDonationReportApiSuccessResponse) => {
        toasts.success({ title: message });

        window.open(data.url, "_blank");
        router.push("/report/daily-collection-report");
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

      <PadBox padding={{ paddingTop: { sm: "20px", xs: "32px" } }}>
        <Stack
          direction={{ sm: "row", xs: "column" }}
          alignItems={{ sm: "center", xs: "stretch" }}
          justifyContent="flex-end"
          gap={{ sm: "10px", xs: "8px" }}
          flexWrap={{ sm: "wrap", xs: "nowrap" }}
        >
          <Button
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{ width: { sm: "auto", xs: "100%" } }}
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
              size={isMobile ? "small" : "medium"}
              onClick={() => onGenerateDonationReport(reportMode)}
              sx={{
                minWidth: { sm: "100px", xs: "unset" },
                width: { sm: "auto", xs: "100%" },
              }}
            >
              {label}
            </Button>
          ))}

          <Button
            loading={isPending}
            size={isMobile ? "small" : "medium"}
            sx={{
              minWidth: { sm: "150px", xs: "unset" },
              width: { sm: "auto", xs: "100%" },
            }}
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
