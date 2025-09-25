import { Skeleton as MuiSkeleton, Stack } from "@mui/material";
export const Skeleton = () => {
  return (
    <Stack gap="10px">
      <MuiSkeleton height="20px" width="70px" sx={{ transform: "scale(1)" }} />
      <Stack direction="row" alignItems="center" gap="50px">
        <Stack gap="10px" direction="row" alignItems="center">
          <MuiSkeleton variant="circular" height="25px" width="25px" />
          <MuiSkeleton
            height="23px"
            width="38px"
            sx={{ transform: "scale(1)" }}
          />
        </Stack>
        <Stack gap="10px" direction="row" alignItems="center">
          <MuiSkeleton variant="circular" height="25px" width="25px" />
          <MuiSkeleton
            height="23px"
            width="38px"
            sx={{ transform: "scale(1)" }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
