import { Skeleton as MuiSkeleton, Stack } from "@mui/material";

export const Skeleton = () => {
  return (
    <Stack gap="20px" direction="row" alignItems="center">
      <MuiSkeleton
        width="120px"
        height="120px"
        sx={{
          transform: "scale(1)",
        }}
      ></MuiSkeleton>
      <Stack gap="8px">
        <MuiSkeleton
          width={129}
          height="24px"
          sx={{
            transform: "scale(1)",
          }}
        />
        <MuiSkeleton
          width={129}
          height="16px"
          sx={{
            transform: "scale(1)",
          }}
        />
      </Stack>
    </Stack>
  );
};
