import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { SvgImport } from "../Svgs";
import { Tooltip } from "../Tooltip";

export type ImportIconActionProps = IconButtonProps;

export const ImportIconAction = (props: ImportIconActionProps) => {
  return (
    <IconButton {...props} sx={{ padding: 0 }}>
      <Tooltip toolTipLabel="Import">
        <SvgImport />
      </Tooltip>
    </IconButton>
  );
};
