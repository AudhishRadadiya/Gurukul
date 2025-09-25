import { ADDRESS_BOOK_PERMISSION } from "@web/constants/permission/address/addressBook/permission";
import { DONAR_ADDRESS_LIST_PERMISSION } from "@web/constants/permission/address/donarAddressList/permission";
import { ADDRESS_PERMISSION } from "@web/constants/permission/address/permission";
import { CANCEL_RECEIPT_PERMISSION } from "@web/constants/permission/donation/cancelReceipt/permission";
import { CHEQUE_RECONCILIATION_PERMISSION } from "@web/constants/permission/donation/chequeReconciliation/permission";
import { DONATION_ENTRY_PERMISSION } from "@web/constants/permission/donation/donationEntry/permission";
import { DONATION_IMPORT_FROM_EXCEL_PERMISSION } from "@web/constants/permission/donation/donationImportFromExcel/permission";
import { DONATION_SUMMARY_PERMISSION } from "@web/constants/permission/donation/donationSummary/permission";
import { DONATION_PERMISSION } from "@web/constants/permission/donation/permission";
import { EVENT_DONATION_ENTRY_PERMISSION } from "@web/constants/permission/event/eventDonationEntry/permission";
import { EVENT_REMINDER_LIST_PERMISSION } from "@web/constants/permission/event/eventReminderList/permission";
import { EVENT_SUMMARY_REPORT_PERMISSION } from "@web/constants/permission/event/eventSummaryReport/permission";
import { EVENT_PERMISSION } from "@web/constants/permission/event/permission";
import { DAILY_COLLECTION_REPORT_PERMISSION } from "@web/constants/permission/report/dailyCollectionReport/permission";
import { DONATION_COLLECTION_REPORT_PERMISSION } from "@web/constants/permission/report/donationCollectionReport/permission";
import { DONATION_REPORT_PERMISSION } from "@web/constants/permission/report/donationReport/permission";
import { REPORT_PERMISSION } from "@web/constants/permission/report/permission";
import { AC_YEAR_MASTER_PERMISSION } from "@web/constants/permission/settings/acYearMaster/permission";
import { ADDRESS_TYPE_PERMISSION } from "@web/constants/permission/settings/addressType/permission";
import { BANK_MASTER_PERMISSION } from "@web/constants/permission/settings/bankMaster/permission";
import { BRANCH_MASTER_PERMISSION } from "@web/constants/permission/settings/branchMaster/permission";
import { DONATION_MASTER_PERMISSION } from "@web/constants/permission/settings/donationMaster/permission";
import { EMAIL_SETTINGS_PERMISSION } from "@web/constants/permission/settings/emailSettings/permission";
import { EVENT_MASTER_PERMISSION } from "@web/constants/permission/settings/eventMaster/permission";
import { MASTER_PARAMETER_PERMISSION } from "@web/constants/permission/settings/masterParameter/permission";
import { MASTER_TYPE_PERMISSION } from "@web/constants/permission/settings/masterType/permission";
import { PAYMENT_GATEWAY_PERMISSION } from "@web/constants/permission/settings/paymentGateway/permission";
import { SETTINGS_PERMISSION } from "@web/constants/permission/settings/permission";
import { SMS_MASTER_PERMISSION } from "@web/constants/permission/settings/smsMaster/permission";
import { SMS_SETTINGS_PERMISSION } from "@web/constants/permission/settings/smsSettings/permission";
import { SMS_TEMPLATE_PERMISSION } from "@web/constants/permission/settings/smsTemplate/permission";
import { SUVICHAR_MASTER_PERMISSION } from "@web/constants/permission/settings/suvicharMaster/permission";
import { TRUST_MASTER_PERMISSION } from "@web/constants/permission/settings/trustMaster/permission";
import { USER_PERMISSION } from "@web/constants/permission/user/permission";
import { USER_LOGIN_REPORT_PERMISSION } from "@web/constants/permission/user/userLoginReport/permission";
import { USER_MASTER_PERMISSION } from "@web/constants/permission/user/userMaster/permission";

export const MENU_PERMISSION = {
  acYearMaster: AC_YEAR_MASTER_PERMISSION.MENU,
  address: ADDRESS_PERMISSION.MENU,
  addressBook: ADDRESS_BOOK_PERMISSION.MENU,
  addressType: ADDRESS_TYPE_PERMISSION.MENU,
  bankMaster: BANK_MASTER_PERMISSION.MENU,
  branchMaster: BRANCH_MASTER_PERMISSION.MENU,
  cancelReceipt: CANCEL_RECEIPT_PERMISSION.MENU,
  chequeReconciliation: CHEQUE_RECONCILIATION_PERMISSION.MENU,
  dailyCollectionReport: DAILY_COLLECTION_REPORT_PERMISSION.MENU,
  donation: DONATION_PERMISSION.MENU,
  donationCollectionReport: DONATION_COLLECTION_REPORT_PERMISSION.MENU,
  donationEntry: DONATION_ENTRY_PERMISSION.MENU,
  donationImportFromExcel: DONATION_IMPORT_FROM_EXCEL_PERMISSION.MENU,
  donationMaster: DONATION_MASTER_PERMISSION.MENU,
  donationReport: DONATION_REPORT_PERMISSION.MENU,
  donationSummary: DONATION_SUMMARY_PERMISSION.MENU,
  donorAddressList: DONAR_ADDRESS_LIST_PERMISSION.MENU,
  emailSettings: EMAIL_SETTINGS_PERMISSION.MENU,
  event: EVENT_PERMISSION.MENU,
  eventDonationEntry: EVENT_DONATION_ENTRY_PERMISSION.MENU,
  eventMaster: EVENT_MASTER_PERMISSION.MENU,
  eventReminderList: EVENT_REMINDER_LIST_PERMISSION.MENU,
  eventSummaryReport: EVENT_SUMMARY_REPORT_PERMISSION.MENU,
  masterParameter: MASTER_PARAMETER_PERMISSION.MENU,
  masterType: MASTER_TYPE_PERMISSION.MENU,
  paymentGateway: PAYMENT_GATEWAY_PERMISSION.MENU,
  report: REPORT_PERMISSION.MENU,
  settings: SETTINGS_PERMISSION.MENU,
  smsMaster: SMS_MASTER_PERMISSION.MENU,
  smsSettings: SMS_SETTINGS_PERMISSION.MENU,
  smsTemplate: SMS_TEMPLATE_PERMISSION.MENU,
  suvicharMaster: SUVICHAR_MASTER_PERMISSION.MENU,
  trustMaster: TRUST_MASTER_PERMISSION.MENU,
  user: USER_PERMISSION.MENU,
  userLoginReport: USER_LOGIN_REPORT_PERMISSION.MENU,
  userMaster: USER_MASTER_PERMISSION.MENU,
};
