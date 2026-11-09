import { Stack } from "@mui/material";

import { DashboardAnniversariesList } from "@web/components/Dashboard/DashboardTodayActivity/AnniversariesList/DashboardAnniversariesList";
import { DashboardBirthdaysList } from "@web/components/Dashboard/DashboardTodayActivity/BirthdaysList/DashboardBirthdaysList";
import { ANNIVERSARY_LIST_PERMISSION } from "@web/constants/permission/dashboard/anniversaryList/permission";
import { BIRTHDAY_LIST_PERMISSION } from "@web/constants/permission/dashboard/birthdayList/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";

export type DesignationWiseAttendanceListRef = {
  exportDesignationWiseAttendanceListExcel: () => void;
  exportDesignationWiseAttendanceListPDF: () => void;
};

type DashboardTodayActivityArgs = {
  branchIds: string;
};

export const DashboardTodayActivity = ({
  branchIds,
}: DashboardTodayActivityArgs) => {
  const { validateAccess } = useUserPermissions();

  return (
    <Stack
      direction={{ lg: "row", md: "column", sm: "column", xs: "column" }}
      gap={{ sm: "10px", xs: "12px" }}
    >
      <PermissionGuard
        canAccess={validateAccess(ANNIVERSARY_LIST_PERMISSION.MENU)}
      >
        <DashboardAnniversariesList branchIds={branchIds} />
      </PermissionGuard>

      <PermissionGuard
        canAccess={validateAccess(BIRTHDAY_LIST_PERMISSION.MENU)}
      >
        <DashboardBirthdaysList branchIds={branchIds} />
      </PermissionGuard>
    </Stack>
  );
};
