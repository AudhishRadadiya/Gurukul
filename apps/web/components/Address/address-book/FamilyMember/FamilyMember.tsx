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

import { FamilyMemberList } from "@web/components/Address/address-book/FamilyMember/FamilyMemberList/FamilyMemberList";
import type { FamilyMemberColumnHideTypes } from "@web/components/Address/address-book/template/dialogs/hooks/templateTypes";
import { useGetDialogRenderer } from "@web/components/Address/address-book/template/dialogs/hooks/useGetDialogRenderer";
import {
  DEFAULT_ALL_TEMPLATE,
  DEFAULT_SELECTED_TEMPLATE,
  useGetLayoutList,
} from "@web/components/Address/address-book/template/dialogs/hooks/useGetLayoutList";

export const FamilyMember = () => {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [columnHide, setColumnHide] = useState<FamilyMemberColumnHideTypes>({
    age: true,
    alternet_mobile_no: true,
    birth_day_month: true,
    birthdate: true,
    contact_no: true,
    main_member_name: true,
    name: true,
    relation: true,
    remark: true,
  });

  const [selectedTemplate, setSelectedTemplate] = useState<TabModel>();

  const [activeTab, setActiveTab] = useState(0);

  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const { data: familyMemberListLayoutData, refetch } = useGetLayoutList({
    moduleName: "family_member_list",
  });

  const dialogRenderer = useGetDialogRenderer<FamilyMemberColumnHideTypes>({
    columnHide,
    moduleName: "family_member_list",
    onDialogClose,
    refetch,
    selectedTemplate,
    setActiveTab,
    setSelectedTemplate,
  });

  const tabItems = useMemo<TabModel[]>(() => {
    if (familyMemberListLayoutData) {
      return familyMemberListLayoutData.map(
        ({ template_id, template_name }) => ({
          label: template_name,
          value: template_id,
        })
      );
    }

    return DEFAULT_ALL_TEMPLATE;
  }, [familyMemberListLayoutData]);

  useMemo(() => {
    if (!selectedTemplate && tabItems.length) {
      setSelectedTemplate(tabItems[0]);
    }
  }, [tabItems, selectedTemplate]);

  useMemo(() => {
    if (!familyMemberListLayoutData || !selectedTemplate) {
      return;
    }

    const { value } = selectedTemplate;

    const storeData = familyMemberListLayoutData.find(
      ({ template_id }) => template_id === value
    );

    // TODO:Bhavik remove as letter
    const columnData = storeData?.columns as FamilyMemberColumnHideTypes;

    setColumnHide(columnData);
  }, [selectedTemplate, familyMemberListLayoutData]);

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

            if (familyMemberListLayoutData?.length) {
              const { value } = tab;

              const activeTabIndex = familyMemberListLayoutData.findIndex(
                ({ template_id }) => template_id === value
              );

              setActiveTab(activeTabIndex);
            }
          }}
        />
      </Box>

      <ContentBox>
        <FamilyMemberList
          columnHide={columnHide}
          setColumnHide={setColumnHide}
        />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
