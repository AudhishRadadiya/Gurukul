import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { SvgHistory } from "../Svgs/SvgHistory";
import { Tooltip } from "../Tooltip";

export type HistoryIconActionProps = IconButtonProps;

export const HistoryIconAction = (props: HistoryIconActionProps) => {
  return (
    <IconButton {...props}>
      <Tooltip toolTipLabel="History">
        <SvgHistory />
      </Tooltip>
    </IconButton>
  );
};
