import { Skeleton as MuiSkeleton } from "@mui/material";

export const Skeleton = () => {
  return (
    <MuiSkeleton
      width={50}
      height={20}
      sx={{ borderRadius: "4px" }}
      variant="rectangular"
    />
  );
};
