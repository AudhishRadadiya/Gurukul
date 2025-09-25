import { PadBox } from "@codezee/sixtify-brahma";
import { Box, Grid } from "@mui/material";
import type { PropsWithChildren } from "react";

export const AuthUiContainer = ({ children }: PropsWithChildren) => {
  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundImage: "url(/images/login_page_background.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <PadBox padding={{ padding: "30px" }}>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          {/* Make it responsive: xs=12 (full width on mobile), sm=10, md=8, lg=6 */}
          <Grid item xs={12} sm={10} md={8} lg={6} xl={5}>
            {children}
          </Grid>
        </Grid>
      </PadBox>
    </Box>
  );
};
