import type { SvgIconProps } from "@mui/material";

export const SvgDelete = (
  props: SvgIconProps & {
    disabled?: boolean;
  }
) => {
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
      <path
        stroke={props.disabled ? "#afafafff" : "#4C5D70"}
        strokeWidth={1.565}
        d="M21.75 10.484a76.276 76.276 0 0 0-7.515-.375c-1.485 0-2.97.075-4.455.225l-1.53.15M12.375 9.727l.165-.982c.12-.712.21-1.245 1.478-1.245h1.964c1.268 0 1.366.563 1.478 1.252l.165.975M20.138 12.855l-.487 7.553c-.083 1.177-.15 2.092-2.243 2.092h-4.815c-2.092 0-2.16-.915-2.242-2.092l-.488-7.553M13.746 18.375h2.498M13.125 15.375h3.75"
      />
    </svg>
  );
};
