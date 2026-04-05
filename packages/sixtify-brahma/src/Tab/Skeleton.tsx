import { Box, Skeleton as MuiSkeleton } from "@mui/material";

export const Skeleton = () => {
  return (
    <Box flex={1}>
      <MuiSkeleton
        height="30px"
        sx={{
          maxWidth: "200px",
          transform: "scale(1)",
        }}
      />
    </Box>
  );
};
