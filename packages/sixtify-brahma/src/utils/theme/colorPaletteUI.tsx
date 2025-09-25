import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { colorPalette } from "./colorPalette";

const ColorSwatch = ({ color, shade }: { color: string; shade: string }) => {
  return (
    <Tooltip title={color}>
      <Box
        sx={{
          width: 80,
          height: 40,
          backgroundColor: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #e0e0e0",
          color: "black",
          fontSize: "12px",
        }}
      >
        {shade}
      </Box>
    </Tooltip>
  );
};

export const colorPaletteUI = () => {
  return (
    <Stack spacing={4} sx={{ padding: 4 }}>
      {Object.entries(colorPalette).map(([name, shades]) => (
        <Stack key={name} spacing={2}>
          <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
            {name.replace(/([A-Z])/g, " $1")}
          </Typography>

          <Stack direction="row" spacing={0}>
            {Object.entries(shades).map(([shade, color]) => (
              <ColorSwatch key={shade} shade={shade} color={color} />
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
