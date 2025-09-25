import { Skeleton as MuiSkeleton, Stack } from "@mui/material";

export const Skeleton = () => {
  return (
    <Stack gap="10px">
      <MuiSkeleton
        width={200}
        height="30px"
        sx={{
          transform: "scale(1)",
        }}
      />
    </Stack>
  );
};
