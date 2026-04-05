import type { SvgIconProps } from "@mui/material";

export const SvgColumn = (
  props: SvgIconProps & {
    disabled?: boolean;
  }
) => {
  return (
    <svg
      width={41}
      height={45}
      viewBox="0 0 44 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x={0.5} y={1} width={41} height={41} rx={3.5} fill="white" />
      <rect x={0.5} y={1} width={41} height={41} rx={3.5} stroke="#BCBFC2" />
      <g clipPath="url(#clip0_38460_84386)">
        <path
          d="M18 12.5V30.5M24 12.5V30.5M16.8 12.5H25.2C26.8802 12.5 27.7202 12.5 28.362 12.827C28.9265 13.1146 29.3854 13.5735 29.673 14.138C30 14.7798 30 15.6198 30 17.3V25.7C30 27.3802 30 28.2202 29.673 28.862C29.3854 29.4265 28.9265 29.8854 28.362 30.173C27.7202 30.5 26.8802 30.5 25.2 30.5H16.8C15.1198 30.5 14.2798 30.5 13.638 30.173C13.0735 29.8854 12.6146 29.4265 12.327 28.862C12 28.2202 12 27.3802 12 25.7V17.3C12 15.6198 12 14.7798 12.327 14.138C12.6146 13.5735 13.0735 13.1146 13.638 12.827C14.2798 12.5 15.1198 12.5 16.8 12.5Z"
          stroke={props.disabled ? "#afafafff" : "#4C5D70"}
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_38460_84386">
          <rect
            width={20}
            height={20}
            fill="white"
            transform="translate(11 11.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
