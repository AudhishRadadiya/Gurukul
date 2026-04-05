import { IconButton, type IconButtonProps } from "@mui/material";
import { SvgDownload } from "../../Svgs";
import { Tooltip } from "../../Tooltip";

export const DownloadAction = (props: IconButtonProps) => {
  return (
    <IconButton
      sx={{
        height: "30px",
        width: "50px",
      }}
      {...props}
    >
      <Tooltip toolTipLabel="Download">
        <SvgDownload fontColor="black" fill="none" />
      </Tooltip>
    </IconButton>
  );
};
