import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { SvgConfigure } from "../Svgs";
import { Tooltip } from "../Tooltip";

export type ConfigureIconActionProps = IconButtonProps;

export const ConfigureIconAction = (props: ConfigureIconActionProps) => {
  return (
    <IconButton {...props}>
      <Tooltip toolTipLabel="Configure">
        <SvgConfigure />
      </Tooltip>
    </IconButton>
  );
};
