import { ADDRESS_BOOK_PERMISSION } from "@web/constants/permission/address/addressBook/permission";
import { ADDRESS_BOOK_IMPORT_FROM_EXCEL_PERMISSION } from "@web/constants/permission/address/addressBookImportFromExcel/permission";
import { DONAR_ADDRESS_LIST_PERMISSION } from "@web/constants/permission/address/donarAddressList/permission";
import { HASTAK_LIST_PERMISSION } from "@web/constants/permission/address/hastakList/permission";
import { ADDRESS_PERMISSION } from "@web/constants/permission/address/permission";
import { UPDATE_DONAR_ADDRESS_PERMISSION } from "@web/constants/permission/address/updateDonarAddress/permission";
import { CANCEL_RECEIPT_PERMISSION } from "@web/constants/permission/donation/cancelReceipt/permission";
import { CHEQUE_RECONCILIATION_PERMISSION } from "@web/constants/permission/donation/chequeReconciliation/permission";
import { DONATION_ENTRY_PERMISSION } from "@web/constants/permission/donation/donationEntry/permission";
import { DONATION_IMPORT_FROM_EXCEL_PERMISSION } from "@web/constants/permission/donation/donationImportFromExcel/permission";
import { DONATION_SUMMARY_PERMISSION } from "@web/constants/permission/donation/donationSummary/permission";
import { DONATION_PERMISSION } from "@web/constants/permission/donation/permission";
import { EVENT_DONATION_ENTRY_PERMISSION } from "@web/constants/permission/event/eventDonationEntry/permission";
import { EVENT_DROPDOWN_REPORT_PERMISSION } from "@web/constants/permission/event/eventDropdownReport/permission";
import { EVENT_ITEM_SUMMARY_PERMISSION } from "@web/constants/permission/event/eventItemSummary/permission";
import { EVENT_REMINDER_LIST_PERMISSION } from "@web/constants/permission/event/eventReminderList/permission";
import { EVENT_SUMMARY_REPORT_PERMISSION } from "@web/constants/permission/event/eventSummaryReport/permission";
import { EVENT_PERMISSION } from "@web/constants/permission/event/permission";
import { PERMISSIONS_OF_PERMISSION } from "@web/constants/permission/permissions/permissions";
import { ROLL_ENTRY_PERMISSION } from "@web/constants/permission/permissions/rollEntryAndPermission/permissions";
import { USER_PERMISSION_OF_PERMISSION } from "@web/constants/permission/permissions/userPermission/permissions";
import { DAILY_COLLECTION_REPORT_PERMISSION } from "@web/constants/permission/report/dailyCollectionReport/permission";
import { DONATION_COLLECTION_REPORT_PERMISSION } from "@web/constants/permission/report/donationCollectionReport/permission";
import { DONATION_REPORT_PERMISSION } from "@web/constants/permission/report/donationReport/permission";
import { REPORT_PERMISSION } from "@web/constants/permission/report/permission";
import { WHATSAPP_HISTORY_PERMISSION } from "@web/constants/permission/report/whatsappHistory/permission";
import { AC_YEAR_MASTER_PERMISSION } from "@web/constants/permission/settings/acYearMaster/permission";
import { ADDRESS_TYPE_PERMISSION } from "@web/constants/permission/settings/addressType/permission";
import { ATG_CERTIFICATE_PERMISSION } from "@web/constants/permission/settings/atgCertificate/permission";
import { BANK_MASTER_PERMISSION } from "@web/constants/permission/settings/bankMaster/permission";
import { BRANCH_MASTER_PERMISSION } from "@web/constants/permission/settings/branchMaster/permission";
import { CSR_CERTIFICATE_PERMISSION } from "@web/constants/permission/settings/csrCertificate/permission";
import { DONATION_MASTER_PERMISSION } from "@web/constants/permission/settings/donationMaster/permission";
import { DONATION_MODE_PERMISSION } from "@web/constants/permission/settings/donationMode/permission";
import { DRAFT_PAYMENT_PERMISSION } from "@web/constants/permission/settings/draftPayment/permission";
import { EMAIL_SETTINGS_PERMISSION } from "@web/constants/permission/settings/emailSettings/permission";
import { EVENT_CONTACT_DETAIL_PERMISSION } from "@web/constants/permission/settings/eventContactDetail/permission";
import { EVENT_MASTER_PERMISSION } from "@web/constants/permission/settings/eventMaster/permission";
import { MASTER_PARAMETER_PERMISSION } from "@web/constants/permission/settings/masterParameter/permission";
import { MASTER_TYPE_PERMISSION } from "@web/constants/permission/settings/masterType/permission";
import { META_WHATSAPP_SETTING_PERMISSION } from "@web/constants/permission/settings/metaWhatsappSetting/permission";
import { META_WHATSAPP_TEMPLATE_PERMISSION } from "@web/constants/permission/settings/metaWhatsappTemplate/permission";
import { PAYMENT_GATEWAY_PERMISSION } from "@web/constants/permission/settings/paymentGateway/permission";
import { SETTINGS_PERMISSION } from "@web/constants/permission/settings/permission";
import { SMS_SETTINGS_PERMISSION } from "@web/constants/permission/settings/smsSettings/permission";
import { SMS_TEMPLATE_PERMISSION } from "@web/constants/permission/settings/smsTemplate/permission";
import { SUVICHAR_MASTER_PERMISSION } from "@web/constants/permission/settings/suvicharMaster/permission";
import { TRUST_MASTER_PERMISSION } from "@web/constants/permission/settings/trustMaster/permission";
import { WEB_BANNER_PERMISSION } from "@web/constants/permission/settings/webBanner/permission";
import { WHATSAPP_SETTINGS_PERMISSION } from "@web/constants/permission/settings/whatsappSettings/permission";
import { USER_PERMISSION } from "@web/constants/permission/user/permission";
import { USER_LOGIN_REPORT_PERMISSION } from "@web/constants/permission/user/userLoginReport/permission";
import { USER_MASTER_PERMISSION } from "@web/constants/permission/user/userMaster/permission";
import { WEB_USER_MASTER_PERMISSION } from "@web/constants/permission/user/webUserMaster/permission";

export const MENU_PERMISSION = {
  acYearMaster: AC_YEAR_MASTER_PERMISSION.MENU,
  address: ADDRESS_PERMISSION.MENU,
  addressBook: ADDRESS_BOOK_PERMISSION.MENU,
  addressImport: ADDRESS_BOOK_IMPORT_FROM_EXCEL_PERMISSION.MENU,
  addressType: ADDRESS_TYPE_PERMISSION.MENU,
  atgCertificate: ATG_CERTIFICATE_PERMISSION.MENU,
  bankMaster: BANK_MASTER_PERMISSION.MENU,
  branchMaster: BRANCH_MASTER_PERMISSION.MENU,
  cancelReceipt: CANCEL_RECEIPT_PERMISSION.MENU,
  chequeReconciliation: CHEQUE_RECONCILIATION_PERMISSION.MENU,
  csrCertificate: CSR_CERTIFICATE_PERMISSION.MENU,
  dailyCollectionReport: DAILY_COLLECTION_REPORT_PERMISSION.MENU,
  donation: DONATION_PERMISSION.MENU,
  donationCollectionReport: DONATION_COLLECTION_REPORT_PERMISSION.MENU,
  donationEntry: DONATION_ENTRY_PERMISSION.MENU,
  donationImportFromExcel: DONATION_IMPORT_FROM_EXCEL_PERMISSION.MENU,
  donationMaster: DONATION_MASTER_PERMISSION.MENU,
  donationMode: DONATION_MODE_PERMISSION.MENU,
  donationReport: DONATION_REPORT_PERMISSION.MENU,
  donationSummary: DONATION_SUMMARY_PERMISSION.MENU,
  donorAddressList: DONAR_ADDRESS_LIST_PERMISSION.MENU,
  draftPayment: DRAFT_PAYMENT_PERMISSION.MENU,
  emailSettings: EMAIL_SETTINGS_PERMISSION.MENU,
  event: EVENT_PERMISSION.MENU,
  eventContactDetail: EVENT_CONTACT_DETAIL_PERMISSION.MENU,
  eventDonationEntry: EVENT_DONATION_ENTRY_PERMISSION.MENU,
  eventDropdownReport: EVENT_DROPDOWN_REPORT_PERMISSION.MENU,
  eventItemSummary: EVENT_ITEM_SUMMARY_PERMISSION.MENU,
  eventMaster: EVENT_MASTER_PERMISSION.MENU,
  eventReminderList: EVENT_REMINDER_LIST_PERMISSION.MENU,
  eventSummaryReport: EVENT_SUMMARY_REPORT_PERMISSION.MENU,
  hastakList: HASTAK_LIST_PERMISSION.MENU,
  masterParameter: MASTER_PARAMETER_PERMISSION.MENU,
  masterType: MASTER_TYPE_PERMISSION.MENU,
  metaWhatsappSettings: META_WHATSAPP_SETTING_PERMISSION.MENU,
  metaWhatsappTemplate: META_WHATSAPP_TEMPLATE_PERMISSION.MENU,
  paymentGateway: PAYMENT_GATEWAY_PERMISSION.MENU,
  permissions: PERMISSIONS_OF_PERMISSION.MENU,
  report: REPORT_PERMISSION.MENU,
  rollEntryAndPermission: ROLL_ENTRY_PERMISSION.MENU,
  settings: SETTINGS_PERMISSION.MENU,
  smsSettings: SMS_SETTINGS_PERMISSION.MENU,
  smsTemplate: SMS_TEMPLATE_PERMISSION.MENU,
  suvicharMaster: SUVICHAR_MASTER_PERMISSION.MENU,
  trustMaster: TRUST_MASTER_PERMISSION.MENU,
  updateDonarAddress: UPDATE_DONAR_ADDRESS_PERMISSION.MENU,
  user: USER_PERMISSION.MENU,
  userLoginReport: USER_LOGIN_REPORT_PERMISSION.MENU,
  userMaster: USER_MASTER_PERMISSION.MENU,
  userPermission: USER_PERMISSION_OF_PERMISSION.MENU,
  webBanner: WEB_BANNER_PERMISSION.MENU,
  webUserMaster: WEB_USER_MASTER_PERMISSION.MENU,
  whatsappHistory: WHATSAPP_HISTORY_PERMISSION.MENU,
  whatsappSettings: WHATSAPP_SETTINGS_PERMISSION.MENU,
};
