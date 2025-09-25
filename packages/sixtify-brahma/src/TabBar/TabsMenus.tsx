import { Menu, MenuItem } from "@mui/material";
import type { TabModel } from "./Tab";

export type MenuProps = {
  label: string;
  disabled?: boolean;
  onClick: (tab: TabModel) => void;
};

export type TabsMenusProps = {
  tabs: TabModel[];
  menuAnchor: HTMLElement | null;
  activeTab: TabModel;
  onClose: () => void;
  onMenuItemClick: () => void;
};

export function TabsMenus({
  tabs,
  activeTab,
  menuAnchor,
  onClose,
  onMenuItemClick,
}: Readonly<TabsMenusProps>) {
  return (
    <>
      {tabs
        .filter((tab) => !!tab.menu)
        .map((tab) => (
          <Menu
            key={tab.value}
            anchorEl={menuAnchor}
            open={tab.value === activeTab.value && !!menuAnchor}
            onClose={onClose}
            id={`dropDownMenu-${tab.value}`}
            MenuListProps={{
              "aria-labelledby": `tabDropDown-${tab.value}`,
            }}
          >
            {tab.menu?.map((menuItem) => (
              <MenuItem
                onClick={() => {
                  onMenuItemClick();
                  menuItem.onClick(activeTab);
                }}
                key={menuItem.label}
                disabled={menuItem.disabled}
              >
                {menuItem.label}
              </MenuItem>
            ))}
          </Menu>
        ))}
    </>
  );
}
