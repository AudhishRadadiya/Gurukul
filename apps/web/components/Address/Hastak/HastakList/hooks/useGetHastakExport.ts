import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { WEB_USER_HASTAK_LIST_ROUTES } from "@web/constants/routes/hastak_list/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { hastakKeys } from "@web/queryKeysFactories/hastak";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";
import type { FilType, GetListArgsAg2 } from "@web/types/shared-types";

type GetHastakExportPayload = {
  url: string;
};

export type GetHastakExportApiSuccessResponse =
  ApiSuccessResponse<GetHastakExportPayload>;

type ExportMutationVariables = {
  body?: GetListArgsAg2;
  fileType: FilType;
};

type UseGetHastakExportArgs = {
  options?: UseMutationOptions<
    GetHastakExportApiSuccessResponse,
    ApiErrorResponse<GetHastakExportPayload>,
    ExportMutationVariables
  >;
};

export function useGetHastakExport({
  options = {},
}: UseGetHastakExportArgs = {}) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ body, fileType }: ExportMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetHastakExportApiSuccessResponse>(
          WEB_USER_HASTAK_LIST_ROUTES.post(fileType),
          body
        );

      return data;
    },
    mutationKey: hastakKeys.export(),
    ...options,
  });
}
