import { AddressBookBreadcrumbs } from "@web/components/Address/address-book/Tabs/AddressBookBreadCrumbs";
import { AddressImportBreadcrumbs } from "@web/components/Address/addressImport/AddressImportBreadcrumbs";
import { DonorAddressBreadcrumbs } from "@web/components/Address/DonorAddress/DonorAddressBreadcrumbs";
import { HastakBreadcrumbs } from "@web/components/Address/Hastak/HastakBreadcrumbs";
import { UpdateDonorAddressBreadcrumbs } from "@web/components/Address/UpdateDonorAddress/UpdateDonorAddressBreadcrumbs";
import { DashboardBreadcrumbs } from "@web/components/Dashboard/DashboardBreadcrumbs";
import { CancelReceiptBreadcrumbs } from "@web/components/Donation/cancelReceipt/CancelReceiptBreadcrumbs";
import { ChequeReconciliationBreadcrumbs } from "@web/components/Donation/chequeReconciliation/ChequeReconciliationBreadcrumbs";
import { DonationEntryBreadcrumbs } from "@web/components/Donation/donationEntry/DonationEntryBreadcrumbs";
import { DonationImportBreadcrumbs } from "@web/components/Donation/donationImport/DonationImportBreadcrumbs";
import { DonationListBreadcrumbs } from "@web/components/Donation/donationRecords/donationList/DonationListBreadcrumbs";
import { DonationSummaryBreadcrumbs } from "@web/components/Donation/donationSummary/DonationSummaryBreadcrumbs";
import { EventContactGroupBreadcrumbs } from "@web/components/Event/eventContactGroup/EventContactGroupBreadcrumbs";
import { EventDonationBreadcrumbs } from "@web/components/Event/eventDonation/EventDonationBreadcrumbs";
import { EventDonationEntryBreadcrumbs } from "@web/components/Event/eventDonationEntry/EventDonationEntryBreadcrumbs";
import { EventDropdownSummaryBreadcrumbs } from "@web/components/Event/eventDropdownSummary/EventDropdownSummaryBreadcrumbs";
import { EventItemSummaryBreadcrumbs } from "@web/components/Event/eventItemSummary/EventItemSummaryBreadcrumbs";
import { EventReminderBreadcrumbs } from "@web/components/Event/EventReminder/EventReminderBreadcrumbs";
import { EventSummaryBreadcrumbs } from "@web/components/Event/EventSummary/EventSummaryBreadcrumbs";
import { RoleBreadcrumbs } from "@web/components/permission/role/RoleBreadcrumbs";
import { UserPermissionsBreadcrumbs } from "@web/components/permission/user-permissions/UserPermissionsBreadcrumbs";
import { DailyCollectionReportBreadcrumbs } from "@web/components/report/dailyCollectionReport/DailyCollectionReportBreadcrumbs";
import { DonationCollectionReportBreadcrumbs } from "@web/components/report/donationReport/donationCollectionReport/DonationCollectionReportBreadcrumbs";
import { DonationReportBreadcrumbs } from "@web/components/report/donationReport/DonationReportBreadcrumbs";
import { WhatsappHistoryBreadcrumbs } from "@web/components/report/whatsappHistory/WhatsappHistoryBreadcrumbs";
import { AddressTypeBreadcrumbs } from "@web/components/settings/address-type-master/AddressTypeBreadcrumbs";
import { AtgCertificateBreadcrumbs } from "@web/components/settings/atg-certificate/AtgCertificateBreadcrumbs";
import { BankMasterBreadcrumbs } from "@web/components/settings/BankMaster/BankMasterBreadcrumbs";
import { BranchMasterBreadcrumbs } from "@web/components/settings/branch-master/BranchMasterBreadcrumbs";
import { CsrCertificateBreadcrumbs } from "@web/components/settings/csr-certificate/CsrCertificateBreadcrumbs";
import { DonationMasterBreadcrumbs } from "@web/components/settings/DonationMaster/DonationMasterBreadcrumbs";
import { DonationModeBreadcrumbs } from "@web/components/settings/DonationMode/DonationModeBreadcrumbs";
import { DraftPaymentBreadcrumbs } from "@web/components/settings/draftPayment/DraftPaymentBreadcrumbs";
import { EventMasterBreadcrumbs } from "@web/components/settings/event-master/EventMasterBreadcrumbs";
import { FinancialYearMasterBreadcrumbs } from "@web/components/settings/financial-year-master/FinancialYearMasterBreadcrumbs";
import { MailSettingBreadcrumbs } from "@web/components/settings/mailSetting/MailSettingBreadcrumbs";
import { MasterTypeBreadcrumbs } from "@web/components/settings/master-type/MasterTypeBreadcrumbs";
import { MasterEntryBreadcrumbs } from "@web/components/settings/masterEntry/MasterEntryBreadcrumbs";
import { MetaWhatsappSettingBreadcrumbs } from "@web/components/settings/metaWhatsappSetting/MetaWhatsappSettingBreadcrumbs";
import { MetaWhatsappTemplateBreadcrumbs } from "@web/components/settings/metaWhatsappTemplate/MetaWhatsappTemplateBreadcrumbs";
import { PaymentGatewayBreadcrumbs } from "@web/components/settings/paymentGateway/PaymentGatewayBreadcrumbs";
import { SmsTemplateBreadcrumbs } from "@web/components/settings/sms-template/SmsTemplateBreadcrumbs";
import { SmsSettingsBreadcrumbs } from "@web/components/settings/smsSettings/SmsSettingsBreadcrumbs";
import { SuvicharMasterBreadcrumbs } from "@web/components/settings/suvicharMaster/SuvicharMasterBreadcrumbs";
import { TrustMasterBreadcrumbs } from "@web/components/settings/trust-master/TrustMasterBreadcrumbs";
import { WhatsappSettingBreadcrumbs } from "@web/components/settings/whatsappSetting/WhatsappSettingBreadcrumbs";
import { UserMasterBreadcrumbs } from "@web/components/user/user-master/UserMasterBreadcrumbs";
import { UserLoginReportBreadcrumbs } from "@web/components/user/userLoginReport/UserLoginReportBreadcrumbs";
import { WebUserMasterBreadcrumbs } from "@web/components/user/web-user-master/WebUserMasterBreadcrumbs";
import { WebBannerBreadcrumbs } from "@web/components/web-banner/WebBannerBreadcrumbs";

import { SubMenuKey, type SubMenuSlug } from "./subMenuKey";
import { useHeaderBreadcrumbRoute } from "./useHeaderBreadcrumbRoute";

const SUB_MENU_BREADCRUMBS: Record<SubMenuSlug, React.ComponentType> = {
  [SubMenuKey.AddressBook]: AddressBookBreadcrumbs,
  [SubMenuKey.AddressImport]: AddressImportBreadcrumbs,
  [SubMenuKey.AddressTypeMaster]: AddressTypeBreadcrumbs,
  [SubMenuKey.BankMaster]: BankMasterBreadcrumbs,
  [SubMenuKey.BranchMaster]: BranchMasterBreadcrumbs,
  [SubMenuKey.CancelReceipt]: CancelReceiptBreadcrumbs,
  [SubMenuKey.ChequeReconciliation]: ChequeReconciliationBreadcrumbs,
  [SubMenuKey.DailyCollectionReport]: DailyCollectionReportBreadcrumbs,
  [SubMenuKey.DonationCollectionReport]: DonationCollectionReportBreadcrumbs,
  [SubMenuKey.DonationEntry]: DonationEntryBreadcrumbs,
  [SubMenuKey.DonationImport]: DonationImportBreadcrumbs,
  [SubMenuKey.DonationMaster]: DonationMasterBreadcrumbs,
  [SubMenuKey.DonationMode]: DonationModeBreadcrumbs,
  [SubMenuKey.DonationReport]: DonationReportBreadcrumbs,
  [SubMenuKey.DonationSummary]: DonationSummaryBreadcrumbs,
  [SubMenuKey.DonorAddress]: DonorAddressBreadcrumbs,
  [SubMenuKey.Hastak]: HastakBreadcrumbs,
  [SubMenuKey.DraftPayment]: DraftPaymentBreadcrumbs,
  [SubMenuKey.EventDonationEntry]: EventDonationEntryBreadcrumbs,
  [SubMenuKey.EventDropdownSummary]: EventDropdownSummaryBreadcrumbs,
  [SubMenuKey.EventItemSummary]: EventItemSummaryBreadcrumbs,
  [SubMenuKey.AtgCertificate]: AtgCertificateBreadcrumbs,
  [SubMenuKey.CsrCertificate]: CsrCertificateBreadcrumbs,
  [SubMenuKey.EventContactGroup]: EventContactGroupBreadcrumbs,
  [SubMenuKey.EventMaster]: EventMasterBreadcrumbs,
  [SubMenuKey.EventReminder]: EventReminderBreadcrumbs,
  [SubMenuKey.EventSummary]: EventSummaryBreadcrumbs,
  [SubMenuKey.FinancialYearMaster]: FinancialYearMasterBreadcrumbs,
  [SubMenuKey.MailSetting]: MailSettingBreadcrumbs,
  [SubMenuKey.MasterEntry]: MasterEntryBreadcrumbs,
  [SubMenuKey.MasterType]: MasterTypeBreadcrumbs,
  [SubMenuKey.MetaWhatsappSetting]: MetaWhatsappSettingBreadcrumbs,
  [SubMenuKey.PaymentGateway]: PaymentGatewayBreadcrumbs,
  [SubMenuKey.Role]: RoleBreadcrumbs,
  [SubMenuKey.SmsSettings]: SmsSettingsBreadcrumbs,
  [SubMenuKey.SmsTemplate]: SmsTemplateBreadcrumbs,
  [SubMenuKey.SuvicharMaster]: SuvicharMasterBreadcrumbs,
  [SubMenuKey.TrustMaster]: TrustMasterBreadcrumbs,
  [SubMenuKey.UpdateDonorAddress]: UpdateDonorAddressBreadcrumbs,
  [SubMenuKey.UserLoginReport]: UserLoginReportBreadcrumbs,
  [SubMenuKey.UserMaster]: UserMasterBreadcrumbs,
  [SubMenuKey.WebUserMaster]: WebUserMasterBreadcrumbs,
  [SubMenuKey.UserPermissions]: UserPermissionsBreadcrumbs,
  [SubMenuKey.WebBanner]: WebBannerBreadcrumbs,
  [SubMenuKey.WhatsappHistory]: WhatsappHistoryBreadcrumbs,
  [SubMenuKey.WhatsappSetting]: WhatsappSettingBreadcrumbs,
  [SubMenuKey.DonationList]: DonationListBreadcrumbs,
  [SubMenuKey.MetaWhatsappTemplate]: MetaWhatsappTemplateBreadcrumbs,
};

export const HeaderBreadcrumbs = () => {
  const { isDashboard, isEventDonation, subMenuKey } =
    useHeaderBreadcrumbRoute();

  if (isDashboard) {
    return <DashboardBreadcrumbs />;
  }

  if (isEventDonation) {
    return <EventDonationBreadcrumbs />;
  }

  if (!subMenuKey) {
    return null;
  }

  const Breadcrumb = SUB_MENU_BREADCRUMBS[subMenuKey];

  if (!Breadcrumb) {
    return null;
  }

  return <Breadcrumb />;
};
