import { useMemo } from "react";

import type { AddressFieldMetaData } from "@web/components/Address/addressImport/AddressImport";
import type { AddressImportDetails } from "@web/components/Address/addressImport/hooks/useAddressImport";

export const useAddressImportFormatter = (
  importAddressFieldMetadata: AddressFieldMetaData[]
) => {
  const importAddressMappingData = useMemo(() => {
    return Object.fromEntries(
      importAddressFieldMetadata.map((item) => [item.db_field_name, item])
    );
  }, []);

  const formatFieldValueByType = (
    value: AddressImportDetails[keyof AddressImportDetails],
    fieldInfo: AddressFieldMetaData
  ): string | boolean | number => {
    const dataType = fieldInfo.data_type;

    if (dataType === "string") {
      if (typeof value === "string") {
        return fieldInfo.template_field_name.toLowerCase() === "email"
          ? value.trim().toLowerCase() || ""
          : value.trim() || "";
      }

      if (typeof value === "number") {
        return String(value);
      }

      return "";
    }

    if (dataType === "boolean") {
      if (typeof value === "string") {
        return value.toLowerCase() === "yes";
      }

      return Boolean(value);
    }

    if (dataType === "number") {
      return Number(value);
    }

    return "";
  };

  const transformAddressImportRow = (row: AddressImportDetails) => {
    return Object.fromEntries(
      Object.entries(row)
        .filter(([key]) => !!importAddressMappingData[key])
        .map(([key, value]) => {
          const fieldInfo = importAddressMappingData[key];

          if (fieldInfo) {
            return [
              fieldInfo.db_field_name,
              formatFieldValueByType(value, fieldInfo),
            ];
          }

          return [];
        })
    );
  };

  return {
    formatFieldValueByType,
    transformAddressImportRow,
  };
};
