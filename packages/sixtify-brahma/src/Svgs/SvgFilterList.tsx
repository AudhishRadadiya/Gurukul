import type { SvgIconProps } from "@mui/material";

export const SvgFilterList = (
  props: SvgIconProps & {
    disabled?: boolean;
  }
) => {
  const stroke = props.disabled ? "#afafafff" : "#4C5D70";

  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="0.5" y="0.5" width="33" height="33" rx="3.5" stroke="#BCBFC2" />
      <path
        d="M10.5 13.8333V11.5C10.5 10.9477 10.9478 10.5 11.5 10.5H24.5001C25.0524 10.5 25.5001 10.9477 25.5001 11.4999L25.5004 13.8333M10.5 13.8333L15.9842 18.534C16.2058 18.724 16.3334 19.0013 16.3334 19.2933V24.2192C16.3334 24.8698 16.9448 25.3472 17.5759 25.1894L18.9092 24.856C19.3544 24.7447 19.6667 24.3448 19.6667 23.8859V19.2933C19.6667 19.0014 19.7943 18.724 20.0159 18.534L25.5004 13.8333M10.5 13.8333H25.5004"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
