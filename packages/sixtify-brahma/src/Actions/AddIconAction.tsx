import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { SvgAdd } from "../Svgs";
import { Tooltip } from "../Tooltip";

export type AddIconActionProps = IconButtonProps;

export const AddIconAction = (props: AddIconActionProps) => {
  return (
    <IconButton {...props}>
      <Tooltip toolTipLabel="Add">
        <SvgAdd />
      </Tooltip>
    </IconButton>
  );
};
