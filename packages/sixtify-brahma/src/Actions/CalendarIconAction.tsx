import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { SvgCalendar } from "../Svgs";
import { Tooltip } from "../Tooltip";

export type CalendarIconActionProps = IconButtonProps & {
  showTooltip?: boolean;
  disabled?: boolean;
};

export const CalendarIconAction = ({
  showTooltip = true,
  ...props
}: CalendarIconActionProps) => {
  return (
    <IconButton sx={{ color: "#4C5D70" }} {...props}>
      <Tooltip hidden={!showTooltip} toolTipLabel="Calendar">
        <SvgCalendar disabled={props.disabled} />
      </Tooltip>
    </IconButton>
  );
};
