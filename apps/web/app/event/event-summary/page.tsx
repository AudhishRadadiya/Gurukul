"use client";

import { ContentBox, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import { DataExport } from "@web/components/common/DataExport/DataExport";
import { EventSummaryBreadcrumbs } from "@web/components/Event/EventSummary/EventSummaryBreadcrumbs";
import { EventSummaryFilter } from "@web/components/Event/EventSummary/EventSummaryList/EventSummaryFilter";
import { EventSummaryList } from "@web/components/Event/EventSummary/EventSummaryList/EventSummaryList";
import type { GetEventSummaryExportApiSuccessResponse } from "@web/components/Event/EventSummary/EventSummaryList/hooks/useGetEventSummaryExport";
import { useGetEventSummaryExport } from "@web/components/Event/EventSummary/EventSummaryList/hooks/useGetEventSummaryExport";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const [filterListData, setFilterListData] = useState<FieldValues>({});

  const { mutate: getEventSummaryExport } = useGetEventSummaryExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetEventSummaryExportApiSuccessResponse) => {
        window.open(data.url, "_blank");

        toasts.success({ title: message });
      },
    },
  });

  const onExport = (fileType: FilType) => {
    getEventSummaryExport({
      body: {
        externalFilter: { ...filterListData },
      },
      fileType,
    });
  };

  const handleApplyFilter = (data: FieldValues) => {
    setFilterListData(data);
  };

  return (
    <Stack gap="10px">
      <EventSummaryBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Typography variant="subtitle1">
            {t("summary.label", {
              label: t("common.event.label"),
            })}
          </Typography>
        </PadBox>
      </ContentBox>

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack direction="row" gap="10px">
            <EventSummaryFilter
              filterListData={filterListData}
              handleApplyFilter={handleApplyFilter}
            />

            <DataExport onExport={onExport} />
          </Stack>
        </PadBox>

        <EventSummaryList externalFilter={filterListData} />
      </ContentBox>
    </Stack>
  );
}
