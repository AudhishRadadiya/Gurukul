import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { SUVICHAR_MASTER_ROUTES } from "@web/constants/routes/suvichar_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { suvicharMasterKeys } from "@web/queryKeysFactories/suvicharMaster";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseDeleteSuvicharMasterArgs = {
  options: UseMutationOptions<EmptyApiSuccessResponse, ApiErrorResponse>;
  suvicharId: string;
};

export function useDeleteSuvicharMaster({
  options = {},
  suvicharId,
}: UseDeleteSuvicharMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<EmptyApiSuccessResponse>(
        SUVICHAR_MASTER_ROUTES.delete(suvicharId)
      );

      return data;
    },
    mutationKey: suvicharMasterKeys.delete(suvicharId),
    ...options,
  });
}
