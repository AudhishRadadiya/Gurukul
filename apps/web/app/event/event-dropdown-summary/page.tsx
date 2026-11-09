"use client";

import {
  Autocomplete,
  ContentBox,
  DateRangePickerField,
  PadBox,
  SearchField,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import type { ChangeEvent } from "react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";

import { useGetEventDropdownOptions } from "@web/components/common/Autocomplete/hooks/useGetEventDropdownOptions";
import { useGetFilterEventOptionsFromMultipleBranch } from "@web/components/common/Autocomplete/hooks/useGetFilterEventOptionsFromMultipleBranch";
import { ONE_MONTH } from "@web/components/common/hooks/constant";
import { EventDropdownSummaryList } from "@web/components/Event/eventDropdownSummary/eventDropdownSummaryList/EventDropdownSummaryList";
import { useBranch } from "@web/context/BranchContext";
import { useSavedFiltersHandler } from "@web/hooks/savedFilters/hooks/useSavedFiltersHandler";
import { SaveFiltersCheckbox } from "@web/hooks/savedFilters/SaveFiltersCheckbox";
import { useAutoSelectFirstOption } from "@web/hooks/useAutoSelectFirstOption";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { Debounce_Delay, resetDependentFields } from "@web/utils/helper";

type EventFilterFormValues = {
  event_dropdown_id: string | null;
  event_id: string | null;
  is_save_filter: boolean;
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { isMobile } = useGetDeviceType();

  const {
    control: dateControl,
    dateRange,
    search,
    setValue: setDateValue,
  } = useDateFilters(ONE_MONTH);

  const [searchInput] = useDebounceValue(search, Debounce_Delay);

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
      event_id: null,
      is_save_filter: false,
    },
  });

  const eventId = watchEventFilter("event_id") ?? "";

  const eventDropdownId = watchEventFilter("event_dropdown_id");

  const { data: filterEventOptions } =
    useGetFilterEventOptionsFromMultipleBranch({
      branchIds: [branchIds],
      for_dropdown: true,
    });

  const { data: eventDropdownOptions } = useGetEventDropdownOptions({
    eventId,
  });

  useAutoSelectFirstOption({
    currentValue: eventId,
    enabled: !!branchIds,
    fieldName: "event_id",
    options: filterEventOptions,
    setValue: setEventFilterValue,
  });

  useAutoSelectFirstOption({
    currentValue: eventDropdownId,
    enabled: !!eventId,
    fieldName: "event_dropdown_id",
    options: eventDropdownOptions,
    setValue: setEventFilterValue,
  });

  // Reset both fields when branchIds changes (branchIds is not a form field, so handle manually)
  useMemo(() => {
    setEventFilterValue("event_id", null, { shouldDirty: true });
    setEventFilterValue("event_dropdown_id", null, { shouldDirty: true });
    clearErrors("event_id");
    clearErrors("event_dropdown_id");
  }, [branchIds]);

  // Reset event_dropdown_id when event_master_id changes using resetDependentFields
  const dependentFieldsMap: Partial<
    Record<keyof EventFilterFormValues, (keyof EventFilterFormValues)[]>
  > = {
    event_id: ["event_dropdown_id"],
  };

  useMemo(() => {
    resetDependentFields({
      clearErrors,
      dependentFieldsMap,
      dirtyFields,
      fieldName: "event_id",
      fieldValue: eventId || null,
      setValue: setEventFilterValue,
    });
  }, [eventId, branchIds]);

  const {
    filters,
    isFetchingSavedFilters,
    isPendingSaveFilters,
    isSaveFilter,
    saveFiltersAction,
  } = useSavedFiltersHandler({
    moduleKey: "event",
  });

  const handleSaveFilters = (checked: boolean) => {
    const payload = checked
      ? {
          from_date: dateRange[0],
          to_date: dateRange[1],
          ...(eventId && { event_id: [eventId] }),
          ...(eventDropdownId && { event_dropdown_id: eventDropdownId }),
        }
      : {};

    saveFiltersAction({
      filters: payload,
      is_save_filter: checked,
    });
  };

  const onSaveFiltersChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    setEventFilterValue("is_save_filter", checked);

    handleSaveFilters(checked);
  };

  useMemo(() => {
    if (!_isEmpty(filters)) {
      const { event_dropdown_id, event_id, from_date, to_date } =
        filters as Record<string, string>;

      setEventFilterValue("is_save_filter", isSaveFilter);

      if (from_date && to_date) {
        setDateValue("date_range", [from_date, to_date]);
      }

      if (event_id && Array.isArray(event_id)) {
        setEventFilterValue("event_id", event_id[0]);
      }

      if (event_dropdown_id) {
        setEventFilterValue("event_dropdown_id", event_dropdown_id);
      }
    }
  }, [filters]);

  return (
    <Stack gap={{ md: "10px", xs: "8px" }}>
      <ContentBox>
        <PadBox padding={{ padding: { md: "10px", xs: "8px 10px" } }}>
          <Stack
            direction={{ md: "row", xs: "column" }}
            gap={3}
            justifyContent="space-between"
            alignItems={{ md: "center", xs: "stretch" }}
          >
            <Typography
              variant="subtitle1"
              fontSize={isMobile ? "16px" : "18px"}
              whiteSpace="nowrap"
            >
              {t("form.options.summary.label")}
            </Typography>

            <Stack
              direction="row"
              gap={1.25}
              alignItems="center"
              flexWrap="wrap"
              justifyContent={{ md: "flex-end", xs: "flex-start" }}
              sx={{ minWidth: 0, width: { md: "auto", xs: "100%" } }}
            >
              <Box sx={{ flexShrink: 0 }}>
                <SaveFiltersCheckbox
                  name="is_save_filter"
                  control={eventControl}
                  disabled={isFetchingSavedFilters || isPendingSaveFilters}
                  onChange={onSaveFiltersChange}
                />
              </Box>

              <Box
                sx={{
                  flex: { md: "0 0 220px", xs: "1 1 100%" },
                  minWidth: 0,
                  width: { md: "auto", xs: "100%" },
                }}
              >
                <Autocomplete<EventFilterFormValues>
                  control={eventControl}
                  name="event_id"
                  options={filterEventOptions}
                  placeholder={t("common.select.label", {
                    label: t("common.event.label"),
                  })}
                  clearIcon
                  sx={{ minWidth: 0, width: "100%" }}
                />
              </Box>

              <Box
                sx={{
                  flex: { md: "0 0 220px", xs: "1 1 100%" },
                  minWidth: 0,
                  width: { md: "auto", xs: "100%" },
                }}
              >
                <Autocomplete<EventFilterFormValues>
                  control={eventControl}
                  name="event_dropdown_id"
                  options={eventDropdownOptions}
                  placeholder={t("common.select.label", {
                    label: t("common.form.options.label"),
                  })}
                  clearIcon
                  sx={{ minWidth: 0, width: "100%" }}
                />
              </Box>

              <Box
                sx={{
                  flex: { md: "0 0 220px", xs: "1 1 100%" },
                  minWidth: 0,
                  width: { md: "auto", xs: "100%" },
                }}
              >
                <SearchField
                  name="search"
                  characterType="any-character"
                  letterCase="mixed"
                  control={dateControl}
                  containerProps={{ width: "100%" }}
                />
              </Box>

              <Box
                sx={{
                  flex: { md: "0 0 auto", xs: "1 1 100%" },
                  minWidth: 0,
                  width: { md: "auto", xs: "100%" },
                }}
              >
                <DateRangePickerField
                  name="date_range"
                  control={dateControl}
                  showPresets
                  size={isMobile ? "small" : "large"}
                  placeholder="Select Date Range"
                />
              </Box>
            </Stack>
          </Stack>
        </PadBox>
      </ContentBox>

      <ContentBox>
        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <EventDropdownSummaryList
            eventId={eventId}
            eventDropdownId={eventDropdownId}
            externalFilter={{
              from_date: dateRange[0],
              to_date: dateRange[1],
            }}
            search={searchInput}
          />
        </Box>
      </ContentBox>
    </Stack>
  );
}
