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

type AddTrustApiSuccessResponse = ApiSuccessResponse<Trust>;

type UseAddTrustArgs = {
  options: UseMutationOptions<
    AddTrustApiSuccessResponse,
    ApiErrorResponse,
    Partial<TrustMasterFormFieldValues>
  >;
};

export function useAddTrustMaster({ options = {} }: UseAddTrustArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddTrustApiSuccessResponse>(
        TRUST_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: trustKeys.add(),
    ...options,
  });
}
