import type { SVGProps } from "react";

export const SvgLetteremplate = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
    style={{ color: "inherit" }}
  >
    <path
      d="M18.2 6.45149V15.3501C18.2 18.0881 16.3876 19.0008 14.15 19.0008H6.05C3.81238 19.0008 2 18.0881 2 15.3501V6.45149C2 3.48529 3.81238 2.80078 6.05 2.80078C6.05 3.36664 6.3031 3.87774 6.71822 4.25193C7.13335 4.62613 7.70038 4.8543 8.32813 4.8543H11.8719C13.1274 4.8543 14.15 3.9325 14.15 2.80078C16.3876 2.80078 18.2 3.48529 18.2 6.45149Z"
      stroke={props.fill ?? "currentColor"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.7001 2.8C13.7001 3.792 12.6775 4.6 11.422 4.6H7.87822C7.25047 4.6 6.68345 4.4 6.26832 4.072C5.8532 3.744 5.6001 3.296 5.6001 2.8C5.6001 1.808 6.62272 1 7.87822 1H11.422C12.0497 1 12.6168 1.2 13.0319 1.528C13.447 1.856 13.7001 2.304 13.7001 2.8Z"
      stroke={props.fill ?? "currentColor"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 10.8984H11"
      stroke={props.fill ?? "currentColor"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 14.5H14.6"
      stroke={props.fill ?? "currentColor"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
