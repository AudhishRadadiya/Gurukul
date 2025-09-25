import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { SuvicharMasterFormFieldValues } from "@web/components/Donation/suvicharMaster/dialogs/SuvicharMasterForm";
import { SUVICHAR_MASTER_ROUTES } from "@web/constants/routes/suvichar_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { suvicharMasterKeys } from "@web/queryKeysFactories/suvicharMaster";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseAddSuvicharMasterArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<SuvicharMasterFormFieldValues>,
    Partial<SuvicharMasterFormFieldValues>
  >;
};

export function useAddSuvicharMaster({
  options = {},
}: UseAddSuvicharMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        SUVICHAR_MASTER_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: suvicharMasterKeys.add(),
    ...options,
  });
}
