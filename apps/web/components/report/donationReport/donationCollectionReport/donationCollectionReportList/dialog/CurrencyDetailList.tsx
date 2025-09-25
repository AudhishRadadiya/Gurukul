import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { useCurrencyDetailColumns } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/dialog/hooks/useCurrencyDetailColumns";
import { type CurrencyData } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/dialog/hooks/useGetCurrencyDetail";

type CurrencyDetailListProps = {
  currencyData: CurrencyData[];
  isLoading?: boolean;
};

export const CurrencyDetailList = ({
  currencyData,
  isLoading = false,
}: CurrencyDetailListProps) => {
  const { column } = useCurrencyDetailColumns();

  return (
    <AgGridV2<CurrencyData>
      isLoading={isLoading}
      rowData={currencyData}
      columnDefs={column}
      height={700}
    />
  );
};
