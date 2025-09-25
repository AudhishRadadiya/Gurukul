import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { SvgAddRounded } from "../Svgs";
import { Tooltip } from "../Tooltip";

export type ProcessIconActionProps = IconButtonProps;

export const ProcessIconAction = (props: ProcessIconActionProps) => {
  return (
    <IconButton {...props}>
      <Tooltip toolTipLabel="Add">
        <SvgAddRounded />
      </Tooltip>
    </IconButton>
  );
};
