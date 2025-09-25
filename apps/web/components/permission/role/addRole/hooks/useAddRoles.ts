import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { RolesPermissionsFormFieldValues } from "@web/components/permission/RolesPermissionsForm";
import { ROLE_ROUTES } from "@web/constants/routes/role/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { roleKeys } from "@web/queryKeysFactories/role";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseAddRolesArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse,
    Partial<RolesPermissionsFormFieldValues>
  >;
};

export function useAddRoles({ options = {} }: UseAddRolesArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        ROLE_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: roleKeys.add(),
    ...options,
  });
}
