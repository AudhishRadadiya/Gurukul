import { Box } from "@mui/material";
import { FacebookCircularProgress } from "../../Loader";

export const CircularLoader = () => {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        left: 0,
        position: "absolute",
        top: 0,
        width: "100%",
      }}
    >
      <FacebookCircularProgress />
    </Box>
  );
};
