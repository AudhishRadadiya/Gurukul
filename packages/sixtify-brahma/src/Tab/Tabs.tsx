import { Tabs as MuiTabs, Stack } from "@mui/material";
import type { TabOwnProps } from "@mui/material/Tab";
import Tab from "@mui/material/Tab";
import type { MouseEvent, ReactElement } from "react";
import { v4 as uuidv4 } from "uuid";
import { Tooltip } from "../Tooltip";
import { Skeleton } from "./Skeleton";

export type TabsItems = {
  value: string;
  label: string;
  icon?: ReactElement;
  toolTipLabel?: string;
  iconPosition?: TabOwnProps["iconPosition"];
  isView?: boolean;
  onClick: (e: MouseEvent) => void;
  onMouseDown?: (e: MouseEvent) => void;
};

type TabsProps = {
  tabs: TabsItems[];
  value: string;
  loading?: boolean;
};

export const Tabs = ({ tabs, value, loading }: TabsProps) => {
  if (loading) {
    return (
      <Stack gap="10px" direction="row">
        {tabs.map(() => {
          return <Skeleton key={uuidv4()} />;
        })}
      </Stack>
    );
  }

  return (
    <Stack>
      <MuiTabs value={value}>
        {tabs
          .filter(({ isView }) => isView !== false)
          .map(
            (
              { iconPosition = "end", toolTipLabel = "", icon, ...rest },
              index
            ) => (
              <Tab
                // eslint-disable-next-line sonarjs/no-array-index-key
                key={index}
                icon={
                  toolTipLabel ? (
                    <Tooltip toolTipLabel={toolTipLabel} placement="bottom">
                      {icon}
                    </Tooltip>
                  ) : (
                    icon
                  )
                }
                disabled={loading}
                iconPosition={iconPosition}
                {...rest}
              />
            )
          )}
      </MuiTabs>
    </Stack>
  );
};
