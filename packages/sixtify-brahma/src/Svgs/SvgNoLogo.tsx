import type { SvgIconProps } from "@mui/material";

export const SvgNoLogo = (props: SvgIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={50}
      fill="none"
      {...props}
    >
      <path
        stroke="#000"
        d="M1.09 1.082 48.91 48.917M1.09 6.71v36.797h37.908M6.754 6.602H48.91V43.29h-5.883M1.416 33.333l13.726-12.662"
      />
      <path
        fill="#000"
        d="M36.167 20.779c1.985 0 3.595-1.6 3.595-3.572s-1.61-3.571-3.595-3.571-3.595 1.599-3.595 3.571c0 1.973 1.61 3.572 3.595 3.572Z"
      />
      <path
        stroke="#000"
        d="m25.273 35.497 3.05-2.922M30.176 30.519l3.812-3.788c.436-.433 1.09-.433 1.416 0l13.29 12.77"
      />
    </svg>
  );
};
