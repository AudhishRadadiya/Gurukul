import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { DownloadSvg } from "../Svgs";
import { Tooltip } from "../Tooltip";

export type DownloadPrintActionProps = IconButtonProps & {
  disabled?: boolean;
};

export const DownloadPrintAction = (props: DownloadPrintActionProps) => {
  return (
    <IconButton {...props}>
      <Tooltip toolTipLabel="Download">
        <DownloadSvg disabled={props.disabled} />
      </Tooltip>
    </IconButton>
  );
};
