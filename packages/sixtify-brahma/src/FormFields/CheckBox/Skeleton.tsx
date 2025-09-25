import { Skeleton as MuiSkeleton } from "@mui/material";

export const Skeleton = () => {
  return (
    <MuiSkeleton
      width={30}
      height={30}
      sx={{ borderRadius: "4px" }}
      variant="rectangular"
    />
  );
};
