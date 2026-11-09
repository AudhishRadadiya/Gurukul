import { SvgArrival, SvgUser, SvgVerifiedUser } from "@codezee/sixtify-brahma";
import { alpha, useTheme } from "@mui/material";

import {
  NEW_CONTACT,
  PENDING_ADDRESS,
  TOTAL_DONATION_AMOUNT,
} from "@web/components/common/hooks/constant";
import type { DashboardKey } from "@web/components/Dashboard/DashboardCards/hooks/useGetDashboardCards";

export const useDashboardMapping = () => {
  const theme = useTheme();

  const { butterflyBlue, darkOrchid, deepAqua, violet } =
    theme.palette.app.color;

  const dashboardCardLabelMapping = {
    [NEW_CONTACT]: "New Contact",
    [PENDING_ADDRESS]: "Pending Address",
    [TOTAL_DONATION_AMOUNT]: "Total Donation Amount",
  };

  const dashboardMapping: Record<
    DashboardKey,
    { bgColor: string; icon: JSX.Element; label: string }
  > = {
    new_contact_count: {
      bgColor: alpha(darkOrchid[50], 0.5),
      icon: <SvgUser fill={violet[500]} />,
      label: dashboardCardLabelMapping[NEW_CONTACT],
    },
    pending_address: {
      bgColor: alpha(butterflyBlue[600], 0.5),
      icon: <SvgVerifiedUser fill={butterflyBlue[50]} />,
      label: dashboardCardLabelMapping[PENDING_ADDRESS],
    },
    total_donation_amount: {
      bgColor: alpha(deepAqua[600], 0.5),
      icon: <SvgArrival fill={deepAqua[900]} />,
      label: dashboardCardLabelMapping[TOTAL_DONATION_AMOUNT],
    },
  };

  return { dashboardMapping };
};
