"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { RolesPermissionsFormFieldValues } from "@web/components/permission/RolesPermissionsForm";
import { ROLE_ROUTES } from "@web/constants/routes/role/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { roleKeys } from "@web/queryKeysFactories/role";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseEditRolesArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<RolesPermissionsFormFieldValues>,
    Partial<RolesPermissionsFormFieldValues>
  >;
  roleId: string;
};

export function useEditRoles({ options = {}, roleId }: UseEditRolesArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EmptyApiSuccessResponse>(
        ROLE_ROUTES.patch(roleId),
        formValues
      );

      return data;
    },
    mutationKey: roleKeys.edit(roleId),
    ...options,
  });
}
