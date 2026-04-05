import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { SvgExport } from "../Svgs";
import { Tooltip } from "../Tooltip";

export type ExportIconActionProps = IconButtonProps & {
  disabled?: boolean;
};

export const ExportIconAction = (props: ExportIconActionProps) => {
  return (
    <IconButton {...props} sx={{ padding: 0 }}>
      <Tooltip toolTipLabel="Export">
        <SvgExport disabled={props.disabled} />
      </Tooltip>
    </IconButton>
  );
};
