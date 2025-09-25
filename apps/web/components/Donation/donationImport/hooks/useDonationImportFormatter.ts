import { useMemo } from "react";

import type { DonationFieldMetaData } from "@web/components/Donation/donationImport/DonationImport";
import type { DonationImportDetails } from "@web/components/Donation/donationImport/hooks/useDonationImport";

export const useDonationImportFormatter = (
  importDonationFieldMetadata: DonationFieldMetaData[]
) => {
  const importDonationMappingData = useMemo(() => {
    return Object.fromEntries(
      importDonationFieldMetadata.map((item) => [item.db_field_name, item])
    );
  }, []);

  const formatFieldValueByType = (
    value: DonationImportDetails[keyof DonationImportDetails],
    fieldInfo: DonationFieldMetaData
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    const dataType = fieldInfo.data_type;

    if (dataType === "string") {
      if (typeof value === "string") {
        return fieldInfo.template_field_name.toLowerCase() === "email"
          ? value.trim().toLowerCase() || ""
          : value.trim() || "";
      }

      if (typeof value === "number") {
        return value.toString();
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

  const transformDonationImportRow = (row: DonationImportDetails) => {
    return Object.fromEntries(
      Object.entries(row)
        .filter(([key]) => !!importDonationMappingData[key])
        .map(([key, value]) => {
          const fieldInfo = importDonationMappingData[key];

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
    transformDonationImportRow,
  };
};
