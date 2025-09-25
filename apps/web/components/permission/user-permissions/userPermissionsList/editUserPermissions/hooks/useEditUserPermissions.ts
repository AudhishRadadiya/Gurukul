"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { RolesPermissionsFormFieldValues } from "@web/components/permission/RolesPermissionsForm";
import { USER_PERMISSIONS_ROUTES } from "@web/constants/routes/user/permissions/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { userPermissionsKeys } from "@web/queryKeysFactories/userPermissions";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseEditUserPermissionsArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<RolesPermissionsFormFieldValues>,
    Partial<RolesPermissionsFormFieldValues>
  >;
  userId: string;
};

export function useEditUserPermissions({
  options = {},
  userId,
}: UseEditUserPermissionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EmptyApiSuccessResponse>(
        USER_PERMISSIONS_ROUTES.patch(userId),
        formValues
      );

      return data;
    },
    mutationKey: userPermissionsKeys.edit(userId),
    ...options,
  });
}
