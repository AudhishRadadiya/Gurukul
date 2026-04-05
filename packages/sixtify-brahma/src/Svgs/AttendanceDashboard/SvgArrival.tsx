import type { SvgIconProps } from "@mui/material";

export const SvgArrival = (props: SvgIconProps) => {
  return (
    <svg
      width="57"
      height="56"
      viewBox="0 0 57 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="0.5"
        width="56"
        height="56"
        rx="8"
        fill={props.fill ?? "currentColor"}
        fillOpacity="0.1"
      />
      <path
        d="M30.2249 16.7285C26.4199 16.7285 23.0479 18.6182 21.0078 21.5132L22.5342 22.5992C24.233 20.1849 27.04 18.6071 30.2249 18.6071C35.4241 18.6071 39.618 22.8011 39.618 28.0003C39.618 33.1996 35.4241 37.3935 30.2249 37.3935C27.04 37.3935 24.2367 35.8157 22.5342 33.4014L21.0078 34.4875C23.0479 37.3825 26.4199 39.2721 30.2249 39.2721C36.4405 39.2721 41.4967 34.216 41.4967 28.0003C41.4967 21.7847 36.4405 16.7285 30.2249 16.7285Z"
        fill={props.fill ?? "currentColor"}
      />
      <path
        d="M26.1554 23.792L24.8051 25.1423L26.9479 27.2851H15.5V29.1637H26.9479L24.8051 31.3065L26.1554 32.6568L29.9126 28.8995L30.5584 28.2244L29.9126 27.5493L26.1554 23.792Z"
        fill={props.fill ?? "currentColor"}
      />
    </svg>
  );
};
