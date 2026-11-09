import { useState } from "react";
import type { UseFieldArrayReplace } from "react-hook-form";

import type { EventContactGroupFormFieldValues } from "@web/components/Event/eventContactGroup/Dialogs/EventContactGroupForm";
import { mapContactDetailExcelRowsToContactDetails } from "@web/components/Event/eventContactGroup/EventContactDetailFields/hooks/mapContactDetailExcelRows";
import type { ContactDetailExcelImportRow } from "@web/components/Event/eventContactGroup/EventContactDetailFields/hooks/useContactDetailImport";

type ExcelImportDataState = {
  rows: ContactDetailExcelImportRow[];
  titles: string[];
};

const initialExcelImportData: ExcelImportDataState = {
  rows: [],
  titles: [],
};

type UseContactDetailExcelImportArgs = {
  replaceContactDetails: UseFieldArrayReplace<
    EventContactGroupFormFieldValues,
    "contact_detail"
  >;
};

export function useContactDetailExcelImport({
  replaceContactDetails,
}: UseContactDetailExcelImportArgs) {
  const [excelImportData, setExcelImportData] = useState<ExcelImportDataState>(
    initialExcelImportData
  );

  const handleExcelImportData = (data: ExcelImportDataState) => {
    setExcelImportData(data);

    const contactDetails = mapContactDetailExcelRowsToContactDetails(data.rows);

    if (contactDetails.length) {
      replaceContactDetails(contactDetails);
    }
  };

  return {
    excelImportData,
    setExcelImportData: handleExcelImportData,
  };
}
