import type { SVGProps } from "react";

export const SvgOrganization = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
    style={{ color: "inherit" }}
  >
    <g stroke={props.fill ?? "currentColor"} clipPath="url(#a)">
      <path
        strokeWidth={1.5}
        d="M1.085 3.272c.686-3.03 5.153-3.03 5.83 0 .403 1.777-.703 3.282-1.663 4.22a1.804 1.804 0 0 1-2.512 0c-.952-.938-2.058-2.443-1.655-4.22ZM13.085 14.272c.682-3.03 5.148-3.03 5.83 0 .401 1.777-.699 3.283-1.662 4.22a1.798 1.798 0 0 1-2.506 0c-.963-.938-2.063-2.443-1.662-4.22Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.996 4h2.29c1.58 0 2.315 2.126 1.127 3.26l-6.826 6.49C5.4 14.874 6.135 17 7.707 17h2.289"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.495 4.5h.01M15.495 14.5h.01"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill={props.fill ?? "currentColor"} d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);
