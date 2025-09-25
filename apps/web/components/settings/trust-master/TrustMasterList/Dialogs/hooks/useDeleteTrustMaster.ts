import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { Trust } from "@web/components/settings/trust-master/TrustMasterList/hooks/useGetTrustMaster";
import { TRUST_ROUTES } from "@web/constants/routes/trust/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { trustKeys } from "@web/queryKeysFactories/trust";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type DeleteTrustMasterApiResponse = ApiSuccessResponse<Trust>;

type UseDeleteTrustMasterArgs = {
  options: UseMutationOptions<DeleteTrustMasterApiResponse, ApiErrorResponse>;
  trustId: string;
};

export function useDeleteTrustMaster({
  options = {},
  trustId,
}: UseDeleteTrustMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteTrustMasterApiResponse>(
        TRUST_ROUTES.delete(trustId)
      );

      return data;
    },
    mutationKey: trustKeys.delete(trustId),
    ...options,
  });
}
