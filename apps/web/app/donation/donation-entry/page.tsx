"use client";

import type { DialogTypes, TabModel } from "@codezee/sixtify-brahma";
import {
  Button,
  ContentBox,
  PadBox,
  TabBar,
  useDialogActions,
} from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { IconButton, Stack, useTheme } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useMemo, useState, type ReactNode } from "react";

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
import { AddDonationEntry } from "@web/components/Donation/donationEntry/addDonationEntry/AddDonationEntry";
import { DonationEntryBreadcrumbs } from "@web/components/Donation/donationEntry/DonationEntryBreadcrumbs";
import { DonationEntryList } from "@web/components/Donation/donationEntry/donationEntryList/DonationEntryList";
import {
  DonationEntryColumnHideDefaultValue,
  type DonationEntryColumnHideTypes,
} from "@web/components/Donation/donationEntry/donationEntryList/hooks/templateTypes";
import { DONATION_ENTRY_PERMISSION } from "@web/constants/permission/donation/donationEntry/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";

type DonationEntryPageType = keyof typeof donationEntryPage;

const queryPageEmus = [ADD_DONATION_ENTRY, LIST_DONATION_ENTRY] as const;

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const theme = useTheme();

  const router = useRouter();

  const { validateAccess } = useUserPermissions();

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

  const DonationEntryPageRenderer: Record<DonationEntryPageType, ReactNode> = {
    [ADD_DONATION_ENTRY]: <AddDonationEntry />,
    [LIST_DONATION_ENTRY]: (
      <DonationEntryList
        columnHide={columnHide}
        setColumnHide={setColumnHide}
        isDonationEntryList={isDonationEntryList}
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
    <>
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

        <ContentBox>
          {isDonationEntryList ? (
            DonationEntryPageRenderer[LIST_DONATION_ENTRY]
          ) : (
            <PadBox padding={{ padding: "15px" }}>
              {DonationEntryPageRenderer[queryPage]}
            </PadBox>
          )}
        </ContentBox>
      </Stack>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
