import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { TrustMasterFormFieldValues } from "@web/components/settings/trust-master/AddTrustMaster/TrustMasterForm";
import type { Trust } from "@web/components/settings/trust-master/TrustMasterList/hooks/useGetTrustMaster";
import { TRUST_ROUTES } from "@web/constants/routes/trust/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { trustKeys } from "@web/queryKeysFactories/trust";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type EditTrustMasterApiResponse = ApiSuccessResponse<Trust>;

type UseEditTrustMasterArgs = {
  options: UseMutationOptions<
    EditTrustMasterApiResponse,
    ApiErrorResponse<TrustMasterFormFieldValues>,
    Partial<TrustMasterFormFieldValues>
  >;
  trustMasterId: string;
};

export function useEditTrustMaster({
  options = {},
  trustMasterId,
}: UseEditTrustMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditTrustMasterApiResponse>(
        TRUST_ROUTES.patch(trustMasterId),
        formValues
      );

      return data;
    },
    mutationKey: trustKeys.edit(trustMasterId),
    ...options,
  });
}
