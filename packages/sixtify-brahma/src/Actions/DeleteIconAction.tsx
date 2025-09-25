import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { SvgDelete } from "../Svgs/SvgDelete";
import { Tooltip } from "../Tooltip";

export type DeleteIconActionProps = IconButtonProps;

export const DeleteIconAction = (props: DeleteIconActionProps) => {
  return (
    <IconButton {...props}>
      <Tooltip toolTipLabel="Delete">
        <SvgDelete />
      </Tooltip>
    </IconButton>
  );
};
