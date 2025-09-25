import { Skeleton as MuiSkeleton, Stack } from "@mui/material";

export const Skeleton = () => {
  return (
    <Stack direction="row" gap="10px">
      <Stack gap="10px">
        <MuiSkeleton
          width={120}
          height="23px"
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
      </Stack>
      <Stack gap="10px">
        <MuiSkeleton
          width={120}
          height="23px"
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
      </Stack>
    </Stack>
  );
};
