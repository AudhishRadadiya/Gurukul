import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import type { TabProps as MuiTabProps } from "@mui/material";
import {
  Tab as MuiTabs,
  Stack,
  tabClasses,
  Typography,
  useTheme,
} from "@mui/material";
import _truncate from "lodash/truncate";
import type { MouseEvent } from "react";
import { ActionCell } from "../AgGrid";
import type { DialogTypes } from "../utils";
import type { MenuProps } from "./TabsMenus";

export type OnArrowClickFunction = (e: MouseEvent<SVGElement>) => void;

export type TabModel = {
  id?: string;
  label: string;
  value: string | number;
  hint?: string;
  showDot?: boolean;
  menu?: MenuProps[];
  trimLabel?: boolean;
  onAction?: (actionType: DialogTypes, tabData: TabModel) => void;
};

const TRIM_LABEL_LENGTH = 15;

export type TabProps = MuiTabProps &
  TabModel & {
    activeTab: TabModel;
    index: number;
    onArrowClick: OnArrowClickFunction;
    menuAnchor: HTMLElement | null;
  };

// eslint-disable-next-line sonarjs/cognitive-complexity
export function Tab({
  id,
  label,
  value,
  menu,
  trimLabel = true,
  activeTab,
  index,
  onArrowClick,
  menuAnchor,
  onAction,
  ...rest
}: TabProps) {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const isActive = value === activeTab.value;

  const fallbackTag = label.toLowerCase().replaceAll(/[ _]/g, "-");

  const trimmed = _truncate(label, {
    length: trimLabel ? TRIM_LABEL_LENGTH : label.length,
    omission: trimLabel ? "..." : "",
  });

  const labelText = isActive ? label : trimmed;

  const editTab = {
    title: "Edit",
    onClick: () => onAction && onAction("editTemplate", activeTab),
  };

  const deleteTab = {
    title: "Delete",
    onClick: () => onAction && onAction("deleteTemplate", activeTab),
  };

  const props: Record<string, unknown> = {
    key: id,
    iconPosition: "end",
    "data-cy": fallbackTag,
    "data-ptag": fallbackTag,
    value: value ?? index,
    label: (
      <Stack direction="row" gap="6px" alignItems="center">
        <Typography variant="body1" sx={{ whiteSpace: "nowrap" }}>
          {labelText}
        </Typography>

        {isActive && index > 0 && <ActionCell items={[editTab, deleteTab]} />}
      </Stack>
    ),
  };

  if (label.length > TRIM_LABEL_LENGTH && !isActive) {
    props.title = label;
  }

  if (value === activeTab.value && menu?.length) {
    props.icon = (
      <ArrowDropDownIcon
        onClick={onArrowClick}
        id={`tabDropDown-${value}`}
        aria-controls={
          menuAnchor !== null ? `dropDownMenu-${value}` : undefined
        }
        aria-expanded={menuAnchor !== null ? "true" : undefined}
        aria-haspopup="true"
        data-cy={`${fallbackTag}-arrowicon`}
        data-ptag={`${fallbackTag}-arrowicon`}
      />
    );
  }

  return (
    <MuiTabs
      disableFocusRipple
      disableRipple
      sx={{
        borderBottom: "2px solid",
        borderBottomColor: isActive ? butterflyBlue[900] : "white",
        overflow: "visible",
        [`&.${tabClasses.root}`]: {
          minHeight: "40px",
          height: "40px",
          paddingLeft: isActive && index > 0 ? "15px" : "10px",
        },
        "&:hover": {
          backgroundColor: butterflyBlue[500],
        },
      }}
      {...props}
      {...rest}
    />
  );
}
