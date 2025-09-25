import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { MasterTypeFormFieldValues } from "@web/components/settings/master-type/Dialogs/MasterTypeFrom";
import { MASTER_TYPE_ROUTES } from "@web/constants/routes/master_type/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { masterTypeKeys } from "@web/queryKeysFactories/masterType";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

export type AddMasterTypeApiSuccessResponse = ApiSuccessResponse<null>;

type UseAddMasterTypeArgs = {
  options: UseMutationOptions<
    AddMasterTypeApiSuccessResponse,
    ApiErrorResponse<MasterTypeFormFieldValues>,
    Partial<MasterTypeFormFieldValues>
  >;
};

export function useAddMasterType({ options = {} }: UseAddMasterTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddMasterTypeApiSuccessResponse>(
        MASTER_TYPE_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: masterTypeKeys.add(),
    ...options,
  });
}
