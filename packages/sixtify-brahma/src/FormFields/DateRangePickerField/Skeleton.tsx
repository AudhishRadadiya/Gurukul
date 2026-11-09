import MuiSkeleton from "@mui/material/Skeleton";

import type { SizeType } from "../../utils/types";
import { getFormFieldStyleConfig } from "../utils/helper";

type SkeletonProps = {
  size?: SizeType;
};

export const Skeleton = ({ size }: SkeletonProps) => {
  const { inputHeight } = getFormFieldStyleConfig(size);

  return (
    <MuiSkeleton
      height={`${inputHeight}px`}
      sx={{
        transform: "scale(1)",
      }}
    />
  );
};
