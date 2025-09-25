import { FacebookCircularProgress } from "@codezee/sixtify-brahma";
import { Box } from "@mui/material";

export const PageLoader = () => {
  return (
    <Box
      sx={{
        left: "50%",
        position: "absolute",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <FacebookCircularProgress size={60} />
    </Box>
  );
};
