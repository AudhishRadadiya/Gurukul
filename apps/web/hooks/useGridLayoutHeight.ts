import { useGetDeviceType } from "@codezee/sixtify-brahma";
import { useMemo } from "react";

type UseGridLayoutHeightArgs = {
  baseHeight: number;
  noNeedToApplyPaginationHeight?: boolean;
  showPagination: boolean;
};

export const useGridLayoutHeight = ({
  baseHeight,
  noNeedToApplyPaginationHeight = false,
  showPagination = false,
}: UseGridLayoutHeightArgs) => {
  const { isMobile, isTablet } = useGetDeviceType();

  const deviceOffset = (() => {
    if (isMobile) {
      return 125;
    }

    if (isTablet) {
      return 100;
    }

    return noNeedToApplyPaginationHeight ? 0 : 50;
  })();

  return useMemo(() => {
    const paginationOffset = showPagination ? deviceOffset : 0;

    return `calc(100dvh - ${baseHeight + paginationOffset}px)`;
  }, [
    isMobile,
    isTablet,
    baseHeight,
    deviceOffset,
    showPagination,
    noNeedToApplyPaginationHeight,
  ]);
};
