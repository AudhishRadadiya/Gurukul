import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { UseDeleteLayoutArgs } from "@web/components/Address/address-book/template/dialogs/hooks/useDeleteLayout";
import type { TemplateFormFieldValues } from "@web/components/Address/address-book/template/dialogs/TemplateForm";
import { LIST_LAYOUT_ROUTES } from "@web/constants/routes/list_layout/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { layoutKeys } from "@web/queryKeysFactories/layout";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

export type EditLayoutRequest = {
  fields: Record<string, boolean>;
  is_default: boolean;
  layout_name?: TemplateFormFieldValues["template_name"];
};

type UseEditLayoutArgs = {
  layoutId: UseDeleteLayoutArgs["layoutId"];
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse,
    EditLayoutRequest
  >;
};

export function useEditLayout({ layoutId, options = {} }: UseEditLayoutArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EmptyApiSuccessResponse>(
        LIST_LAYOUT_ROUTES.patch(layoutId),
        formValues
      );

      return data;
    },
    mutationKey: layoutKeys.edit(layoutId),
    ...options,
  });
}
