import { ActionCell, type DialogTypes, Tooltip } from "@codezee/sixtify-brahma";
import type { AppColumnDef } from "@codezee-org/sixtify-smartgrid";
import { Typography, useTheme } from "@mui/material";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import { useGetTrueFalseOptions } from "@web/components/common/Autocomplete/hooks/useGetTrueFalseOptions";
import type { DonationEntryColumnHideTypes } from "@web/components/Donation/donationEntry/donationEntryList/hooks/templateTypes";
import type { DonationEntry } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationEntry";
import { DONATION_ENTRY_PERMISSION } from "@web/constants/permission/donation/donationEntry/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import type { AgColumnsArgs } from "@web/types/agGrid";
import type { SmartGridActionItems } from "@web/types/shared-types";
import { dateFormat } from "@web/utils/date";
import { formatToIndianNumber } from "@web/utils/helper";

type UseGetDonationEntryColumnsArgs = {
  columnHide: DonationEntryColumnHideTypes;
  onAction: (actionType: DialogTypes, rowData: DonationEntry) => void;
};

export const useDonationEntryColumns = ({
  columnHide,
  onAction,
}: AgColumnsArgs<UseGetDonationEntryColumnsArgs>) => {
  const theme = useTheme();

  const { black, orchid, red } = theme.palette.app.color;

  const { trueFalseOptions } = useGetTrueFalseOptions();

  const { validateAccess } = useUserPermissions();

  const {
    aadhar_no,
    address,
    amount,
    atg,
    bank_name,
    cancel_date,
    cheque_no,
    city,
    contact_no,
    date,
    dl_no,
    donation_mode,
    donation_type,
    elector_number,
    email,
    entry_by,
    entry_date,
    event,
    is_cancel_active,
    mode_of_receipt,
    organize_remark,
    pan_no,
    passport_no,
    prasad,
    receipt_name,
    receipt_no,
    ref_receipt_no,
    remark,
    state,
  } = columnHide || {};

  const getColumnValueColor = ({
    edit_date,
    is_cancel,
  }: Pick<DonationEntry, "edit_date" | "is_cancel">) => {
    if (edit_date) {
      return orchid[900];
    }

    if (is_cancel) {
      return red[500];
    }

    return black[900];
  };

  const columns: AppColumnDef<DonationEntry>[] = [
    {
      accessorKey: "date",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { date } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {date ? dateFormat(date, true) : AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartDateFilter",
      header: t("date.label"),
      hide: !date,
      size: 200,
    },
    {
      accessorKey: "trust_name",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { trust_name } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Tooltip toolTipLabel={trust_name}>
            <Typography variant="body2" color={receiptColor}>
              {trust_name ?? AG_GRID_CELL_DEFAULT_VALUE}
            </Typography>
          </Tooltip>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("trust.label"),
    },
    {
      accessorKey: "receipt_no",
      cell: ({ row: { original } }) => {
        const { receipt_no } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {receipt_no ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("common.receipt.label", {
        label: t("common.number.label"),
      }),
      hide: !receipt_no,
      minSize: 170,
    },
    {
      accessorKey: "receipt_name",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { receipt_name } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {receipt_name ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("common.receipt.label", {
        label: t("common.name"),
      }),
      hide: !receipt_name,
      minSize: 170,
    },
    {
      accessorKey: "event",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { event } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {event ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("common.event.label"),
      hide: !event,
      minSize: 200,
    },
    {
      accessorKey: "contact_no",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { contact_no } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {contact_no ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("common.contact.label"),
      hide: !contact_no,
      minSize: 130,
    },
    {
      accessorKey: "amount",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { amount } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {formatToIndianNumber(amount) ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      filterVariant: "smartNumberFilter",
      header: t("amount.label"),
      hide: !amount,
      minSize: 170,
    },
    {
      accessorKey: "donation_mode",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { donation_mode } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {donation_mode ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("donationMode.label"),
      hide: !donation_mode,
      minSize: 150,
    },
    {
      accessorKey: "bank_name",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { bank_name } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {bank_name ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("bank.name.label"),
      hide: !bank_name,
      minSize: 200,
    },
    {
      accessorKey: "cheque_no",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { cheque_no } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {cheque_no ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartNumberFilter",
      header: t("cheque.label", {
        label: t("common.number.label"),
      }),
      hide: !cheque_no,
      minSize: 200,
    },
    {
      accessorKey: "pan_no",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { pan_no } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {pan_no ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("common.pan.no"),
      hide: !pan_no,
      minSize: 130,
    },
    {
      accessorKey: "donation_type",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { donation_type } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {donation_type ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("donation.type.label"),
      hide: !donation_type,
      minSize: 220,
    },
    {
      accessorKey: "ref_receipt_no",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { ref_receipt_no } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {ref_receipt_no ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartNumberFilter",
      header: t("ref.receipt.no.label"),
      hide: !ref_receipt_no,
      minSize: 180,
    },
    {
      accessorKey: "address",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { address } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {address ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("address.label"),
      hide: !address,
      minSize: 250,
    },
    {
      accessorKey: "email",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { email } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {email ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("email.label"),
      hide: !email,
      minSize: 200,
    },
    {
      accessorKey: "city",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { city } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {city ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("common.city"),
      hide: !city,
      minSize: 150,
    },
    {
      accessorKey: "is_cancel_active",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { is_cancel_active } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {is_cancel_active ? t("common.yes") : t("common.no")}
          </Typography>
        );
      },
      filterParams: {
        filterOptions: trueFalseOptions,
      },
      filterVariant: "smartSelectFilter",
      header: t("is.cancel.activate.label"),
      hide: !is_cancel_active,
      minSize: 130,
    },
    {
      accessorKey: "organize_remark",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { organize_remark } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {organize_remark ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("organize.remark.label"),
      hide: !organize_remark,
      minSize: 200,
    },
    {
      accessorKey: "entry_by",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { entry_by } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {entry_by ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("entry.by.label"),
      hide: !entry_by,
      minSize: 200,
    },
    {
      accessorKey: "entry_date",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { entry_date } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {dateFormat(entry_date, true) ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartDateFilter",
      header: t("entry.date.label"),
      hide: !entry_date,
      minSize: 120,
    },
    {
      accessorKey: "aadhar_no",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { aadhar_no } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {aadhar_no ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("aadhar.no.label"),
      hide: !aadhar_no,
      minSize: 150,
    },
    {
      accessorKey: "dl_no",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { dl_no } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {dl_no ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("dl.no.label"),
      hide: !dl_no,
      minSize: 150,
    },
    {
      accessorKey: "elector_number",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { elector_number } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {elector_number ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("common.electors.number"),
      hide: !elector_number,
      minSize: 150,
    },
    {
      accessorKey: "passport_no",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { passport_no } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {passport_no ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("common.passport.no"),
      hide: !passport_no,
      minSize: 150,
    },
    {
      accessorKey: "mode_of_receipt",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { mode_of_receipt } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {mode_of_receipt ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("mode.of.receipt.label"),
      hide: !mode_of_receipt,
      minSize: 150,
    },
    {
      accessorKey: "prasad",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { prasad } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {prasad ? t("common.yes") : t("common.no")}
          </Typography>
        );
      },
      filterParams: {
        filterOptions: trueFalseOptions,
      },
      filterVariant: "smartSelectFilter",
      header: t("prasad.label"),
      hide: !prasad,
      minSize: 80,
    },
    {
      accessorKey: "state",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { state } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {state ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("state.label"),
      hide: !state,
      minSize: 170,
    },
    {
      accessorKey: "atg",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { atg } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {atg ? t("common.yes") : t("common.no")}
          </Typography>
        );
      },
      filterParams: {
        filterOptions: trueFalseOptions,
      },
      filterVariant: "smartSelectFilter",
      header: t("atg.label"),
      hide: !atg,
      minSize: 80,
    },
    {
      accessorKey: "cancel_date",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { cancel_date } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {cancel_date
              ? dateFormat(cancel_date, true)
              : AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartDateFilter",
      header: t("cancelDate.label"),
      hide: !cancel_date,

      minSize: 120,
    },
    {
      accessorKey: "remark",
      cell: ({ row: { original } }: { row: { original: DonationEntry } }) => {
        const { remark } = original;

        const receiptColor = getColumnValueColor(original);

        return (
          <Typography variant="body2" color={receiptColor}>
            {remark ?? AG_GRID_CELL_DEFAULT_VALUE}
          </Typography>
        );
      },
      enableGrouping: true,
      filterVariant: "smartTextFilter",
      header: t("common.remark"),
      hide: !remark,
      minSize: 200,
    },
    {
      cell: ({ row }) => {
        const data = row.original;

        const items: SmartGridActionItems[] = [
          {
            isView: validateAccess(DONATION_ENTRY_PERMISSION.EDIT),
            onClick: () => onAction("edit", data),
            title: t("common.edit"),
          },
          {
            isView: validateAccess(DONATION_ENTRY_PERMISSION.CREATE),
            onClick: () => onAction("clone", data),
            title: t("common.clone"),
          },
          {
            onClick: () => onAction("donationLetter", data),
            title: t("common.donation.letter"),
          },
          {
            onClick: () => onAction("donationReceipt", data),
            title: t("donationReceipt.label"),
          },
          {
            onClick: () => onAction("cancelDonationEntryConfirmation", data),
            title: data.is_cancel ? "Active" : "Cancel",
          },
        ];

        return <ActionCell items={items} />;
      },
      enableGrouping: false,
      enableSorting: false,
      header: "",
      id: "action",
      minSize: 40,
      pinned: "right",
      size: 10,
    },
  ];

  return { columns };
};
