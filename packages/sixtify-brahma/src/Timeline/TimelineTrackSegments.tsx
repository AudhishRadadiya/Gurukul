import { Box, Stack, Tooltip } from "@mui/material";
import { DateTime } from "luxon";
import { getColorByVariant, getTimeInHHmm } from "../utils";
import { getArrowValue, type HighlightedInterval } from "./Timeline";

type TimelineTrackSegmentsProps = {
  totalDots: number;
  intervals: HighlightedInterval[];
  startTimeline: number;
};

export const TimelineTrackSegments = ({
  totalDots,
  intervals,
  startTimeline,
}: TimelineTrackSegmentsProps) => {
  return (
    <Box sx={{ position: "relative", width: "100%", height: 4 }}>
      {/* eslint-disable-next-line sonarjs/cognitive-complexity */}
      {intervals?.map((interval, index) => {
        const inTime = getTimeInHHmm(interval.in_time);

        const outTime = getTimeInHHmm(interval.out_time);

        const intervalInTime = DateTime.fromISO(interval.in_time);

        const intervalOutTime = DateTime.fromISO(interval.out_time);

        const shiftHours = intervalOutTime
          .diff(intervalInTime, ["hours", "minutes"])
          .toFormat("hh:mm");

        let in_time = getArrowValue(inTime);

        let out_time = getArrowValue(outTime);

        const isValidInTime = !isNaN(in_time);

        const isValidOutTime = !isNaN(out_time);

        if (isValidInTime && in_time < startTimeline) {
          in_time += totalDots;
        }

        if (isValidOutTime) {
          if (out_time < startTimeline) {
            out_time += totalDots;
          }

          if (isValidInTime && out_time < in_time) {
            out_time += totalDots;
          }
        }

        let inTimeLabel = "";

        let outTimeLabel = "";

        if (isValidInTime) {
          inTimeLabel = `In time : ${inTime} ${!isValidOutTime ? " / Missing punch" : ""}`;
        }

        if (isValidOutTime) {
          outTimeLabel = `Out time : ${outTime}  ${!isValidInTime ? "/ Missing punch" : ""}`;
        }

        const labelText =
          interval?.name ??
          `In/Out: ${getTimeInHHmm(interval.in_time)} - ${getTimeInHHmm(
            interval.out_time
          )} (${shiftHours})`;

        const color =
          interval?.color ?? getColorByVariant(interval.status_type);

        const startDot = isValidInTime
          ? ((in_time - startTimeline) / totalDots) * 100
          : 0;

        const endDot = isValidOutTime
          ? ((out_time - startTimeline) / totalDots) * 100
          : 0;

        const widthDot =
          isValidInTime && isValidOutTime ? Math.max(endDot - startDot, 0) : 0;

        return (
          // eslint-disable-next-line sonarjs/no-array-index-key
          <Stack direction="row" key={index}>
            {isValidInTime && (
              <Tooltip arrow title={inTimeLabel} placement="top">
                <Box
                  sx={{
                    height: 8,
                    width: 8,
                    position: "absolute",
                    left: `${startDot}%`,
                    boxShadow: "none",
                    backgroundColor: color,
                    borderRadius: "50%",
                    top: "15px",
                    zIndex: 3,
                    "&:focus, &:hover, &:active": {
                      boxShadow: "none",
                    },
                  }}
                />
              </Tooltip>
            )}

            {isValidInTime && isValidOutTime && (
              <Tooltip arrow title={labelText} placement="top">
                <Box
                  sx={{
                    position: "absolute",
                    left: `${startDot}%`,
                    width: `${widthDot}%`,
                    height: 3.5,
                    top: "17.5px",
                    backgroundColor: color,
                    zIndex: 2,
                  }}
                />
              </Tooltip>
            )}

            {isValidOutTime && (
              <Tooltip arrow title={outTimeLabel} placement="top">
                <Box
                  sx={{
                    height: 8,
                    width: 8,
                    position: "absolute",
                    left: `${endDot}%`,
                    boxShadow: "none",
                    backgroundColor: color,
                    borderRadius: "50%",
                    top: "15px",
                    zIndex: 3,
                    "&:focus, &:hover, &:active": {
                      boxShadow: "none",
                    },
                  }}
                />
              </Tooltip>
            )}
          </Stack>
        );
      })}
    </Box>
  );
};
