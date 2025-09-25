import { Box, Skeleton as MuiSkeleton } from "@mui/material";

export const Skeleton = ({
  height = 235,
  radius = 18,
}: {
  height?: string | number;
  radius?: number;
}) => {
  return (
    <Box position="relative" display="flex" justifyContent="center">
      <MuiSkeleton
        sx={{
          transform: "unset",
          width: "162px",
          height: { height },
          borderRadius: "50%",
          border: `${radius}px solid #e0e0e0`,
          background: "transparent",
          boxSizing: "border-box",
        }}
      />

      <MuiSkeleton
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80px",
          height: "25px",
        }}
      />
    </Box>
  );
};
