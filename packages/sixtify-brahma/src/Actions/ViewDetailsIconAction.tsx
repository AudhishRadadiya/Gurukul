import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { ArrowUpRight } from "../Svgs";
import { Tooltip } from "../Tooltip";

export type ViewDetailsIconActionProps = IconButtonProps & {
  disabled?: boolean;
};

export const ViewDetailsIconAction = (props: ViewDetailsIconActionProps) => {
  return (
    <IconButton {...props}>
      <Tooltip toolTipLabel="View Details">
        <ArrowUpRight disabled={props.disabled} />
      </Tooltip>
    </IconButton>
  );
};
