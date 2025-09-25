import type { UseDeleteLayoutArgs } from "@web/components/Address/address-book/template/dialogs/hooks/useDeleteLayout";
import { API, LIST } from "@web/constants/routes/common";

export const LIST_LAYOUT_BASE_URL = `${API}/list_layout` as const;

export const LIST_LAYOUT_ROUTES = {
  delete: (layoutId: UseDeleteLayoutArgs["layoutId"]) =>
    `${LIST_LAYOUT_BASE_URL}/${layoutId}` as const,

  listing: `${LIST_LAYOUT_BASE_URL}/${LIST}` as const,

  patch: (layoutId: UseDeleteLayoutArgs["layoutId"]) =>
    `${LIST_LAYOUT_BASE_URL}/${layoutId}` as const,

  post: `${LIST_LAYOUT_BASE_URL}` as const,
} as const;
