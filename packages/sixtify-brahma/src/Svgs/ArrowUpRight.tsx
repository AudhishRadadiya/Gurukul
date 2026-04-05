import type { SvgIconProps } from "@mui/material";

export const ArrowUpRight = (
  props: SvgIconProps & {
    disabled?: boolean;
  }
) => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.41406 15.5837L15.5807 6.41699M15.5807 6.41699H6.41406M15.5807 6.41699V15.5837"
        stroke={props.disabled ? "#DBE1E6" : "#4C5D70"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
