import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export type Layout = "mobile" | "tablet" | "desktop";

export function useGetDeviceType(): { layout: Layout } {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600px

  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600–900px

  if (isMobile) {
    return { layout: "mobile" };
  }

  if (isTablet) {
    return { layout: "tablet" };
  }

  return { layout: "desktop" };
}
