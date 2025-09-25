import { Skeleton as MuiSkeleton, Stack } from "@mui/material";

type SkeletonProps = {
  label?: string;
};
export const Skeleton = ({ label }: SkeletonProps) => {
  return (
    <Stack gap="10px">
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
        sx={{
          transform: "scale(1)",
        }}
      />
    </Stack>
  );
};
