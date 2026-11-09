import type { EventContactGroup } from "@web/components/Event/eventContactGroup/EventContactGroupList/hooks/useGetEventContactGroup";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useEventContactGroupColumns = () => {
  const column: AgColumnsWithActions<EventContactGroup> = [
    {
      field: "group_name",
      headerName: "Group Name",
    },
  ];

  return { column };
};
