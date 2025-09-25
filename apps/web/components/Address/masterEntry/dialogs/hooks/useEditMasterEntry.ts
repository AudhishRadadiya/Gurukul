import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { MasterEntryFormFieldValues } from "@web/components/Address/masterEntry/dialogs/MasterEntryForm";
import type { MasterParameterDetails } from "@web/components/Address/masterEntry/masterEntryList/hooks/useGetMasterEntry";
import { PARAMETER_ROUTES } from "@web/constants/routes/master_type/parameter/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { masterEntryKeys } from "@web/queryKeysFactories/masterEntry";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type EdiMasterEntryApiResponse = ApiSuccessResponse<MasterParameterDetails>;

type UseEdiMasterEntryArgs = {
  masterParameterId: string;
  options: UseMutationOptions<
    EdiMasterEntryApiResponse,
    ApiErrorResponse<MasterEntryFormFieldValues>,
    Partial<MasterEntryFormFieldValues>
  >;
};

export function useEditMasterEntry({
  masterParameterId,
  options = {},
}: UseEdiMasterEntryArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EdiMasterEntryApiResponse>(
        PARAMETER_ROUTES.patch(masterParameterId),
        formValues
      );

      return data;
    },
    mutationKey: masterEntryKeys.edit(masterParameterId),
    ...options,
  });
}
