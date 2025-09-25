import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { SvgFilterList } from "../Svgs/SvgFilterList";
import { Tooltip } from "../Tooltip";

export type FilterIconActionProps = IconButtonProps;

export const FilterIconAction = (props: FilterIconActionProps) => {
  return (
    <IconButton {...props} sx={{ padding: 0 }}>
      <Tooltip toolTipLabel="Filter">
        <SvgFilterList />
      </Tooltip>
    </IconButton>
  );
};
