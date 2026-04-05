import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export type Layout = "mobile" | "tablet" | "desktop";

export function useGetDeviceType(): {
  layout: Layout;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
} {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600px

  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600–900px

  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // >900px

  const getLayout = (): Layout => {
    if (isMobile) {
      return "mobile";
    }

    if (isTablet) {
      return "tablet";
    }

    return "desktop";
  };

  return { layout: getLayout(), isMobile, isTablet, isDesktop };
}
