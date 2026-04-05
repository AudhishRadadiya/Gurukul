import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { SvgFilteredList } from "../Svgs/SvgFilteredList";
import { SvgFilterList } from "../Svgs/SvgFilterList";
import { Tooltip } from "../Tooltip";

export type FilterIconActionProps = IconButtonProps & {
  isFiltered?: boolean;
};

export const FilterIconAction = ({
  isFiltered = false,
  ...props
}: FilterIconActionProps) => {
  return (
    <IconButton {...props} sx={{ padding: 0 }}>
      <Tooltip toolTipLabel="Filter">
        {isFiltered ? (
          <SvgFilteredList />
        ) : (
          <SvgFilterList disabled={props.disabled} />
        )}
      </Tooltip>
    </IconButton>
  );
};
