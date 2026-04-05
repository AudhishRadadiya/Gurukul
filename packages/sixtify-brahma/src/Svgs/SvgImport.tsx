import type { SvgIconProps } from "@mui/material";

export const SvgImport = (
  props: SvgIconProps & {
    disabled?: boolean;
  }
) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={42}
      height={42}
      fill="none"
      viewBox="0 0 36 36"
      {...props}
    >
      <rect width={33} height={33} x={0.5} y={0.5} stroke="#BCBFC2" rx={3.5} />
      <g stroke={props.disabled ? "#afafafff" : "#4C5D70"}>
        <path d="M12 12.75c-.932 0-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083C9 14.352 9 14.818 9 15.75v5.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218h9.607c1.118 0 1.677 0 2.104-.218.376-.192.682-.498.874-.874.218-.428.218-.987.218-2.105V15.75c0-.932 0-1.398-.152-1.765a2 2 0 0 0-1.083-1.083c-.367-.152-.833-.152-1.765-.152M20 16.25l-3 3m0 0-3-3m3 3v-10" />
      </g>
    </svg>
  );
};
