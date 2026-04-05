"use client";

import {
  Autocomplete,
  ContentBox,
  DatePicker,
  PadBox,
} from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { DateFilterPeriodAutocomplete } from "@web/components/common/Autocomplete/DateFilterPeriodAutocomplete";
import { useGetEventDropdownOptions } from "@web/components/common/Autocomplete/hooks/useGetEventDropdownOptions";
import { useGetFilterEventOptionsFromMultipleBranch } from "@web/components/common/Autocomplete/hooks/useGetFilterEventOptionsFromMultipleBranch";
import { ONE_MONTH } from "@web/components/common/hooks/constant";
import { EventDropdownSummaryBreadcrumbs } from "@web/components/Event/eventDropdownSummary/EventDropdownSummaryBreadcrumbs";
import { EventDropdownSummaryList } from "@web/components/Event/eventDropdownSummary/eventDropdownSummaryList/EventDropdownSummaryList";
import { useBranch } from "@web/context/BranchContext";
import { useAutoSelectFirstOption } from "@web/hooks/useAutoSelectFirstOption";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { resetDependentFields } from "@web/utils/helper";

type EventFilterFormValues = {
  event_dropdown_id: string | null;
  event_master_id: string | null;
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { control: dateControl, fromDate, toDate } = useDateFilters(ONE_MONTH);

  const { branchIds } = useBranch();

  const {
    clearErrors,
    control: eventControl,
    formState: { dirtyFields },
    setValue: setEventFilterValue,
    watch: watchEventFilter,
  } = useForm<EventFilterFormValues>({
    defaultValues: {
      event_dropdown_id: null,
      event_master_id: null,
    },
  });

  const eventMasterId = watchEventFilter("event_master_id") ?? "";

  const eventDropdownId = watchEventFilter("event_dropdown_id");

  const { data: filterEventOptions } =
    useGetFilterEventOptionsFromMultipleBranch({
      branchIds: [branchIds],
      for_dropdown: true,
    });

  const { data: eventDropdownOptions } = useGetEventDropdownOptions({
    eventMasterId,
  });

  useAutoSelectFirstOption({
    currentValue: eventMasterId,
    enabled: !!branchIds,
    fieldName: "event_master_id",
    options: filterEventOptions,
    setValue: setEventFilterValue,
  });

  useAutoSelectFirstOption({
    currentValue: eventDropdownId,
    enabled: !!eventMasterId,
    fieldName: "event_dropdown_id",
    options: eventDropdownOptions,
    setValue: setEventFilterValue,
  });

  // Reset both fields when branchIds changes (branchIds is not a form field, so handle manually)
  useMemo(() => {
    setEventFilterValue("event_master_id", null, { shouldDirty: true });
    setEventFilterValue("event_dropdown_id", null, { shouldDirty: true });
    clearErrors("event_master_id");
    clearErrors("event_dropdown_id");
  }, [branchIds]);

  // Reset event_dropdown_id when event_master_id changes using resetDependentFields
  const dependentFieldsMap: Partial<
    Record<keyof EventFilterFormValues, (keyof EventFilterFormValues)[]>
  > = {
    event_master_id: ["event_dropdown_id"],
  };

  useMemo(() => {
    resetDependentFields({
      clearErrors,
      dependentFieldsMap,
      dirtyFields,
      fieldName: "event_master_id",
      fieldValue: eventMasterId || null,
      setValue: setEventFilterValue,
    });
  }, [eventMasterId, branchIds]);

  return (
    <Stack gap="10px">
      <EventDropdownSummaryBreadcrumbs />
      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack direction="row" gap="10px" justifyContent="space-between">
            <Typography variant="subtitle1">
              {t("event.dropdown.summary.label")}
            </Typography>

            <Stack direction="row" gap="10px" alignItems="center">
              <Autocomplete<EventFilterFormValues>
                control={eventControl}
                name="event_master_id"
                options={filterEventOptions}
                placeholder={t("common.select.label", {
                  label: t("common.event.label"),
                })}
                clearIcon
                sx={{ width: "250px" }}
              />

              <Autocomplete<EventFilterFormValues>
                control={eventControl}
                name="event_dropdown_id"
                options={eventDropdownOptions}
                placeholder={t("common.select.label", {
                  label: t("common.event.dropdown"),
                })}
                clearIcon
                sx={{ width: "250px" }}
              />

              <DateFilterPeriodAutocomplete
                name="date_filter_period"
                control={dateControl}
                clearIcon
                sx={{ width: "160px" }}
              />

              <DatePicker
                control={dateControl}
                name="from_date"
                clearable={false}
                containerProps={{ width: "160px" }}
              />

              <DatePicker
                control={dateControl}
                name="to_date"
                minDate={fromDate ? DateTime.fromISO(fromDate) : DateTime.now()}
                clearable={false}
                containerProps={{ width: "160px" }}
              />
            </Stack>
          </Stack>
        </PadBox>
      </ContentBox>

      <ContentBox>
        <EventDropdownSummaryList
          eventMasterId={eventMasterId}
          eventDropdownId={eventDropdownId}
          fromDate={fromDate}
          toDate={toDate}
        />
      </ContentBox>
    </Stack>
  );
}
