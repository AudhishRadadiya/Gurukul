import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { SvgDownload } from "../Svgs";
import { Tooltip } from "../Tooltip";

export type DownloadIconActionProps = IconButtonProps & {
  disabled?: boolean;
};

export const DownloadIconAction = (props: DownloadIconActionProps) => {
  return (
    // TODO: Need to add margin top to set the UI in sync with the design
    <IconButton {...props}>
      <Tooltip toolTipLabel="Download">
        <SvgDownload disabled={props.disabled} />
      </Tooltip>
    </IconButton>
  );
};
