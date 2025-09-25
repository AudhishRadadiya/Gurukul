import { Button, Dialog } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";

import { CurrencyDetailList } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/dialog/CurrencyDetailList";
import { useGetCurrencyDetail } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/dialog/hooks/useGetCurrencyDetail";

type CurrencyDetailDialogProps = {
  dailyDonationId: string;
  onClose: () => void;
  open: boolean;
};

export const CurrencyDetailDialog = ({
  dailyDonationId,
  onClose,
  open,
}: CurrencyDetailDialogProps) => {
  const { data: currencyData, isFetching } = useGetCurrencyDetail({
    dailyDonationId,
  });

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title={t("common.currency.detail")}
      actions={
        <Button onClick={onClose} variant="outlined">
          {t("common.cancel.button")}
        </Button>
      }
    >
      <CurrencyDetailList
        currencyData={currencyData.data}
        isLoading={isFetching}
      />

      <Stack
        display="grid"
        gridTemplateColumns="1fr 1fr 1fr"
        fontWeight={600}
        mt={2}
      >
        <Typography>{t("common.total")}</Typography>

        <Typography>{currencyData.total_qty}</Typography>

        <Typography>{currencyData.total_amount}</Typography>
      </Stack>
    </Dialog>
  );
};
