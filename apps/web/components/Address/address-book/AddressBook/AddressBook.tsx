import type { DialogTypes, TabModel } from "@codezee/sixtify-brahma";
import {
  Button,
  ContentBox,
  TabBar,
  useDialogActions,
} from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, IconButton, useTheme } from "@mui/material";
import { t } from "i18next";
import { useMemo, useState } from "react";

import { AddressBookList } from "@web/components/Address/address-book/AddressBook/AddressBookList/AddressBookList";
import type { AddressBookColumnHideTypes } from "@web/components/Address/address-book/template/dialogs/hooks/templateTypes";
import { useGetDialogRenderer } from "@web/components/Address/address-book/template/dialogs/hooks/useGetDialogRenderer";
import {
  DEFAULT_ALL_TEMPLATE,
  DEFAULT_SELECTED_TEMPLATE,
  useGetLayoutList,
} from "@web/components/Address/address-book/template/dialogs/hooks/useGetLayoutList";

export type SelectedRecords = Record<string, boolean> | null;

export const AddressBook = () => {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [columnHide, setColumnHide] = useState<AddressBookColumnHideTypes>({
    address: true,
    address_type: true,
    adhar_no: true,
    alternet_mobile_no: true,
    anniversary_date: true,
    anniversary_day: true,
    b_note: true,
    bday: true,
    birth_date: true,
    blood_group: true,
    business_name: true,
    category1_name: true,
    category2_name: true,
    city: true,
    class_mate: true,
    contact_no: true,
    district: true,
    driving_licence_no: true,
    education_name: true,
    electors_number: true,
    family_member: true,
    first_name: true,
    g_no: true,
    gender: true,
    gurukul_name: true,
    hastak1_name: true,
    hastak2_name: true,
    is_past_student: true,
    is_vip: true,
    leave_in: true,
    medium: true,
    middle_name: true,
    note: true,
    pan_no: true,
    passport_no: true,
    patrika: true,
    pincode: true,
    saint_name: true,
    ssc_gurukul: true,
    ssc_year: true,
    surname: true,
    taluko: true,
    village: true,
    zone_name: true,
  });

  const [selectedTemplate, setSelectedTemplate] = useState<TabModel>();

  const [activeTab, setActiveTab] = useState(0);

  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const { data: addressBookListLayoutData, refetch } = useGetLayoutList({
    moduleName: "address_list",
  });

  const dialogRenderer = useGetDialogRenderer<AddressBookColumnHideTypes>({
    columnHide,
    moduleName: "address_list",
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

    // TODO:Bhavik remove as letter
    const columnData = storeData?.columns as AddressBookColumnHideTypes;

    setColumnHide(columnData);
  }, [selectedTemplate, addressBookListLayoutData]);

  return (
    <>
      <Box>
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
              disabled={selectedTemplate?.label === DEFAULT_SELECTED_TEMPLATE}
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
      </Box>

      <ContentBox>
        <AddressBookList
          columnHide={columnHide}
          setColumnHide={setColumnHide}
        />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
