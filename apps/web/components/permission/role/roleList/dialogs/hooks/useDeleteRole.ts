import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { ROLE_ROUTES } from "@web/constants/routes/role/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { roleKeys } from "@web/queryKeysFactories/role";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseDeleteRoleArgs = {
  options: UseMutationOptions<EmptyApiSuccessResponse, ApiErrorResponse>;
  roleId: string;
};

export function useDeleteRole({ options = {}, roleId }: UseDeleteRoleArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<EmptyApiSuccessResponse>(
        ROLE_ROUTES.delete(roleId)
      );

      return data;
    },
    mutationKey: roleKeys.delete(roleId),
    ...options,
  });
}
