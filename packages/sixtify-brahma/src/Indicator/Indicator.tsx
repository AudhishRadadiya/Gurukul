import { Stack } from "@mui/material";
import { SvgIndicator } from "../Svgs/SvgIndicator";
import { type WorkDayType } from "../utils/colorVariant";

type IndicatorProps = {
  label?: string;
  variant?: WorkDayType;
  colourCode?: string;
};

export const Indicator = ({ label, variant, colourCode }: IndicatorProps) => {
  return (
    <Stack gap="10px" direction="row" alignItems="center">
      <SvgIndicator variant={variant} colourCode={colourCode} />
      {label}
    </Stack>
  );
};
