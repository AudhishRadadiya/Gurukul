import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export type Layout = "mobile" | "tablet" | "desktop" | "narrowMobile";

export function useGetDeviceType(): {
  layout: Layout;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isNarrowMobile: boolean;
} {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600px

  const isNarrowMobile = useMediaQuery("(max-width:555px)");

  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600–900px

  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // >900px

  const getLayout = (): Layout => {
    if (isNarrowMobile) {
      return "narrowMobile";
    }

    if (isMobile) {
      return "mobile";
    }

    if (isTablet) {
      return "tablet";
    }

    return "desktop";
  };

  return { layout: getLayout(), isMobile, isTablet, isDesktop, isNarrowMobile };
}
