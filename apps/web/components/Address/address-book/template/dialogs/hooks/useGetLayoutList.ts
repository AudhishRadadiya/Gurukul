"use client";

import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import { LIST_LAYOUT_ROUTES } from "@web/constants/routes/list_layout/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { layoutKeys } from "@web/queryKeysFactories/layout";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

export const DEFAULT_SELECTED_TEMPLATE = "All";

export const DEFAULT_ALL_TEMPLATE = [
  {
    label: DEFAULT_SELECTED_TEMPLATE,
    value: uuidv4(),
  },
];

export type ModuleName =
  | "donation_list"
  | "address_list"
  | "family_member_list"
  | "business_list";

export type UseGetLayoutListArgs = {
  moduleName: ModuleName;
};

export type LayoutTemplate = {
  columns: Record<string, boolean>;
  is_default: boolean;
  layout_name: string;
  module_name: string;
  scale: string;
  template_id: string;
  template_name: string;
  user_id: string;
};

export function useGetLayoutList({ moduleName }: UseGetLayoutListArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLayoutData = async () => {
    const {
      data: { data },
    } = await axiosPrivate.post<ApiSuccessResponse<LayoutTemplate[]>>(
      LIST_LAYOUT_ROUTES.listing,
      {
        module_name: moduleName,
      }
    );

    return data;
  };

  return useQuery({
    enabled: !!moduleName,
    queryFn: () => fetchLayoutData(),
    queryKey: layoutKeys.listing({ moduleName }),
  });
}
