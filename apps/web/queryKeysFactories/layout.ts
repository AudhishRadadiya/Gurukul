import type { UseDeleteLayoutArgs } from "@web/components/Address/address-book/template/dialogs/hooks/useDeleteLayout";
import type { UseGetLayoutListArgs } from "@web/components/Address/address-book/template/dialogs/hooks/useGetLayoutList";

export const layoutKeys = {
  add: () => [...layoutKeys.all, "add"] as const,

  all: ["layout"] as const,

  delete: (layoutId: UseDeleteLayoutArgs["layoutId"]) =>
    [...layoutKeys.all, "delete", layoutId] as const,

  edit: (layoutId: UseDeleteLayoutArgs["layoutId"]) =>
    [...layoutKeys.all, "edit", layoutId] as const,

  listing: (body: UseGetLayoutListArgs) => {
    return [...layoutKeys.all, "listing", body] as const;
  },
} as const;
