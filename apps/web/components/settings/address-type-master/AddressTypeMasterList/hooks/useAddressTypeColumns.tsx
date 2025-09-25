import type { AddressType } from "@web/components/settings/address-type-master/AddressTypeMasterList/hooks/useGetAddressTypeMaster";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useAddressTypeColumns = () => {
  const column: AgColumnsWithActions<AddressType> = [
    {
      field: "address_type",
      headerName: "Address Type",
    },
  ];

  return { column };
};
