import { Skeleton as MuiSkeleton, Stack } from "@mui/material";

type RatingSkeletonProps = {
  label?: string;
};

const STAR_KEYS = ["star-1", "star-2", "star-3", "star-4", "star-5"];

export const RatingSkeleton = ({ label }: RatingSkeletonProps) => {
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

      <Stack direction="row" gap="5px">
        {STAR_KEYS.map((key) => (
          <MuiSkeleton
            key={key}
            width={30}
            height={30}
            sx={{
              transform: "scale(1)",
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
};
