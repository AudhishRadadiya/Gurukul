import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { SvgColumn } from "../Svgs";
import { Tooltip } from "../Tooltip";

export type ColumnIconActionProps = IconButtonProps & {
  disabled?: boolean;
};

export const ColumnIconAction = (props: ColumnIconActionProps) => {
  return (
    <IconButton {...props} sx={{ padding: 0, height: "43px" }}>
      <Tooltip toolTipLabel="Column Chooser">
        <SvgColumn disabled={props.disabled} />
      </Tooltip>
    </IconButton>
  );
};
