import { Box, Slider, Stack } from "@mui/material";
import { Tooltip } from "../Tooltip";
import {
  getColorByVariant,
  getStatusLabel,
  type WorkDayType,
} from "../utils/colorVariant";

type AttendanceStatusProps = {
  variant: WorkDayType;
  leaveColor?: string;
  toolTipLabel?: string;
};

export const AttendanceStatus = ({
  variant,
  leaveColor,
  toolTipLabel,
}: AttendanceStatusProps) => {
  const color = getColorByVariant(variant);

  return (
    <Stack sx={{ position: "relative", width: "100%", alignItems: "center" }}>
      <Box
        sx={{
          position: "absolute",
          backgroundColor: "#ffffff",
          border: `1px solid ${leaveColor ?? color}`,
          borderRadius: "7px",
          padding: "0px 5px",
          zIndex: 1,
          color: `${leaveColor ?? color}`,
          height: "28px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <Tooltip toolTipLabel={toolTipLabel}>{getStatusLabel(variant)}</Tooltip>
      </Box>
      <Slider
        valueLabelDisplay="off"
        value={[0, 2]}
        max={2}
        step={1}
        sx={{
          "& .MuiSlider-track": {
            background: `${leaveColor ?? color}`,
            height: "2px",
            border: "none",
          },
          "& .MuiSlider-thumb": {
            backgroundColor: `${leaveColor ?? color}`,
            height: 8,
            width: 8,
          },
          "& .MuiSlider-rail": {
            backgroundColor: "transparent",
          },
        }}
      />
    </Stack>
  );
};
