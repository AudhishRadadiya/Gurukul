import type { SvgIconProps } from "@mui/material";

export const SvgAddRounded = (
  props: SvgIconProps & {
    disabled?: boolean;
  }
) => {
  const stroke = props.disabled ? "#afafafff" : "#4C5D70";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={30}
      height={30}
      fill="none"
      {...props}
    >
      <path
        fill="#fff"
        stroke="#DBE1E6"
        strokeWidth={1.565}
        d="M.5 4A3.5 3.5 0 0 1 4 .5h22A3.5 3.5 0 0 1 29.5 4v22a3.5 3.5 0 0 1-3.5 3.5H4A3.5 3.5 0 0 1 .5 26V4Z"
      />

      <circle cx="15" cy="15" r="8.35" stroke={stroke} strokeWidth="1.2" />

      <path
        d="M15 10.455v9.091"
        stroke={stroke}
        strokeWidth={1.565}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M10.455 15h9.091"
        stroke={stroke}
        strokeWidth={1.565}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
