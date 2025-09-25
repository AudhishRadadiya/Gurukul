import type { SvgIconProps } from "@mui/material";

export const SvgEdit = (props: SvgIconProps) => {
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
        d="M.5 4A3.5 3.5 0 0 1 4 .5h22A3.5 3.5 0 0 1 29.5 4v22a3.5 3.5 0 0 1-3.5 3.5H4A3.5 3.5 0 0 1 .5 26V4Z"
      />
      <path
        stroke="#4C5D70"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.565}
        d="M14.457 8.836h-1.25c-3.125 0-4.375 1.25-4.375 4.375v3.75c0 3.125 1.25 4.375 4.375 4.375h3.75c3.125 0 4.375-1.25 4.375-4.375v-1.25"
      />
      <path
        stroke="#4C5D70"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.565}
        d="M17.608 9.474 12.683 14.4a1.695 1.695 0 0 0-.413.825l-.269 1.881c-.1.682.382 1.157 1.063 1.063l1.881-.269a1.75 1.75 0 0 0 .825-.412l4.925-4.925c.85-.85 1.25-1.838 0-3.088s-2.237-.85-3.087 0Z"
      />
      <path
        stroke="#4C5D70"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.565}
        d="M16.898 10.18a4.465 4.465 0 0 0 3.088 3.087"
      />
    </svg>
  );
};
