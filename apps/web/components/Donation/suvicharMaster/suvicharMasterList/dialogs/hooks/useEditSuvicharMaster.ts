import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { SuvicharMasterFormFieldValues } from "@web/components/Donation/suvicharMaster/dialogs/SuvicharMasterForm";
import { SUVICHAR_MASTER_ROUTES } from "@web/constants/routes/suvichar_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { suvicharMasterKeys } from "@web/queryKeysFactories/suvicharMaster";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseEditSuvicharMasterArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<SuvicharMasterFormFieldValues>,
    Partial<SuvicharMasterFormFieldValues>
  >;
  suvicharId: string;
};

export function useEditSuvicharMaster({
  options = {},
  suvicharId,
}: UseEditSuvicharMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EmptyApiSuccessResponse>(
        SUVICHAR_MASTER_ROUTES.patch(suvicharId),
        formValues
      );

      return data;
    },
    mutationKey: suvicharMasterKeys.edit(suvicharId),
    ...options,
  });
}
