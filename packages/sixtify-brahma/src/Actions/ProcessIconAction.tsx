import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { SvgAddRounded } from "../Svgs";
import { Tooltip } from "../Tooltip";

export type ProcessIconActionProps = IconButtonProps & {
  disabled?: boolean;
};

export const ProcessIconAction = (props: ProcessIconActionProps) => {
  return (
    <IconButton {...props}>
      <Tooltip toolTipLabel="Add">
        <SvgAddRounded disabled={props.disabled} />
      </Tooltip>
    </IconButton>
  );
};
