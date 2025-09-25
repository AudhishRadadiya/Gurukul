import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { forwardRef, useState } from "react";
import type { FieldValues } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { useDonationSummaryColumns } from "@web/components/Donation/donationSummary/donationSummaryList/hooks/useDonationSummaryColumns";
import type { DonationSummary } from "@web/components/Donation/donationSummary/donationSummaryList/hooks/useGetDonationSummary";
import { useGetDonationSummary } from "@web/components/Donation/donationSummary/donationSummaryList/hooks/useGetDonationSummary";
import { buildQuery } from "@web/components/Event/EventSummary/EventSummaryList/EventSummaryList";

export type DonationSummaryListProps = {
  externalFilter: FieldValues;
  fromDate: string;
  onlyContactNo: boolean;
  toDate: string;
};

export const DonationSummaryList = forwardRef(
  ({
    externalFilter,
    fromDate,
    onlyContactNo,
    toDate,
  }: DonationSummaryListProps) => {
    const router = useRouter();

    const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
      usePaginationParams();

    const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

    const startRow = page * rowsPerPage;

    const endRow = startRow + rowsPerPage;

    const { data, isFetching } = useGetDonationSummary({
      endRow,
      externalFilter: {
        ...externalFilter,
        from_date: fromDate,
        only_contact_no: onlyContactNo,
        to_date: toDate,
      },
      filterModel: agGridFilterModel,
      startRow,
    });

    const { donationSummary: rowData, totalCount = 0 } = data ?? {};

    const { column } = useDonationSummaryColumns();

    return (
      <AgGridV2<DonationSummary>
        isLoading={isFetching}
        page={page}
        rowData={rowData}
        count={totalCount}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onFilterChange={setAgGridFilterModel}
        onRowsPerPageChange={onRowsPerPageChange}
        height={260}
        actions={[
          {
            onClick: (data) => {
              const query: FieldValues = buildQuery({
                ...externalFilter,
                contact_no: data.contact_no,
              });

              const params = new URLSearchParams(query).toString();

              router.push(`/donation/donation-entry?${params}`);
            },
            title: t("common.details.label"),
          },
        ]}
      />
    );
  }
);

DonationSummaryList.displayName = "DonationSummaryList";
