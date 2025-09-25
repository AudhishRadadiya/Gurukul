import type { SvgIconProps } from "@mui/material";

export function FormAction(props: SvgIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={109}
      height={112}
      fill="none"
      {...props}
    >
      <path
        fill="#FAFAFA"
        d="M54.398 109.217c29.943 0 54.216-24.274 54.216-54.217 0-29.943-24.273-54.217-54.217-54.217C24.454.783.181 25.057.181 55c0 29.943 24.273 54.217 54.217 54.217Z"
      />
      <g filter="url(#a)">
        <mask
          id="c"
          width={109}
          height={110}
          x={0}
          y={0}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "alpha",
          }}
        >
          <path
            fill="url(#b)"
            d="M54.398 109.217c29.943 0 54.216-24.274 54.216-54.217 0-29.943-24.273-54.217-54.217-54.217C24.454.783.181 25.057.181 55c0 29.943 24.273 54.217 54.217 54.217Z"
          />
        </mask>
        <g mask="url(#c)">
          <path
            fill="#fff"
            d="M85.481 31.867H23.313a3.615 3.615 0 0 0-3.615 3.615v75.904A3.614 3.614 0 0 0 23.313 115H85.48a3.614 3.614 0 0 0 3.615-3.614V35.482a3.614 3.614 0 0 0-3.615-3.615Z"
          />
        </g>
      </g>
      <path
        fill="#D4F6CF"
        d="M47.892 39.096H29.096a2.169 2.169 0 0 0 0 4.338h18.796a2.169 2.169 0 0 0 0-4.338ZM47.892 69.458H29.096a2.169 2.169 0 0 0 0 4.337h18.796a2.169 2.169 0 0 0 0-4.337Z"
      />
      <path
        stroke="#40A230"
        strokeWidth={1.446}
        d="M78.253 49.94H30.542a2.892 2.892 0 0 0-2.892 2.892v7.228a2.892 2.892 0 0 0 2.892 2.892h47.71a2.892 2.892 0 0 0 2.892-2.892v-7.229a2.892 2.892 0 0 0-2.891-2.891Z"
      />
      <path
        fill="#89D07E"
        d="M78.253 79.578h-47.71a3.614 3.614 0 0 0-3.615 3.615v5.783a3.614 3.614 0 0 0 3.614 3.614h47.711a3.614 3.614 0 0 0 3.615-3.614v-5.783a3.614 3.614 0 0 0-3.615-3.615Z"
      />
      <path
        fill="#F1FDEF"
        d="M38.494 23.916a2.892 2.892 0 1 0 0-5.783 2.892 2.892 0 0 0 0 5.783Z"
      />
      <path
        fill="#40A230"
        d="M54.397 23.916a2.892 2.892 0 1 0 0-5.783 2.892 2.892 0 0 0 0 5.783Z"
      />
      <path
        fill="#F1FDEF"
        d="M70.302 23.916a2.892 2.892 0 1 0 0-5.783 2.892 2.892 0 0 0 0 5.783Z"
      />
      <path
        fill="#89D07E"
        d="M62.35 64.398a3.614 3.614 0 1 0 0-7.23 3.614 3.614 0 0 0 0 7.23Z"
      />
      <path
        fill="#40A230"
        stroke="#fff"
        strokeWidth={0.723}
        d="M65.174 76.231c-.578 0-1.118 0-1.61-.03a3.3 3.3 0 0 1-2.807-1.988l-3.05-6.027a1.302 1.302 0 0 1 .131-1.829c.212-.17.477-.262.748-.26a1.385 1.385 0 0 1 1.04.517l1.384 1.89.021.025v-7.182a1.343 1.343 0 1 1 2.687 0v4.699a1.25 1.25 0 1 1 2.49 0v.98a1.25 1.25 0 1 1 2.49 0v.754a1.25 1.25 0 1 1 2.49 0v4.58c-.025 1.41-.662 3.785-2.903 3.785-.162.008-1.54.087-3.108.087h-.003Z"
      />
      <defs>
        <linearGradient
          id="b"
          x1={54.398}
          x2={54.398}
          y1={0.783}
          y2={109.217}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E3ECFA" />
          <stop offset={1} stopColor="#DAE7FF" />
        </linearGradient>
        <filter
          id="a"
          width={78.072}
          height={86.024}
          x={15.361}
          y={25.361}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy={-2.169} />
          <feGaussianBlur stdDeviation={2.169} />
          <feColorMatrix values="0 0 0 0 0.788235 0 0 0 0 0.803922 0 0 0 0 0.85098 0 0 0 0.349 0" />
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_6149_10054"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_6149_10054"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
