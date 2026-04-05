import type { SvgIconProps } from "@mui/material";

export const SvgLeaveCalendar = (props: SvgIconProps) => {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        width="56"
        height="56"
        rx="8"
        fill={props.fill ?? "currentColor"}
        fillOpacity="0.1"
      />
      <path
        d="M21 16.5V17.5H17V39.5H39V17.5H35V16.5H33V17.5H23V16.5H21ZM19 19.5H21V20.5H23V19.5H33V20.5H35V19.5H37V21.5H19V19.5ZM19 23.5H37V37.5H19V23.5ZM27 25.5V31.5H29V25.5H27ZM27 33.5V35.5H29V33.5H27Z"
        fill={props.fill ?? "currentColor"}
      />
    </svg>
  );
};
