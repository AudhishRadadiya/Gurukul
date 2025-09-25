import type { SvgIconProps } from "@mui/material";

export const SvgNoSign = (props: SvgIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={40}
      height={40}
      fill="none"
      {...props}
      style={{ color: "inherit" }}
    >
      <path
        d="M3.80046 33.943C3.80046 33.943 16.7005 24.343 16.3005 14.543C15.8005 4.74296 6.30046 2.94296 4.00046 18.543C1.70046 34.143 17.6005 30.043 22.3005 26.043C27.0005 22.043 29.5005 16.443 25.1005 15.543C20.9005 14.743 19.6005 28.343 23.9005 30.443C23.9005 30.443 26.0005 32.743 33.6005 22.243C33.8005 22.043 34.1005 22.043 34.2005 22.243L36.6005 27.143C36.7005 27.443 37.1005 27.443 37.3005 27.243L42.7005 21.143"
        stroke="black"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M3 39.543H43.1"
        stroke="black"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
    </svg>
  );
};
