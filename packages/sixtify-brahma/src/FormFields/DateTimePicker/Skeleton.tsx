import { Skeleton as MuiSkeleton, Stack } from "@mui/material";

type SkeletonProps = {
  label?: string;
  styling: "custom" | "default";
};

export const Skeleton = ({ label, styling }: SkeletonProps) => {
  return (
    <Stack gap="10px" flex={1}>
      {label && styling === "custom" && (
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
