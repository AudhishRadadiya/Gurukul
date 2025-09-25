import type { TypographyPropsVariantOverrides } from "@mui/material";
import type {
  FontStyleOptions,
  TypographyOptions,
  TypographyStyleOptions,
  Variant,
} from "@mui/material/styles/createTypography";

type TypographyVariant = keyof TypographyPropsVariantOverrides;
type TypographyActiveVariants = {
  [K in TypographyVariant]: TypographyPropsVariantOverrides[K] extends true
    ? K
    : never;
}[TypographyVariant];

export const typographyFontStyleOptions: FontStyleOptions = {
  fontSize: 14,
  fontFamily: "Poppins",
};

export const typographyOptions: Partial<
  Record<Variant, TypographyStyleOptions>
> = {
  h1: {
    fontSize: "clamp(2.5rem, 5vw, 6rem)",
    lineHeight: "clamp(3rem, 6vw, 7rem)",
  },
  h2: {
    fontSize: "clamp(2rem, 4vw, 3.75rem)",
    lineHeight: "clamp(2.5rem, 5vw, 4.5rem)",
  },
  h3: {
    fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
    lineHeight: "clamp(2.25rem, 4vw, 3.5rem)",
  },
  h4: {
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
    lineHeight: "clamp(1.75rem, 3.5vw, 2.625rem)",
  },
  h5: {
    fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
    lineHeight: "clamp(1.5rem, 3vw, 1.5rem)",
  },
  h6: {
    fontSize: "clamp(1.125rem, 2vw, 1.25rem)",
    lineHeight: "clamp(1.5rem, 2.5vw, 1.5rem)",
  },
  subtitle1: {
    fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
    lineHeight: "clamp(1.5rem, 2vw, 1.5rem)",
  },
  subtitle2: {
    fontSize: "clamp(0.875rem, 1.2vw, 0.875rem)",
    lineHeight: "clamp(1.25rem, 2vw, 1.5rem)",
  },
  body1: {
    fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
    lineHeight: "clamp(1.25rem, 2vw, 1.5rem)",
  },
  body2: {
    fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
    lineHeight: "clamp(1rem, 1.5vw, 1.25rem)",
  },
  caption: {
    fontSize: "clamp(0.625rem, 0.8vw, 0.75rem)",
    lineHeight: "clamp(0.875rem, 1vw, 1rem)",
  },
};

export const typographyVariantMapping: Record<
  TypographyActiveVariants,
  string
> = {
  subHeader1: "p",
  subHeader2: "p",
  body: "p",
  subText: "p",
  smallText: "p",
  tinyText: "p",
};

export const typographyThemeOptions: TypographyOptions = {
  ...typographyFontStyleOptions,
  ...typographyOptions,
};
