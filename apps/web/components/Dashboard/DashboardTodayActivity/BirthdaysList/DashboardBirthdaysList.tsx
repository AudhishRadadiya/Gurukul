import {
  AgGrid,
  ContentBox,
  DatePicker,
  PadBox,
  toasts,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { DateTime } from "luxon";

import { DataExport } from "@web/components/common/DataExport/DataExport";
import { TODAY } from "@web/components/common/hooks/constant";
import { useDashboardBirthdaysColumns } from "@web/components/Dashboard/DashboardTodayActivity/BirthdaysList/hooks/useDashboardBirthdaysColumns";
import type { GetDashboardBirthdaysExportApiSuccessResponse } from "@web/components/Dashboard/DashboardTodayActivity/BirthdaysList/hooks/useGetDashboardBirthdaysExport";
import { useGetDashboardBirthdaysExport } from "@web/components/Dashboard/DashboardTodayActivity/BirthdaysList/hooks/useGetDashboardBirthdaysExport";
import {
  type DashboardBirthdaysList as DashboardBirthdaysListType,
  useGetDashboardBirthdaysList,
} from "@web/components/Dashboard/DashboardTodayActivity/BirthdaysList/hooks/useGetDashboardBirthdaysList";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { AgDataWithActions } from "@web/types/agGrid";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

type DashboardBirthdaysListProps = {
  branchIds: string;
};

export const DashboardBirthdaysList = ({
  branchIds,
}: DashboardBirthdaysListProps) => {
  const { allowPrintExport } = useUserPermissions();

  const { column } = useDashboardBirthdaysColumns();

  const { control: dateControl, fromDate, toDate } = useDateFilters(TODAY);

  const { data, isLoading } = useGetDashboardBirthdaysList({
    branch_id: [branchIds],
    from_date: fromDate,
    to_date: toDate,
  });

  const { celebrations } = data;

  const { mutate } = useGetDashboardBirthdaysExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetDashboardBirthdaysExportApiSuccessResponse) => {
        window.open(data.url, "_blank");

        toasts.success({ title: message });
      },
    },
  });

  const onExport = (fileType: FilType) => {
    mutate({
      body: {
        branch_id: [branchIds],
        from_date: fromDate,
        to_date: toDate,
      },
      fileType,
    });
  };

  return (
    <Box flex={1}>
      <ContentBox>
        <PadBox padding={{ padding: { sm: "10px", xs: "12px" } }}>
          <Stack gap="10px">
            <Stack
              direction={{ sm: "row", xs: "column" }}
              gap="10px"
              alignItems={{ sm: "center", xs: "stretch" }}
              justifyContent="space-between"
              width="100%"
            >
              <Typography
                variant="body1"
                fontWeight={500}
                sx={{ flexShrink: 0 }}
              >
                {t("today.birthdays.label")}
              </Typography>

              <Stack
                direction={{ sm: "row", xs: "column" }}
                gap="10px"
                alignItems={{ sm: "center", xs: "stretch" }}
                width={{ sm: "auto", xs: "100%" }}
              >
                <DatePicker
                  control={dateControl}
                  name="from_date"
                  clearable={false}
                  containerProps={{
                    maxWidth: { sm: "170px", xs: "100%" },
                    width: "100%",
                  }}
                />

                <DatePicker
                  control={dateControl}
                  name="to_date"
                  minDate={
                    fromDate ? DateTime.fromISO(fromDate) : DateTime.now()
                  }
                  clearable={false}
                  containerProps={{
                    maxWidth: { sm: "170px", xs: "100%" },
                    width: "100%",
                  }}
                />

                <PermissionGuard canAccess={allowPrintExport}>
                  <Box
                    sx={{
                      alignSelf: { sm: "center", xs: "flex-end" },
                      flexShrink: 0,
                    }}
                  >
                    <DataExport onExport={onExport} />
                  </Box>
                </PermissionGuard>
              </Stack>
            </Stack>

            <AgGrid<AgDataWithActions<DashboardBirthdaysListType>>
              columnDefs={column}
              height="40vh"
              rowData={celebrations}
              headerHeight={50}
              loading={isLoading}
              rowModelType="clientSide"
            />
          </Stack>
        </PadBox>
      </ContentBox>
    </Box>
  );
};
