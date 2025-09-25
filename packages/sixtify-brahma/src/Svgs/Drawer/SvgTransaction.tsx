import type { SVGProps } from "react";

export const SvgTransaction = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      stroke={props.fill ?? "currentColor"}
      d="M6.667 1.664v2.5M13.333 1.664v2.5M2.917 7.578h14.166M15 19.167a3.333 3.333 0 1 0 0-6.667 3.333 3.333 0 0 0 0 6.667ZM15 14.656v2.492"
    />
    <path
      stroke={props.fill ?? "currentColor"}
      d="M17.5 7.08v6.55a3.332 3.332 0 0 0-5.833 2.2c0 .626.175 1.217.483 1.717.175.3.4.567.658.784H6.667c-2.917 0-4.167-1.667-4.167-4.167V7.081c0-2.5 1.25-4.167 4.167-4.167h6.666c2.917 0 4.167 1.667 4.167 4.167ZM9.996 11.417h.008M6.912 11.417h.007M6.912 13.917h.007"
    />
  </svg>
);
