import { PadBox } from "@codezee/sixtify-brahma";
import { Box, Stack, useTheme } from "@mui/material";
import type { PropsWithChildren } from "react";

export const AuthUiCard = ({ children }: PropsWithChildren) => {
  const {
    palette: {
      app: { color },
    },
  } = useTheme();

  return (
    <Box
      sx={{
        background: color.iron[600],
        borderRadius: "20px",
        boxShadow: `12px 10px 25px ${color.mirage[800]}`,
        margin: "auto",
        maxWidth: "630px",
        width: "100%", // Ensure it takes full available width
      }}
    >
      <PadBox
        padding={{
          // Responsive padding: smaller on mobile, larger on desktop
          padding: {
            // Small screens
            md: "50px 75px",

            // Mobile: smaller padding
            sm: "40px 30px",
            xs: "30px 20px", // Desktop: original padding
          },
        }}
      >
        <Stack
          gap={{
            // Mobile: smaller gap
            md: "50px",
            xs: "30px", // Desktop: original gap
          }}
          alignItems="center"
        >
          {children}
        </Stack>
      </PadBox>
    </Box>
  );
};
