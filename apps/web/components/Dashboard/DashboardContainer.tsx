import { Stack } from "@mui/material";

import { DashboardCardSummaryGrid } from "@web/components/Dashboard/DashboardCards/DashboardCardSummaryGrid";
import { DashboardCharts } from "@web/components/Dashboard/DashboardCharts/DashboardCharts";
import { DashboardTodayActivity } from "@web/components/Dashboard/DashboardTodayActivity/DashboardTodayActivity";
import { TOTAL_CARD_COUNT_PERMISSION } from "@web/constants/permission/dashboard/totalCardCount/permission";
import { TRUST_WISE_CHART_PERMISSION } from "@web/constants/permission/dashboard/trustWiseChart/permission";
import { useBranch } from "@web/context/BranchContext";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";

export const DashboardContainer = () => {
  const { branchIds } = useBranch();

  const { validateAccess } = useUserPermissions();

  return (
    <Stack gap="10px">
      <PermissionGuard
        canAccess={validateAccess(TOTAL_CARD_COUNT_PERMISSION.MENU)}
      >
        <DashboardCardSummaryGrid branchIds={branchIds} />
      </PermissionGuard>

      <PermissionGuard
        canAccess={validateAccess(TRUST_WISE_CHART_PERMISSION.MENU)}
      >
        <DashboardCharts branchIds={branchIds} />
      </PermissionGuard>

      <DashboardTodayActivity branchIds={branchIds} />
    </Stack>
  );
};
