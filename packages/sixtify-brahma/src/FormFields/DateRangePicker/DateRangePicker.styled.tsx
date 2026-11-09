import Box, { type BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import type { ComponentType } from "react";

const getCompactStyles = (dividerColor: string) => ({
  fontSize: "12px",
  maxWidth: "100%",
  overflow: "hidden",
  width: "100%",
  "& .rdrCalendarWrapper": {
    boxSizing: "border-box",
    fontSize: "12px",
    maxWidth: "100%",
    width: "100% !important",
  },
  "& .rdrDateDisplay": {
    margin: "0.3em",
  },
  "& .rdrDateDisplayItem": {
    borderRadius: "4px",
    boxShadow: "0 0 0 1px #eff2f7",
    margin: "0 2px",
  },
  "& .rdrDateDisplayItem > input": {
    fontSize: "12px",
    height: "28px",
    lineHeight: "28px",
    padding: "0 6px",
  },
  "& .rdrDateDisplayWrapper": {
    maxWidth: "100%",
    padding: "4px 2px",
  },
  "& .rdrDateRangePickerWrapper": {
    display: "flex",
    flexDirection: "column",
    maxWidth: "100%",
    overflow: "hidden",
    width: "100%",
  },
  "& .rdrDay": {
    height: "2.2em",
    lineHeight: "1.9em",
  },
  "& .rdrDayNumber span": {
    fontSize: "12px",
    position: "relative",
  },
  "& .rdrDayToday .rdrDayNumber span:after": {
    bottom: "1px",
    height: "2px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "12px",
  },
  "& .rdrDays": {
    width: "100%",
  },
  "& .rdrDefinedRangesWrapper": {
    borderBottom: `1px solid ${dividerColor}`,
    borderRight: "none",
    fontSize: "12px",
    maxWidth: "100%",
    width: "100% !important",
  },
  "& .rdrInputRange": {
    boxSizing: "border-box",
    fontSize: "11px",
    padding: "2px 0",
    width: "100%",
  },
  "& .rdrInputRangeInput": {
    fontSize: "11px",
    height: "22px",
    lineHeight: "22px",
    marginRight: "4px",
    width: "22px",
  },
  "& .rdrInputRanges": {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    padding: "4px 8px 6px",
    width: "100%",
  },
  "& .rdrMonth": {
    boxSizing: "border-box",
    maxWidth: "100%",
    padding: "0 2px 4px",
    width: "100% !important",
  },
  "& .rdrMonthAndYearPickers select": {
    fontSize: "12px",
    padding: "2px 4px",
  },
  "& .rdrMonthAndYearWrapper": {
    height: "30px",
    paddingTop: "2px",
  },
  "& .rdrMonths": {
    flexWrap: "wrap",
    maxWidth: "100%",
    width: "100%",
  },
  "& .rdrMonthsHorizontal, & .rdrMonthsVertical": {
    maxWidth: "100%",
    width: "100%",
  },
  "& .rdrNextPrevButton": {
    height: "22px",
    margin: "0 4px",
    width: "22px",
  },
  "& .rdrPprevButton i, & .rdrNextButton i": {
    borderWidth: "3px 3px 3px 0",
  },
  "& .rdrStaticRange": {
    border: `1px solid ${dividerColor}`,
    borderRadius: "4px",
    flex: "0 0 auto",
  },
  "& .rdrStaticRangeLabel": {
    fontSize: "11px",
    lineHeight: "14px",
    padding: "4px 8px",
  },
  "& .rdrStaticRanges": {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "4px",
    height: "auto",
    padding: "6px 8px 4px",
  },
  "& .rdrWeekDay": {
    flexBasis: "calc(100% / 7)",
    fontSize: "11px",
    lineHeight: "1.8em",
  },
  "& .rdrWeekDays": {
    width: "100%",
  },
});

export const DateRangePickerFocusWrapper: ComponentType<BoxProps> = styled(Box)(
  ({ theme }) => {
    const { butterflyBlue } = theme.palette.app.color;

    const dividerColor = theme.palette.divider;

    const compactStyles = getCompactStyles(dividerColor);

    return {
      "&.hide-presets .rdrDefinedRangesWrapper": {
        display: "none !important",
      },
      "&.compact": compactStyles,
      "& .rdrMonthAndYearWrapper": {
        height: "40px",
        paddingTop: "10px",
      },
      "& .rdrStaticRangeLabel": {
        padding: "8px 10px",
        lineHeight: "15px",
      },
      "& .rdrDefinedRangesWrapper": {
        width: "175px",
        display: "flex",
        flexDirection: "column",
      },
      "& .rdrStaticRanges": {
        height: "100%",
      },
      "& .rdrStaticRange": {
        flex: 1,
      },
      "& .rdrInputRanges": {
        padding: "0px",
      },
      "& .rdrInputRange": {
        padding: "2px 10px",
      },
      "& .rdrInputRangeInput": {
        height: "25px",
        width: "25px",
        lineHeight: "25px",
        marginRight: "5px",
      },
      "& .rdrNextPrevButton:focus-visible": {
        outline: `2px solid ${butterflyBlue[900]}`,
        outlineOffset: "2px",
        borderRadius: "4px",
      },
      "& .rdrMonthPicker select:focus-visible": {
        outline: `2px solid ${butterflyBlue[900]}`,
        outlineOffset: "2px",
        borderRadius: "4px",
      },
      "& .rdrYearPicker select:focus-visible": {
        outline: `2px solid ${butterflyBlue[900]}`,
        outlineOffset: "2px",
        borderRadius: "4px",
      },
      "& .rdrDay:focus-visible": {
        outline: `2px solid ${butterflyBlue[900]}`,
        outlineOffset: "2px",
        borderRadius: "4px",
      },
      [theme.breakpoints.down("md")]: compactStyles,
    };
  }
);
