"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { ModuleName } from "@web/components/Address/address-book/template/dialogs/hooks/useGetLayoutList";
import type { TemplateFormFieldValues } from "@web/components/Address/address-book/template/dialogs/TemplateForm";
import { LIST_LAYOUT_ROUTES } from "@web/constants/routes/list_layout/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { layoutKeys } from "@web/queryKeysFactories/layout";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

export type AddLayoutRequest = {
  fields: Record<string, boolean>;
  is_default: boolean;
  layout_name?: TemplateFormFieldValues["template_name"];
  module_name: ModuleName;
};

type UseAddLayoutArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse,
    AddLayoutRequest
  >;
};

export function useAddLayout({ options = {} }: UseAddLayoutArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        LIST_LAYOUT_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: layoutKeys.add(),
    ...options,
  });
}
