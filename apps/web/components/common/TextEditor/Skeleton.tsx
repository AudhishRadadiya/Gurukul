import { Skeleton as MuiSkeleton, Stack } from "@mui/material";

export const Skeleton = () => {
  return (
    <Stack gap="10px">
      <MuiSkeleton
        width={129}
        height="24px"
        sx={{
          transform: "scale(1)",
        }}
      />

      <MuiSkeleton
        height="40px"
        sx={{
          transform: "scale(1)",
        }}
      />

      <MuiSkeleton
        height="250px"
        sx={{
          transform: "scale(1)",
        }}
      ></MuiSkeleton>
    </Stack>
  );
};
