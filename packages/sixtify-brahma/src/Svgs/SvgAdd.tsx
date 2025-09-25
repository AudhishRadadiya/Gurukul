import type { SvgIconProps } from "@mui/material";

export const SvgAdd = (props: SvgIconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="19" cy="19" r="17" stroke="#3BA6E8" strokeWidth="2.5" />
      <path
        d="M10 18.6538H28"
        stroke="#3BA6E8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M19.3462 10L19.3462 28"
        stroke="#3BA6E8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
