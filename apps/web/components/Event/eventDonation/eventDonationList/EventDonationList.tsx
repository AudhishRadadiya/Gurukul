import { PadBox, toasts, useGetDeviceType } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { isActive } from "@tiptap/core";
import type { SortModelItem, FilterModel } from "ag-grid-community";
import _flatMap from "lodash/flatMap";
import _split from "lodash/split";
import _uniq from "lodash/uniq";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import { EventDonationFilter } from "@web/components/Event/eventDonation/eventDonationList/EventDonationFilter";
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
import { filterSearchParams, formatToIndianNumber } from "@web/utils/helper";

export type EventDonationListProps = {
  externalDateFilter?: FieldValues;
  filterListData: FieldValues;
  handleApplyFilter: (data: FieldValues) => void;
  search: string;
  setFilterListData: (data: FieldValues) => void;
};

const EVENT_SUMMARY = "event-summary";

export const EventDonationList = ({
  externalDateFilter,
  filterListData,
  handleApplyFilter,
  search,
  setFilterListData,
}: EventDonationListProps) => {
  const theme = useTheme();

  const { isMobile } = useGetDeviceType();

  const searchParams = useSearchParams();

  const { red } = theme.palette.app.color;

  const { allowPrintExport } = useUserPermissions();

  const { branchIds } = useBranch();

  const contact_no = searchParams.get("contact_no");

  const event_id = searchParams.get("event_id");

  useMemo(() => {
    setFilterListData((prev: FieldValues) => ({
      ...prev,
      branch_id: [branchIds],
    }));
  }, [branchIds]);

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  useEffect(() => {
    const moduleNameFromParams = searchParams.get("page");

    const trustId = searchParams.get("trust_id");

    const eventId = searchParams.get("event_id");

    setFilterListData((prev: FieldValues) => ({
      ...prev,
      ...(!!trustId && {
        trust_id:
          EVENT_SUMMARY === moduleNameFromParams
            ? _split(trustId, ",")
            : trustId,
      }),
      ...(!!eventId && {
        event_id: eventId,
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
      ...(event_id && { event_id }),
    },
    filterModel: agGridState.filterModel,
    quickFilter: filterSearchParams(search),
    sortModel: agGridState.sortModel,
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
      ...(event_id && { event_id }),
    },
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
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
            event_items_detail?.map((v) => {
              return `${v.title}=${v.kind}`;
            }) || []
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
      <PadBox padding={{ padding: { md: "3px 5px", xs: "8px 10px" } }}>
        <Stack
          direction="row"
          gap="10px"
          justifyContent={{ md: "flex-end", xs: "flex-start" }}
          alignItems="center"
          flexWrap="wrap"
          sx={{
            "& .MuiButton-root": {
              flexGrow: { md: 0, xs: 1 },
              minWidth: { md: "auto", xs: "calc(50% - 10px)" },
              whiteSpace: "nowrap",
            },
          }}
        >
          <EventDonationFilter
            filterListData={filterListData}
            handleApplyFilter={handleApplyFilter}
          />

          <PermissionGuard canAccess={allowPrintExport}>
            <Box sx={{ flexShrink: 0 }}>
              <DataExport onExport={onExport} />
            </Box>
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
        onGridStateChange={setAgGridState}
        onRowsPerPageChange={onRowsPerPageChange}
        noNeedToApplyPaginationHeight
        height={isMobile ? 400 : 265}
        footer={
          <PadBox padding={{ padding: { md: "8px 25px", xs: "8px 12px" } }}>
            <Stack
              direction="row"
              gap={{ md: "60px", xs: "12px" }}
              flexWrap="wrap"
              sx={{ width: "100%" }}
            >
              <Stack direction="row" gap="10px" flexShrink={0}>
                <Typography variant="body2" whiteSpace="nowrap">
                  Total Amount:
                </Typography>

                <Typography variant="body1" whiteSpace="nowrap">
                  {formatToIndianNumber(Number(total_amount))}
                </Typography>
              </Stack>

              <Stack direction="row" gap="10px" flexShrink={0}>
                <Typography variant="body2" whiteSpace="nowrap">
                  Total Receipt:
                </Typography>

                <Typography variant="body1" whiteSpace="nowrap">
                  {total_receipt || 0}
                </Typography>
              </Stack>

              <Stack direction="row" gap="10px" flexShrink={0}>
                <Typography variant="body2" whiteSpace="nowrap">
                  Total Cancel Amount:
                </Typography>

                <Typography variant="body1" whiteSpace="nowrap">
                  {formatToIndianNumber(Number(total_cancel_amount))}
                </Typography>
              </Stack>
            </Stack>
          </PadBox>
        }
      />
    </>
  );
};
