import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { SvgDownload } from "../Svgs";
import { Tooltip } from "../Tooltip";

export type DownloadIconActionProps = IconButtonProps;

export const DownloadIconAction = (props: DownloadIconActionProps) => {
  return (
    // TODO: Need to add margin top to set the UI in sync with the design
    <IconButton {...props}>
      <Tooltip toolTipLabel="Download">
        <SvgDownload />
      </Tooltip>
    </IconButton>
  );
};
