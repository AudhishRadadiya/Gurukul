import {
  SettingIcon,
  SvgHome,
  SvgOrganization,
  SvgProfile,
  type DrawerProps,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import type { HTMLAttributeAnchorTarget } from "react";

import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";

const drawerMenuItems = {
  home: "Home",
};

export type DrawerMenuItemsKeys = keyof typeof drawerMenuItems;

export const useDrawerMenuItems = () => {
  const { permissions, validateAccess } = useUserPermissions();

  const router = useRouter();

  const onClick = (
    href: string,
    target: HTMLAttributeAnchorTarget = "_self"
  ) => {
    if (target == "_self") {
      router.push(href);
    } else {
      window.open(href, target, "noopener,noreferrer");
    }
  };

  const menuItems: DrawerProps["menuItems"] = [
    {
      icon: <SvgHome />,
      isView: true,
      key: "home",
      onClick: (href, target) => onClick(href, target),
      title: "Home",
    },
    {
      icon: <SvgProfile />,
      isView: validateAccess(permissions.user),
      key: "user",
      menuItems: [
        {
          isView: validateAccess(permissions.userMaster),
          key: "user-master",
          onClick: (href, target) => onClick(href, target),
          title: "User Master",
        },
        {
          isView: validateAccess(permissions.userLoginReport),
          key: "user-login-report",
          onClick: (href, target) => onClick(href, target),
          title: t("common.user.login.report"),
        },
      ],
      onClick: (href, target) => onClick(href, target),
      title: "User",
    },
    {
      icon: <SvgProfile />,
      isView: true,
      key: "permission",
      menuItems: [
        {
          isView: true,
          key: "role",
          onClick: (href, target) => onClick(href, target),
          title: t("role.menu.label"),
        },
        {
          isView: true,
          key: "user-permissions",
          onClick: (href, target) => onClick(href, target),
          title: t("user.permissions.menu.label"),
        },
      ],
      title: t("permission.menu.label"),
    },
    {
      icon: <SvgOrganization />,
      isView: validateAccess(permissions.donation),
      key: "donation",
      menuItems: [
        {
          isView: true,
          key: "suvichar-master",
          onClick: (href, target) => onClick(href, target),
          title: t("common.master.label", {
            label: t("suvichar.menu.label"),
          }),
        },
        {
          isView: true,
          key: "donation-master",
          onClick: (href, target) => onClick(href, target),
          title: t("common.master.label", {
            label: t("donation.menu.label"),
          }),
        },
        {
          isView: true,
          key: "donation-mode",
          onClick: (href, target) => onClick(href, target),
          title: t("common.mode.label", {
            label: t("donation.menu.label"),
          }),
        },
        {
          isView: true,
          key: "bank-master",
          onClick: (href, target) => onClick(href, target),
          title: t("common.master.label", {
            label: t("bank.menu.label"),
          }),
        },
        {
          isView: validateAccess(permissions.chequeReconciliation),
          key: "cheque-reconciliation",
          onClick: (href, target) => onClick(href, target),
          title: t("chequeReconciliation.label"),
        },
        {
          isView: validateAccess(permissions.cancelReceipt),
          key: "cancel-receipt",
          onClick: (href, target) => onClick(href, target),
          title: t("cancelReceipt.menu.label"),
        },
        {
          isView: validateAccess(permissions.donationSummary),
          key: "donation-summary",
          onClick: (href, target) => onClick(href, target),
          title: t("summary.label", {
            label: t("donation.menu.label"),
          }),
        },
        {
          isView: validateAccess(permissions.donationEntry),
          key: "donation-entry",
          onClick: (href, target) => onClick(href, target),
          title: t("donation.entry.label"),
        },
        {
          isView: validateAccess(permissions.donationImportFromExcel),
          key: "donation-import",
          onClick: (href, target) => onClick(href, target),
          title: t("donation.import.label"),
        },
      ],
      onClick: (href, target) => onClick(href, target),
      title: t("donation.menu.label"),
    },
    {
      icon: <SvgHome />,
      isView: validateAccess(permissions.event),
      key: "event",
      menuItems: [
        {
          isView: validateAccess(permissions.eventSummaryReport),
          key: "event-summary",
          onClick: (href, target) => onClick(href, target),
          title: t("summary.label", {
            label: t("common.event.label"),
          }),
        },
        {
          isView: validateAccess(permissions.eventReminderList),
          key: "event-reminder",
          onClick: (href, target) => onClick(href, target),
          title: t("reminder.label", {
            label: t("common.event.label"),
          }),
        },
        {
          isView: validateAccess(permissions.eventDonationEntry),
          key: "event-donation-entry",
          onClick: (href, target) => onClick(href, target),
          title: t("common.event.donationEntry"),
        },
      ],
      onClick: (href, target) => onClick(href, target),
      title: t("common.event.label"),
    },
    {
      icon: <SvgOrganization />,
      isView: validateAccess(permissions.address),
      key: "address",
      menuItems: [
        {
          isView: validateAccess(permissions.masterParameter),
          key: "master-entry",
          onClick: (href, target) => onClick(href, target),
          title: t("address.master.entry.menu.label"),
        },
        {
          isView: validateAccess(permissions.donorAddressList),
          key: "donor-address",
          onClick: (href, target) => onClick(href, target),
          title: t("common.donor.label", {
            label: t("address.label"),
          }),
        },
        {
          isView: validateAccess(permissions.addressBook),
          key: "address-book",
          onClick: (href, target) => onClick(href, target),
          title: t("address.book.menu.label"),
        },
        {
          isView: true,
          key: "address-import",
          onClick: (href, target) => onClick(href, target),
          title: t("address.import.label"),
        },
      ],
      onClick: (href, target) => onClick(href, target),
      title: t("address.menu.label"),
    },
    {
      icon: <SvgProfile />,
      isView: validateAccess(permissions.report),
      key: "report",
      menuItems: [
        {
          isView: validateAccess(permissions.donationReport),
          key: "donation-report",
          onClick: (href, target) => onClick(href, target),
          title: t("donation.report.menu.label"),
        },
        {
          isView: validateAccess(permissions.dailyCollectionReport),
          key: "daily-collection-report",
          onClick: (href, target) => onClick(href, target),
          title: t("daily.collection.report"),
        },
        {
          isView: validateAccess(permissions.donationCollectionReport),
          key: "donation-collection-report",
          onClick: (href, target) => onClick(href, target),
          title: t("donation.collection.report.menu.label"),
        },
      ],
      onClick: (href, target) => onClick(href, target),
      title: t("common.report"),
    },
    {
      icon: <SettingIcon />,
      isView: validateAccess(permissions.settings),
      key: "settings",
      menuItems: [
        {
          isView: validateAccess(permissions.branchMaster),
          key: "branch-master",
          onClick: (href, target) => onClick(href, target),
          title: "Branch Master",
        },
        {
          isView: validateAccess(permissions.acYearMaster),
          key: "financial-year-master",
          onClick: (href, target) => onClick(href, target),
          title: "Financial Year Master",
        },
        {
          isView: validateAccess(permissions.addressType),
          key: "address-type-master",
          onClick: (href, target) => onClick(href, target),
          title: "Address Type Master",
        },
        {
          isView: validateAccess(permissions.trustMaster),
          key: "trust-master",
          onClick: (href, target) => onClick(href, target),
          title: "Trust Master",
        },
        {
          isView: validateAccess(permissions.masterType),
          key: "master-type",
          onClick: (href, target) => onClick(href, target),
          title: t("master.type.menu.label"),
        },
        {
          isView: validateAccess(permissions.eventMaster),
          key: "event-master",
          onClick: (href, target) => onClick(href, target),
          title: "Event Master",
        },
        {
          isView: validateAccess(permissions.smsTemplate),
          key: "sms-template",
          onClick: (href, target) => onClick(href, target),
          title: t("sms.template.menu.label"),
        },
        {
          isView: validateAccess(permissions.smsMaster),
          key: "sms-master",
          onClick: (href, target) => onClick(href, target),
          title: t("common.master.label", {
            label: t("sms.label"),
          }),
        },
        {
          isView: validateAccess(permissions.smsSettings),
          key: "sms-settings",
          onClick: (href, target) => onClick(href, target),
          title: t("sms.settings.menu.label"),
        },
        {
          isView: validateAccess(permissions.emailSettings),
          key: "mail-setting",
          onClick: (href, target) => onClick(href, target),
          title: t("mailSetting.label"),
        },
      ],
      onClick: (href, target) => onClick(href, target),
      title: "Settings",
    },
  ];

  return { menuItems };
};
