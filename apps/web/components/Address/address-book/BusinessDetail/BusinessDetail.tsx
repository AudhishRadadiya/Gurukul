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

import { BusinessDetailList } from "@web/components/Address/address-book/BusinessDetail/BusinessDetailList/BusinessDetailList";
import type { BusinessDetailColumnHideTypes } from "@web/components/Address/address-book/template/dialogs/hooks/templateTypes";
import { useGetDialogRenderer } from "@web/components/Address/address-book/template/dialogs/hooks/useGetDialogRenderer";
import {
  DEFAULT_ALL_TEMPLATE,
  DEFAULT_SELECTED_TEMPLATE,
  useGetLayoutList,
} from "@web/components/Address/address-book/template/dialogs/hooks/useGetLayoutList";

export const BusinessDetail = () => {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [columnHide, setColumnHide] = useState<BusinessDetailColumnHideTypes>({
    address: true,
    alternet_mobile_no: true,
    birthdate: true,
    business_name: true,
    contact_no: true,
    email: true,
    main_name: true,
    pan: true,
  });

  const [selectedTemplate, setSelectedTemplate] = useState<TabModel>();

  const [activeTab, setActiveTab] = useState(0);

  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const { data: businessListLayoutData, refetch } = useGetLayoutList({
    moduleName: "business_list",
  });

  const dialogRenderer = useGetDialogRenderer<BusinessDetailColumnHideTypes>({
    columnHide,
    moduleName: "business_list",
    onDialogClose,
    refetch,
    selectedTemplate,
    setActiveTab,
    setSelectedTemplate,
  });

  const tabItems = useMemo<TabModel[]>(() => {
    if (businessListLayoutData) {
      return businessListLayoutData.map(({ template_id, template_name }) => ({
        label: template_name,
        value: template_id,
      }));
    }

    return DEFAULT_ALL_TEMPLATE;
  }, [businessListLayoutData]);

  useMemo(() => {
    if (!selectedTemplate && tabItems.length) {
      setSelectedTemplate(tabItems[0]);
    }
  }, [tabItems, selectedTemplate]);

  useMemo(() => {
    if (!businessListLayoutData || !selectedTemplate) {
      return;
    }

    const { value } = selectedTemplate;

    const storeData = businessListLayoutData.find(
      ({ template_id }) => template_id === value
    );

    // TODO:Bhavik remove as letter
    const columnData = storeData?.columns as BusinessDetailColumnHideTypes;

    setColumnHide(columnData);
  }, [selectedTemplate, businessListLayoutData]);

  return (
    <>
      <Box>
        <TabBar
          tabs={tabItems}
          activeIndex={activeTab}
          addButton={
            <IconButton
              size="small"
              onClick={() => onDialogOpen("addTemplate")}
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

            if (businessListLayoutData?.length) {
              const { value } = tab;

              const activeTabIndex = businessListLayoutData.findIndex(
                ({ template_id }) => template_id === value
              );

              setActiveTab(activeTabIndex);
            }
          }}
        />
      </Box>

      <ContentBox>
        <BusinessDetailList
          columnHide={columnHide}
          setColumnHide={setColumnHide}
        />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
