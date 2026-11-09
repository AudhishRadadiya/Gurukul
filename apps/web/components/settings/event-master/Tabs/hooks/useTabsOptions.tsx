import { type TabsItems } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";

export const categories = {
  active: "Active",
  inactive: "InActive",
};

export type OptionKey = keyof typeof categories;

export const eventMasterOptionTabs: OptionKey[] = ["active", "inactive"];

export const useTabOptions = () => {
  const router = useRouter();

  const menuItems: TabsItems[] = [
    {
      isView: true,
      label: categories.active,
      onClick: () => {
        router.push("/settings/event-master?tab=active");
      },
      value: "active",
    },
    {
      isView: true,
      label: categories.inactive,
      onClick: () => {
        router.push("/settings/event-master?tab=inactive");
      },
      value: "inactive",
    },
  ];

  return { menuItems };
};

