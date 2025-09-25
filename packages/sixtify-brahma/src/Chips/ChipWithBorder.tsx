import type { ChipProps } from "@mui/material";
import { alpha, Chip, Tooltip } from "@mui/material";

type ChipWithBorderProps = Omit<ChipProps, "color"> & {
  label: string;
  color?: string;
  toolTipLabel?: string;
};

export const ChipWithBorder = ({
  label,
  color = "green",
  toolTipLabel,
  ...rest
}: ChipWithBorderProps) => {
  return (
    <Tooltip title={toolTipLabel} arrow placement="top">
      <Chip
        label={label}
        {...rest}
        sx={{
          border: `1px solid ${color}`,
          borderColor: color,
          backgroundColor: alpha(color, 0.2),
          borderRadius: "3px",
          height: "20px",
          width: "auto",
          padding: "0px",
          ".MuiChip-label": {
            color,
            fontSize: "12px",
            fontWeight: 600,
            padding: "5px",
          },
        }}
      ></Chip>
    </Tooltip>
  );
};
