import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { SvgCalendar } from "../Svgs";
import { Tooltip } from "../Tooltip";

export type CalendarIconActionProps = IconButtonProps;

export const CalendarIconAction = (props: CalendarIconActionProps) => {
  return (
    <IconButton sx={{ color: "#4C5D70" }} {...props}>
      <Tooltip toolTipLabel="Calendar">
        <SvgCalendar />
      </Tooltip>
    </IconButton>
  );
};
