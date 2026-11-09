import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";

import { DASHBOARD_ROUTES } from "@web/constants/routes/dashboard/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { dashboardKeys } from "@web/queryKeysFactories/dashboard";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";
import type { FilType, GetExportPayload } from "@web/types/shared-types";

export type GetDashboardBirthdaysExportApiSuccessResponse =
  ApiSuccessResponse<GetExportPayload>;

type ExportMutationVariables = {
  body?:
    | IGetRowsParams
    | Partial<{
        branch_id: string[];
        externalFilter: FieldValues;
        from_date: string;
        to_date: string;
      }>;
  fileType: FilType;
};

type UseGetDashboardBirthdaysExportArgs = {
  options: UseMutationOptions<
    GetDashboardBirthdaysExportApiSuccessResponse,
    ApiErrorResponse<GetExportPayload>,
    ExportMutationVariables
  >;
};

export function useGetDashboardBirthdaysExport({
  options = {},
}: UseGetDashboardBirthdaysExportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ body, fileType }: ExportMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetDashboardBirthdaysExportApiSuccessResponse>(
          DASHBOARD_ROUTES.dashboardBirthdaysExport(fileType),
          body
        );

      return data;
    },
    mutationKey: dashboardKeys.dashboardBirthdaysExport(),
    ...options,
  });
}
