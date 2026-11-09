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

export type GetDashboardAnniversariesExportApiSuccessResponse =
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

type UseGetDashboardAnniversariesExportArgs = {
  options: UseMutationOptions<
    GetDashboardAnniversariesExportApiSuccessResponse,
    ApiErrorResponse<GetExportPayload>,
    ExportMutationVariables
  >;
};

export function useGetDashboardAnniversariesExport({
  options = {},
}: UseGetDashboardAnniversariesExportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ body, fileType }: ExportMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetDashboardAnniversariesExportApiSuccessResponse>(
          DASHBOARD_ROUTES.dashboardAnniversariesExport(fileType),
          body
        );

      return data;
    },
    mutationKey: dashboardKeys.dashboardAnniversariesExport(),
    ...options,
  });
}
