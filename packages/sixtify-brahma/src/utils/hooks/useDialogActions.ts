import { type ReactNode, useState } from "react";

export type DialogTypes =
  | "add"
  | "edit"
  | "delete"
  | "viewAttachment"
  | "deleteTemplate"
  | "editTemplate"
  | "addTemplate"
  | "addDepartment"
  | "addWorkType"
  | "addSubDepartment"
  | "addDocument"
  | "addGrade"
  | "addSkillType"
  | "addDesignation"
  | "cancel"
  | "saveAsDraft"
  | "history"
  | "view"
  | "action"
  | "updateShift"
  | "updateWeeklyOff"
  | "updateHoliday"
  | "configureLeave"
  | "approve"
  | "reject"
  | "cancelled"
  | "formulaBuilderDialog"
  | "revise"
  | "manageEmployeeAccess"
  | "saveTemplate"
  | "confirm"
  | "reset"
  | "addExistingEmployee"
  | "reviewAllEmployees"
  | "eligibleEmployees"
  | "saveAsDefault"
  | "bankRegister"
  | "applyLeave"
  | "providentFundReport"
  | "esicReport"
  | "professionalTaxReport"
  | "incomeTaxReport"
  | "lwfReport"
  | "approveOvertime"
  | "rejectOvertime"
  | "approveExit"
  | "rejectExit"
  | "approveLoan"
  | "rejectLoan"
  | "approveSalary"
  | "rejectSalary"
  | "approveBulkLeave"
  | "rejectBulkLeave"
  | "approveBulkOvertime"
  | "rejectBulkOvertime"
  | "addFamilyMember"
  | "columnChooser"
  | "bulkMail"
  | "confirmation"
  | "donarHistory"
  | "hastakHistory"
  | "receiptEntry"
  | "addBusinessDetail";

export type DialogRenderer = { [key in DialogTypes]?: ReactNode };

export type UseDialogActionsFns = {
  onDialogOpen: (config: DialogTypes) => void;
  onDialogClose: () => void;
};

export function useDialogActions() {
  const [openedDialog, setOpenedDialog] = useState<DialogTypes>();

  const onDialogOpen = (dialogTypes: DialogTypes) =>
    setOpenedDialog(dialogTypes);

  const onDialogClose = () => setOpenedDialog(undefined);

  return {
    onDialogClose,
    onDialogOpen,
    openedDialog,
  };
}
