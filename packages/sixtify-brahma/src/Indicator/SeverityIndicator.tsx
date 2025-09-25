import { alpha, Box, Stack, Typography } from "@mui/material";
import { PadBox } from "../PadBox";
import CircleIcon from "@mui/icons-material/Circle";

type SeverityIndicatorProps = {
  label: string;
  color: string;
  isBackground: boolean;
};

export const SeverityIndicator = ({
  color,
  label,
  isBackground = false,
}: SeverityIndicatorProps) => {
  return (
    <Box
      sx={{
        backgroundColor: `${isBackground ? alpha(color, 0.2) : ""}`,
        width: "max-content",
        borderRadius: "6px",
      }}
    >
      <PadBox padding={{ padding: "5px", paddingX: "8px" }}>
        <Stack flexDirection="row" alignItems="center" gap="8px">
          <CircleIcon sx={{ color, fontSize: "12px" }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {label}
          </Typography>
        </Stack>
      </PadBox>
    </Box>
  );
};
