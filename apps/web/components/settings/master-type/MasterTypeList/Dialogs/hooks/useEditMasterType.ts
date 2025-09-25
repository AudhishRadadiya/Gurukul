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

export type EditMasterTypeApiResponse = ApiSuccessResponse<null>;

type UseEditMasterTypeArgs = {
  masterTypeId: string;
  options: UseMutationOptions<
    EditMasterTypeApiResponse,
    ApiErrorResponse<MasterTypeFormFieldValues>,
    Partial<MasterTypeFormFieldValues>
  >;
};

export function useEditMasterType({
  masterTypeId,
  options = {},
}: UseEditMasterTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditMasterTypeApiResponse>(
        MASTER_TYPE_ROUTES.patch(masterTypeId),
        formValues
      );

      return data;
    },
    mutationKey: masterTypeKeys.edit(masterTypeId),
    ...options,
  });
}
