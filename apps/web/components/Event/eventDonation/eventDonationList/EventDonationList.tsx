import { PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack, Typography, useTheme } from "@mui/material";
import { isActive } from "@tiptap/core";
import { type FilterModel } from "ag-grid-community";
import _flatMap from "lodash/flatMap";
import _split from "lodash/split";
import _uniq from "lodash/uniq";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { type FieldValues } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import { DonationEntryFilter } from "@web/components/Donation/donationEntry/donationEntryList/DonationEntryFilter";
import { useEventDonationColumns } from "@web/components/Event/eventDonation/eventDonationList/hooks/useEventDonationColumns";
import type { EventDonation } from "@web/components/Event/eventDonation/eventDonationList/hooks/useGetEventDonation";
import { useGetEventDonation } from "@web/components/Event/eventDonation/eventDonationList/hooks/useGetEventDonation";
import type { GetEventDonationExportApiSuccessResponse } from "@web/components/Event/eventDonation/eventDonationList/hooks/useGetEventDonationExport";
import { useGetEventDonationExport } from "@web/components/Event/eventDonation/eventDonationList/hooks/useGetEventDonationExport";
import { useBranch } from "@web/context/BranchContext";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";
import { formatToIndianNumber } from "@web/utils/helper";

export type EventDonationListProps = {
  externalDateFilter?: FieldValues;
};

const EVENT_SUMMARY = "event-summary";

export const EventDonationList = ({
  externalDateFilter,
}: EventDonationListProps) => {
  const theme = useTheme();

  const searchParams = useSearchParams();

  const { red } = theme.palette.app.color;

  const { allowPrintExport } = useUserPermissions();

  const { branchIds } = useBranch();

  const contact_no = searchParams.get("contact_no");

  const event_type_id = searchParams.get("event_type_id");

  const [filterListData, setFilterListData] = useState<FieldValues>({
    branch_id: [""],
  });

  useMemo(() => {
    setFilterListData((prev) => ({
      ...prev,
      branch_id: [branchIds],
    }));
  }, [branchIds]);

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  useEffect(() => {
    const moduleNameFromParams = searchParams.get("page");

    const trustId = searchParams.get("trust_id");

    const eventTypeId = searchParams.get("event_type_id");

    setFilterListData((prev) => ({
      ...prev,
      ...(!!trustId && {
        trust_id:
          EVENT_SUMMARY === moduleNameFromParams
            ? _split(trustId, ",")
            : trustId,
      }),
      ...(!!eventTypeId && {
        event_type_id: eventTypeId,
      }),
    }));
  }, [searchParams]);

  const { data: eventDonationList, isFetching } = useGetEventDonation({
    endRow,
    externalFilter: {
      branch_id: [branchIds],
      ...filterListData,
      ...externalDateFilter,
      is_active: isActive,
      ...(contact_no && { contact_no }),
      ...(event_type_id && { event_type_id }),
    },
    filterModel: agGridFilterModel,
    startRow,
  });

  const resetExportStateRef = useRef<(() => void) | null>(null);

  const { mutate: exportEventDonation } = useGetEventDonationExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetEventDonationExportApiSuccessResponse) => {
        resetExportStateRef.current?.();
        window.open(data.url, "_blank");
        toasts.success({ title: message });
      },
    },
  });

  const getExportBody = () => ({
    endRow: 0,
    externalFilter: {
      branch_id: [branchIds],
      ...filterListData,
      ...externalDateFilter,
      is_active: isActive,
      ...(contact_no && { contact_no }),
      ...(event_type_id && { event_type_id }),
    },
    filterModel: agGridFilterModel,
    startRow: 0,
  });

  const onExport = (fileType: FilType) => {
    exportEventDonation({
      body: getExportBody(),
      fileType,
    });
  };

  const {
    donationDetail,
    full_count,
    total_amount,
    total_cancel_amount,
    total_receipt,
  } = eventDonationList;

  const dynamicVariantTypes = useMemo<string[]>(
    () =>
      _uniq(
        _flatMap(
          donationDetail || [],
          ({ event_dropdown_detail }) =>
            event_dropdown_detail?.map((v) => v.title) || []
        )
      ),
    [donationDetail]
  );

  const dynamicEventItemTypes = useMemo<string[]>(
    () =>
      _uniq(
        _flatMap(
          donationDetail || [],
          ({ event_items_detail }) =>
            event_items_detail?.map((v) => v.title) || []
        )
      ),
    [donationDetail]
  );

  const { columns } = useEventDonationColumns({
    dynamicEventItemTypes,
    dynamicVariantTypes,
    loading: isFetching,
  });

  return (
    <>
      <PadBox padding={{ padding: "3px 5px" }}>
        <Stack
          direction="row"
          gap="10px"
          justifyContent="end"
          alignItems="center"
        >
          <DonationEntryFilter
            filterListData={filterListData}
            setFilterListData={setFilterListData}
            showEventDropdownFilter
          />

          <PermissionGuard canAccess={allowPrintExport}>
            <DataExport onExport={onExport} />
          </PermissionGuard>
        </Stack>
      </PadBox>

      <AgGridV2<EventDonation>
        defaultColDef={{
          cellStyle: ({ data }) => {
            if (data?.is_cancel) {
              return {
                color: red[500],
              };
            }
          },
        }}
        isLoading={isFetching}
        page={page}
        count={full_count}
        columnDefs={columns}
        rowData={donationDetail}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onFilterChange={setAgGridFilterModel}
        onRowsPerPageChange={onRowsPerPageChange}
        height={270}
        footer={
          <Stack direction="row" gap="60px">
            <Stack direction="row" gap="10px">
              <Typography variant="body2">Total Amount:</Typography>

              <Typography variant="body1">
                {formatToIndianNumber(Number(total_amount))}
              </Typography>
            </Stack>

            <Stack direction="row" gap="10px">
              <Typography variant="body2">Total Receipt:</Typography>

              <Typography variant="body1">{total_receipt || 0}</Typography>
            </Stack>

            <Stack direction="row" gap="10px">
              <Typography variant="body2">Total Cancel Amount:</Typography>

              <Typography variant="body1">
                {formatToIndianNumber(Number(total_cancel_amount))}
              </Typography>
            </Stack>
          </Stack>
        }
      />
    </>
  );
};
