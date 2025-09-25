import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { MasterEntryFormFieldValues } from "@web/components/Address/masterEntry/dialogs/MasterEntryForm";
import { PARAMETER_ROUTES } from "@web/constants/routes/master_type/parameter/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { masterEntryKeys } from "@web/queryKeysFactories/masterEntry";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

export type AddMasterEntryApiSuccessResponse = ApiSuccessResponse<null>;

type UseAddMasterEntryArgs = {
  options: UseMutationOptions<
    AddMasterEntryApiSuccessResponse,
    ApiErrorResponse<MasterEntryFormFieldValues>,
    Partial<MasterEntryFormFieldValues>
  >;
};

export function useAddMasterEntry({ options = {} }: UseAddMasterEntryArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddMasterEntryApiSuccessResponse>(
          PARAMETER_ROUTES.post,
          formValues
        );

      return data;
    },
    mutationKey: masterEntryKeys.add(),
    ...options,
  });
}
