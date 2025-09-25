import { Skeleton as MuiSkeleton, Stack } from "@mui/material";

export const Skeleton = ({ label }: { label?: string }) => {
  return (
    <Stack gap="10px" flex={1}>
      {label && (
        <MuiSkeleton
          width={120}
          height="23px"
          sx={{
            transform: "scale(1)",
          }}
        />
      )}
      <MuiSkeleton
        height="40px"
        width="100%"
        sx={{
          transform: "scale(1)",
        }}
      />
    </Stack>
  );
};
