import type { SvgIconProps } from "@mui/material";

export const SvgWeekoffCalendar = (props: SvgIconProps) => {
  return (
    <svg
      width="57"
      height="56"
      viewBox="0 0 57 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.75"
        width="56"
        height="56"
        rx="8"
        fill={props.fill ?? "currentColor"}
        fillOpacity="0.1"
      />
      <path
        d="M21.75 16.5V17.5H17.75V39.5H39.75V17.5H35.75V16.5H33.75V17.5H23.75V16.5H21.75ZM19.75 19.5H21.75V20.5H23.75V19.5H33.75V20.5H35.75V19.5H37.75V21.5H19.75V19.5ZM19.75 23.5H37.75V37.5H19.75V23.5ZM25.75 25.5V27.5H27.75V25.5H25.75ZM29.75 25.5V27.5H31.75V25.5H29.75ZM33.75 25.5V27.5H35.75V25.5H33.75ZM21.75 29.5V31.5H23.75V29.5H21.75ZM25.75 29.5V31.5H27.75V29.5H25.75ZM29.75 29.5V31.5H31.75V29.5H29.75ZM33.75 29.5V31.5H35.75V29.5H33.75ZM21.75 33.5V35.5H35.75V33.5H21.75Z"
        fill={props.fill ?? "currentColor"}
      />
    </svg>
  );
};
