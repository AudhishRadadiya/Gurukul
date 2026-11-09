import { type ReactNode, useState } from "react";
import type { OnAction } from "../types";

export type DialogTypes =
  | "add"
  | "edit"
  | "delete"
  | "viewAttachment"
  | "deleteTemplate"
  | "editTemplate"
  | "addTemplate"
  | "addAuto"
  | "addDepartment"
  | "addBusinessDetail"
  | "addWorkType"
  | "addSubDepartment"
  | "addDocument"
  | "addGrade"
  | "bulkMail"
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
  | "addFamilyMember"
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
  | "confirmation"
  | "columnChooser"
  | "hastakHistory"
  | "donarHistory"
  | "receiptEntry"
  | "rejectBulkOvertime"
  | "exportOptions"
  | "printAddressBookOptions"
  | "cancelDonationEntryConfirmation"
  | "addEventDropdown"
  | "donationReceipt"
  | "donationLetter"
  | "clone"
  | "createContact";

export type DialogRenderer = { [key in DialogTypes]?: ReactNode };

export type UseDialogActionsFns = {
  onDialogOpen: (config: DialogTypes) => void;
  onDialogClose: OnAction;
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
