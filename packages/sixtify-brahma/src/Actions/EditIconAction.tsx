import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { SvgEdit } from "../Svgs/SvgEdit";
import { Tooltip } from "../Tooltip";

export type EditIconActionProps = IconButtonProps;

export const EditIconAction = (props: EditIconActionProps) => {
  return (
    <IconButton {...props}>
      <Tooltip toolTipLabel="Edit">
        <SvgEdit />
      </Tooltip>
    </IconButton>
  );
};
