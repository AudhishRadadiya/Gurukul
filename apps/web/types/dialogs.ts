import type { ReactNode } from "react";

export type DialogTypes =
  | "add"
  | "edit"
  | "delete"
  | "history"
  | "clone"
  | "addTemplate"
  | "deleteTemplate"
  | "editTemplate"
  | "saveAsDraft"
  | "saveTemplate"
  | "viewAttachment"
  | "AddressBook"
  | "DialogTypes"
  | "receiptEntry"
  | "columnChooser";

export type DialogRenderer = { [key in DialogTypes]?: ReactNode };
