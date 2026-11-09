"use client";

import type { DialogTypes, TabModel } from "@codezee/sixtify-brahma";
import {
  Button,
  ContentBox,
  DateRangePickerField,
  PadBox,
  SearchField,
  TabBar,
  useDialogActions,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { ArrowLeft } from "iconoir-react";
import _isEmpty from "lodash/isEmpty";
import { useRouter, useSearchParams } from "next/navigation";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import type { ChangeEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";

import type { donationEntryPage } from "@web/app/donation/donation-entry/hooks/constant";
import {
  ADD_DONATION_ENTRY,
  LIST_DONATION_ENTRY,
} from "@web/app/donation/donation-entry/hooks/constant";
import { useGetDialogRenderer } from "@web/components/Address/address-book/template/dialogs/hooks/useGetDialogRenderer";
import {
  DEFAULT_ALL_TEMPLATE,
  DEFAULT_SELECTED_TEMPLATE,
  useGetLayoutList,
} from "@web/components/Address/address-book/template/dialogs/hooks/useGetLayoutList";
import type { Status } from "@web/components/common/Autocomplete/hooks/useGetStatusOptions";
import { ALL, CUSTOM, SEVEN_DAYS } from "@web/components/common/hooks/constant";
import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddDonationEntry } from "@web/components/Donation/donationEntry/addDonationEntry/AddDonationEntry";
import { DonationEntryList } from "@web/components/Donation/donationEntry/donationEntryList/DonationEntryList";
import {
  DonationEntryColumnHideDefaultValue,
  type DonationEntryColumnHideTypes,
} from "@web/components/Donation/donationEntry/donationEntryList/hooks/templateTypes";
import { DONATION_ENTRY_PERMISSION } from "@web/constants/permission/donation/donationEntry/permission";
import { useSavedFiltersHandler } from "@web/hooks/savedFilters/hooks/useSavedFiltersHandler";
import { SaveFiltersCheckbox } from "@web/hooks/savedFilters/SaveFiltersCheckbox";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { Debounce_Delay } from "@web/utils/helper";

type DonationEntryPageType = keyof typeof donationEntryPage;

export const donationEntryQueryPageEmus = [
  ADD_DONATION_ENTRY,
  LIST_DONATION_ENTRY,
] as const;

export type DonationEntryValues = {
  is_active: Status;
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const theme = useTheme();

  const router = useRouter();

  const { layout } = useGetDeviceType();

  const isMobile = layout === "mobile";

  const { validateAccess } = useUserPermissions();

  const [filterListData, setFilterListData] = useState<FieldValues>({
    branch_id: [""],
  });

  const formMethods = useForm<DonationEntryValues>({
    defaultValues: {
      is_active: ALL,
    },
  });

  const { butterflyBlue } = theme.palette.app.color;

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [activeTab, setActiveTab] = useState(0);

  const [selectedTemplate, setSelectedTemplate] = useState<TabModel>();

  const [columnHide, setColumnHide] = useState<DonationEntryColumnHideTypes>(
    DonationEntryColumnHideDefaultValue
  );

  const [queryPage] = useQueryState(
    "page",
    parseAsStringLiteral(donationEntryQueryPageEmus).withDefault(
      LIST_DONATION_ENTRY
    )
  );

  const isDonationEntryList = queryPage === LIST_DONATION_ENTRY;

  const searchParams = useSearchParams();

  const {
    control: dateControl,
    dateRange,
    search,
    setValue: setDateValue,
  } = useDateFilters();

  const [searchInput] = useDebounceValue(search, Debounce_Delay);

  useEffect(() => {
    const urlFromDate = searchParams.get("from_date");

    const urlToDate = searchParams.get("to_date");

    if (urlFromDate && urlToDate) {
      setDateValue("date_filter_period", CUSTOM);
      setDateValue("date_range", [urlFromDate, urlToDate]);
    } else {
      setDateValue("date_filter_period", SEVEN_DAYS);
    }
  }, [searchParams, setDateValue]);

  // Check if we came from donation summary (has contact_no, from_date, to_date params)
  const hasSummaryParams = useMemo(() => {
    const contactNo = searchParams.get("contact_no");

    const urlFromDate = searchParams.get("from_date");

    const urlToDate = searchParams.get("to_date");

    return !!(contactNo && urlFromDate && urlToDate);
  }, [searchParams]);

  const handleBackToSummary = () => {
    if (hasSummaryParams) {
      router.push("/donation/donation-summary");
    }
  };

  const {
    control: saveFiltersControl,
    setValue: setSaveFiltersValue,
    watch,
  } = useForm({
    defaultValues: {
      is_save_filter: false,
    },
  });

  const {
    filters,
    isFetchingSavedFilters,
    isPendingSaveFilters,
    isSaveFilter,
    saveFiltersAction,
  } = useSavedFiltersHandler({
    moduleKey: "donation",
  });

  const is_save_filter = watch("is_save_filter");

  const handleSaveFilters = (filtersData: FieldValues, checked: boolean) => {
    const payload = checked
      ? {
          ...filtersData,
          from_date: dateRange[0],
          to_date: dateRange[1],
        }
      : {};

    saveFiltersAction({
      filters: payload,
      is_save_filter: checked,
    });
  };

  const onSaveFiltersChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    setSaveFiltersValue("is_save_filter", checked);

    handleSaveFilters(filterListData, checked);
  };

  useMemo(() => {
    if (!_isEmpty(filters)) {
      const { from_date, to_date, ...rest } = filters as Record<string, string>;

      setSaveFiltersValue("is_save_filter", isSaveFilter);

      if (from_date && to_date) {
        setDateValue("date_range", [from_date, to_date]);
      }

      if (!_isEmpty(rest)) {
        setFilterListData(rest);
      }
    }
  }, [filters]);

  const handleApplyFilter = (data: FieldValues) => {
    setFilterListData(data);

    if (is_save_filter) {
      handleSaveFilters(data, is_save_filter);
    }
  };

  const DonationEntryPageRenderer: Record<DonationEntryPageType, ReactNode> = {
    [ADD_DONATION_ENTRY]: <AddDonationEntry />,
    [LIST_DONATION_ENTRY]: (
      <DonationEntryList
        columnHide={columnHide}
        filterListData={filterListData}
        setFilterListData={setFilterListData}
        handleApplyFilter={handleApplyFilter}
        setColumnHide={setColumnHide}
        isDonationEntryList={isDonationEntryList}
        search={searchInput}
        externalDateFilter={{
          from_date: dateRange[0],
          to_date: dateRange[1],
        }}
      />
    ),
  };

  const { data: addressBookListLayoutData, refetch } = useGetLayoutList({
    moduleName: "donation_list",
  });

  const dialogRenderer = useGetDialogRenderer<DonationEntryColumnHideTypes>({
    columnHide,
    moduleName: "donation_list",
    onDialogClose,
    refetch,
    selectedTemplate,
    setActiveTab,
    setSelectedTemplate,
  });

  const tabItems = useMemo<TabModel[]>(() => {
    if (addressBookListLayoutData) {
      return addressBookListLayoutData.map(
        ({ template_id, template_name }) => ({
          label: template_name,
          value: template_id,
        })
      );
    }

    return DEFAULT_ALL_TEMPLATE;
  }, [addressBookListLayoutData]);

  useMemo(() => {
    if (!selectedTemplate && tabItems.length) {
      setSelectedTemplate(tabItems[0]);
    }
  }, [tabItems, selectedTemplate]);

  useMemo(() => {
    if (!addressBookListLayoutData || !selectedTemplate) {
      return;
    }

    const { value } = selectedTemplate;

    const storeData = addressBookListLayoutData.find(
      ({ template_id }) => template_id === value
    );

    // TODO:Audhish remove as later
    const columnData = storeData?.columns as DonationEntryColumnHideTypes;

    setColumnHide(columnData);
  }, [selectedTemplate, addressBookListLayoutData]);

  return (
    <FormProvider {...formMethods}>
      <Stack gap="10px">
        {isDonationEntryList && (
          <ContentBox>
            <TabBar
              tabs={tabItems}
              activeIndex={activeTab}
              addButton={
                <IconButton
                  size="small"
                  onClick={() => {
                    onDialogOpen("addTemplate");
                  }}
                >
                  <Add htmlColor={butterflyBlue[900]} />
                </IconButton>
              }
              actionButton={
                <Button
                  onClick={() => {
                    onDialogOpen("saveTemplate");
                  }}
                  size="small"
                  variant="text"
                  disabled={
                    selectedTemplate?.label === DEFAULT_SELECTED_TEMPLATE
                  }
                >
                  {t("common.save.button")}
                </Button>
              }
              onAction={(actionType: DialogTypes) => {
                onDialogOpen(actionType);
              }}
              onChange={(tab) => {
                setSelectedTemplate(tab);

                if (addressBookListLayoutData?.length) {
                  const { value } = tab;

                  const activeTabIndex = addressBookListLayoutData.findIndex(
                    ({ template_id }) => template_id === value
                  );

                  setActiveTab(activeTabIndex);
                }
              }}
            />
          </ContentBox>
        )}

        {isDonationEntryList && (
          <ContentBox>
            <PadBox padding={{ padding: "10px" }}>
              <Stack
                direction={{ md: "row", xs: "column" }}
                gap="10px"
                justifyContent="space-between"
                alignItems={{ md: "center", xs: "stretch" }}
              >
                <Typography variant="subtitle1">
                  {t("donation.entry.label")}
                </Typography>

                <Stack
                  direction="row"
                  gap="10px"
                  alignItems="center"
                  flexWrap="wrap"
                  justifyContent={{ md: "flex-end", xs: "flex-start" }}
                  sx={{
                    minWidth: 0,
                    width: { md: "auto", xs: "100%" },
                  }}
                >
                  {hasSummaryParams && (
                    <Button
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                      startIcon={<ArrowLeft width={20} height={20} />}
                      onClick={handleBackToSummary}
                      sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
                    >
                      Back
                    </Button>
                  )}

                  <SaveFiltersCheckbox
                    name="is_save_filter"
                    control={saveFiltersControl}
                    disabled={isFetchingSavedFilters || isPendingSaveFilters}
                    onChange={onSaveFiltersChange}
                  />

                  <SearchField
                    name="search"
                    characterType="any-character"
                    letterCase="mixed"
                    control={dateControl}
                    containerProps={{
                      flex: { md: "0 0 auto", xs: "1 1 160px" },
                      maxWidth: { md: "none", xs: "100%" },
                      minWidth: { md: "auto", xs: "140px" },
                      width: { md: "auto", xs: "100%" },
                    }}
                  />

                  <Box
                    sx={{
                      flex: { md: "0 0 auto", xs: "1 1 200px" },
                      maxWidth: { md: "none", xs: "100%" },
                      minWidth: { md: "auto", xs: 0 },
                      width: { md: "auto", xs: "100%" },
                    }}
                  >
                    <DateRangePickerField
                      name="date_range"
                      control={dateControl}
                      showPresets
                      size={isMobile ? "small" : "medium"}
                      placeholder="Select Date Range"
                    />
                  </Box>

                  <PermissionGuard
                    canAccess={validateAccess(DONATION_ENTRY_PERMISSION.CREATE)}
                  >
                    {isDonationEntryList && (
                      <ButtonLayoutProvider
                        size={isMobile ? "small" : "medium"}
                        onClick={() => {
                          router.push(
                            "/donation/donation-entry?page=add-donation-entry"
                          );
                        }}
                        label={t("common.button.add", {
                          label: t("donation.entry.label"),
                        })}
                        sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
                      />
                    )}
                  </PermissionGuard>
                </Stack>
              </Stack>
            </PadBox>
          </ContentBox>
        )}

        <ContentBox>
          {isDonationEntryList
            ? DonationEntryPageRenderer[LIST_DONATION_ENTRY]
            : DonationEntryPageRenderer[queryPage]}
        </ContentBox>
      </Stack>

      {openedDialog && dialogRenderer[openedDialog]}
    </FormProvider>
  );
}
