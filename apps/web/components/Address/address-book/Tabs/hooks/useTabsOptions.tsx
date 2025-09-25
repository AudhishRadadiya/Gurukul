import { type TabsItems } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";

export const categories = {
  "address-list": "Address List",
  "business-detail": "Business Detail",
  "family-member": "Family Member List",
};

export type OptionKey = keyof typeof categories;

export const addressBookOptionTabs: OptionKey[] = [
  "address-list",
  "family-member",
  "business-detail",
];

export const useTabOptions = () => {
  const router = useRouter();

  const menuItems: TabsItems[] = [
    {
      isView: true,
      label: categories["address-list"],
      onClick: () => {
        router.push("/address/address-book?tab=address-list");
      },
      value: "address-list",
    },
    {
      isView: true,
      label: categories["family-member"],
      onClick: () => {
        router.push("/address/address-book?tab=family-member");
      },
      value: "family-member",
    },
    {
      isView: true,
      label: categories["business-detail"],
      onClick: () => {
        router.push("/address/address-book?tab=business-detail");
      },
      value: "business-detail",
    },
  ];

  return { menuItems };
};
