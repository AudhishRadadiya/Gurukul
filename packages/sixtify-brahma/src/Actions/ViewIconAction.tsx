import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { SvgView } from "../Svgs";
import { Tooltip } from "../Tooltip";

export type ViewIconActionProps = IconButtonProps & {
  disabled?: boolean;
};

export const ViewIconAction = (props: ViewIconActionProps) => {
  return (
    <IconButton {...props}>
      <Tooltip toolTipLabel="View">
        <SvgView disabled={props.disabled} />
      </Tooltip>
    </IconButton>
  );
};
