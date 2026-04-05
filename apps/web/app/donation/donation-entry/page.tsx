"use client";

import type { DialogTypes, TabModel } from "@codezee/sixtify-brahma";
import {
  Button,
  ContentBox,
  DatePicker,
  PadBox,
  TabBar,
  useDialogActions,
} from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { IconButton, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { ArrowLeft } from "iconoir-react";
import { DateTime } from "luxon";
import { useRouter, useSearchParams } from "next/navigation";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

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
import { DateFilterPeriodAutocomplete } from "@web/components/common/Autocomplete/DateFilterPeriodAutocomplete";
import type { Status } from "@web/components/common/Autocomplete/hooks/useGetStatusOptions";
import { ALL, CUSTOM, SEVEN_DAYS } from "@web/components/common/hooks/constant";
import { AddDonationEntry } from "@web/components/Donation/donationEntry/addDonationEntry/AddDonationEntry";
import { DonationEntryBreadcrumbs } from "@web/components/Donation/donationEntry/DonationEntryBreadcrumbs";
import { DonationEntryList } from "@web/components/Donation/donationEntry/donationEntryList/DonationEntryList";
import {
  DonationEntryColumnHideDefaultValue,
  type DonationEntryColumnHideTypes,
} from "@web/components/Donation/donationEntry/donationEntryList/hooks/templateTypes";
import { DONATION_ENTRY_PERMISSION } from "@web/constants/permission/donation/donationEntry/permission";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";

type DonationEntryPageType = keyof typeof donationEntryPage;

const queryPageEmus = [ADD_DONATION_ENTRY, LIST_DONATION_ENTRY] as const;

export type DonationEntryValues = {
  is_active: Status;
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const theme = useTheme();

  const router = useRouter();

  const { validateAccess } = useUserPermissions();

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
    parseAsStringLiteral(queryPageEmus).withDefault(LIST_DONATION_ENTRY)
  );

  const isDonationEntryList = queryPage === LIST_DONATION_ENTRY;

  const searchParams = useSearchParams();

  const {
    control: dateControl,
    fromDate,
    setValue: setDateValue,
    toDate,
  } = useDateFilters();

  useEffect(() => {
    const urlFromDate = searchParams.get("from_date");

    const urlToDate = searchParams.get("to_date");

    if (urlFromDate && urlToDate) {
      setDateValue("date_filter_period", CUSTOM);
      setDateValue("from_date", urlFromDate);
      setDateValue("to_date", urlToDate);
    } else {
      setDateValue("date_filter_period", SEVEN_DAYS);
    }
  }, [searchParams]);

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

  const DonationEntryPageRenderer: Record<DonationEntryPageType, ReactNode> = {
    [ADD_DONATION_ENTRY]: <AddDonationEntry />,
    [LIST_DONATION_ENTRY]: (
      <DonationEntryList
        columnHide={columnHide}
        setColumnHide={setColumnHide}
        isDonationEntryList={isDonationEntryList}
        externalDateFilter={{
          from_date: fromDate,
          to_date: toDate,
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
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <DonationEntryBreadcrumbs queryPage={queryPage} />

          <PermissionGuard
            canAccess={validateAccess(DONATION_ENTRY_PERMISSION.CREATE)}
          >
            {isDonationEntryList && (
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => {
                  router.push(
                    "/donation/donation-entry?page=add-donation-entry"
                  );
                }}
              >
                {t("common.button.add", {
                  label: t("donation.entry.label"),
                })}
              </Button>
            )}
          </PermissionGuard>
        </Stack>

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
              <Stack direction="row" gap="10px" justifyContent="space-between">
                <Typography variant="subtitle1">
                  {t("donation.entry.label")}
                </Typography>

                <Stack direction="row" gap="10px" alignItems="center">
                  {hasSummaryParams && (
                    <Button
                      variant="outlined"
                      startIcon={<ArrowLeft width={20} height={20} />}
                      onClick={handleBackToSummary}
                    >
                      Back
                    </Button>
                  )}

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
                    minDate={
                      fromDate ? DateTime.fromISO(fromDate) : DateTime.now()
                    }
                    clearable={false}
                    containerProps={{ width: "160px" }}
                  />
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
