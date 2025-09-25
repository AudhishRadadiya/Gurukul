import {
  Box,
  Stack,
  Tabs,
  tabsClasses,
  TabScrollButton,
  useTheme,
} from "@mui/material";
import type { MouseEvent, ReactNode, SyntheticEvent } from "react";
import { useEffect, useState } from "react";
import type { DialogTypes } from "../utils";
import type { TabModel } from "./Tab";
import { Tab } from "./Tab";
import { TabsMenus } from "./TabsMenus";

export type TabBarProps = {
  tabs: TabModel[];
  activeIndex?: number;
  ariaLabel?: string;
  addButton?: ReactNode;
  actionButton?: ReactNode;
  onChange?: (value: TabModel) => void;
  onAction?: (actionType: DialogTypes, tabData: TabModel) => void;
};

export function TabBar({
  tabs,
  onChange,
  addButton,
  actionButton,
  ariaLabel,
  activeIndex = 0,
  onAction,
}: Readonly<TabBarProps>) {
  const theme = useTheme();

  const [activeTab, setActiveTab] = useState<TabModel>(tabs[activeIndex]!);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const activeTabIndex = tabs.findIndex(
      (tab) => tab.value === activeTab.value
    );

    if (activeTabIndex === -1) {
      if (onChange && tabs[0]) {
        onChange(tabs[0]);
      }
      setActiveTab(tabs[0]!);
    }
  }, [tabs, activeTab, onChange]);

  useEffect(() => {
    setActiveTab(tabs[activeIndex]!);
  }, [activeIndex]);

  const tabChangeHandler = (
    _event: SyntheticEvent,
    newTabValue: number | string
  ) => {
    const newActiveTab = tabs.find((tab) => tab.value === newTabValue);

    if (newActiveTab) {
      setActiveTab(newActiveTab);

      // eslint-disable-next-line sonarjs/no-gratuitous-expressions
      if (onChange && newActiveTab) {
        onChange(newActiveTab);
      }
    }
  };

  return (
    <Box>
      <TabsMenus
        activeTab={activeTab}
        tabs={tabs}
        onClose={() => setAnchorEl(null)}
        onMenuItemClick={() => setAnchorEl(null)}
        menuAnchor={anchorEl}
      />

      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          borderBlockEnd: "solid 1px",
          borderColor: theme.palette.app.color.iron[700],
        }}
      >
        <Stack direction="row" gap="5px" alignItems="center" overflow="hidden">
          <Stack direction="row" overflow="hidden">
            <Tabs
              value={activeTab.value}
              onChange={tabChangeHandler}
              TabIndicatorProps={{
                sx: {
                  display: "none",
                },
              }}
              sx={{
                [`&.${tabsClasses.root}`]: {
                  minHeight: "40px",
                  height: "40px",
                },
              }}
              variant="scrollable"
              scrollButtons="auto"
              ScrollButtonComponent={TabScrollButton}
              aria-label={ariaLabel ?? "Tabs"}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={tab.value}
                  index={index}
                  activeTab={activeTab}
                  onArrowClick={(event: MouseEvent<SVGElement>) => {
                    setAnchorEl(event.target as HTMLElement);
                  }}
                  onAction={onAction}
                  menuAnchor={anchorEl}
                  {...tab}
                />
              ))}
            </Tabs>
          </Stack>
          {addButton}
        </Stack>

        <Stack
          direction="row"
          gap="10px"
          alignItems="center"
          justifyContent="space-between"
        >
          {actionButton}
        </Stack>
      </Stack>
    </Box>
  );
}
