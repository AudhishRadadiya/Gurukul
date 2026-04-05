import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { PARAMETER_ROUTES } from "@web/constants/routes/master_type/parameter/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { masterEntryKeys } from "@web/queryKeysFactories/masterEntry";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type DeleteMasterEntryApiResponse = ApiSuccessResponse<null>;

type UseDeleteMasterEntryArgs = {
  masterParameterId: string;
  options: UseMutationOptions<DeleteMasterEntryApiResponse, ApiErrorResponse>;
};

export function useDeleteMasterEntry({
  masterParameterId,
  options = {},
}: UseDeleteMasterEntryArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteMasterEntryApiResponse>(
        PARAMETER_ROUTES.delete(masterParameterId)
      );

      return data;
    },
    mutationKey: masterEntryKeys.delete(masterParameterId),
    ...options,
  });
}
