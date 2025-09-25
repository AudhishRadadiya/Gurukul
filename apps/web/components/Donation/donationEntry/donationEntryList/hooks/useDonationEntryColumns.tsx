import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { DonationEntryColumnHideTypes } from "@web/components/Donation/donationEntry/donationEntryList/hooks/templateTypes";
import type { DonationEntry } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationEntry";
import type { AgColumnsArgs, AgColumnsWithActions } from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";

type UseGetDonationEntryColumnsArgs = {
  columnHide: DonationEntryColumnHideTypes;
};

export const useDonationEntryColumns = ({
  columnHide,
}: AgColumnsArgs<UseGetDonationEntryColumnsArgs>) => {
  const {
    aadhar_no,
    address,
    amount,
    atg,
    bank_name,
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
    state,
  } = columnHide || {};

  const columns: AgColumnsWithActions<DonationEntry> = [
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "date",
      headerName: t("date.label"),
      hide: !date,
      minWidth: 100,
    },
    {
      field: "receipt_no",
      headerName: t("common.receipt.label", {
        label: t("common.number.label"),
      }),
      hide: !receipt_no,
      minWidth: 170,
    },
    {
      field: "receipt_name",
      headerName: t("common.receipt.label", {
        label: t("common.name"),
      }),
      hide: !receipt_name,
      minWidth: 170,
    },
    {
      field: "event",
      headerName: t("common.event.label"),
      hide: !event,

      minWidth: 200,
    },
    {
      field: "contact_no",
      headerName: t("common.contact.label"),
      hide: !contact_no,

      minWidth: 130,
    },
    {
      field: "amount",
      headerName: t("amount.label"),
      hide: !amount,

      minWidth: 170,
    },
    {
      field: "donation_mode",
      headerName: t("donationMode.label"),
      hide: !donation_mode,

      minWidth: 150,
    },
    {
      field: "bank_name",
      headerName: t("bank.name.label"),
      hide: !bank_name,

      minWidth: 200,
    },
    {
      field: "cheque_no",
      headerName: t("cheque.label", {
        label: t("common.number.label"),
      }),
      hide: !cheque_no,

      minWidth: 200,
    },
    {
      field: "pan_no",
      headerName: t("common.pan.no"),
      hide: !pan_no,

      minWidth: 130,
    },
    {
      field: "donation_type",
      headerName: t("donation.type.label"),
      hide: !donation_type,

      minWidth: 220,
    },
    {
      field: "ref_receipt_no",
      headerName: t("ref.receipt.no.label"),
      hide: !ref_receipt_no,

      minWidth: 180,
    },
    {
      field: "address",
      headerName: t("address.label"),
      hide: !address,

      minWidth: 250,
    },
    {
      field: "email",
      headerName: t("email.label"),
      hide: !email,

      minWidth: 200,
    },
    {
      field: "city",
      headerName: t("common.city"),
      hide: !city,

      minWidth: 150,
    },
    {
      field: "is_cancel_active",
      headerName: t("is.cancel.activate.label"),
      hide: !is_cancel_active,

      minWidth: 130,
    },
    {
      field: "organize_remark",
      headerName: t("organize.remark.label"),
      hide: !organize_remark,

      minWidth: 200,
    },
    {
      field: "entry_by",
      headerName: t("entry.by.label"),
      hide: !entry_by,

      minWidth: 200,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "entry_date",
      headerName: t("entry.date.label"),
      hide: !entry_date,

      minWidth: 120,
    },
    {
      field: "aadhar_no",
      headerName: t("aadhar.no.label"),
      hide: !aadhar_no,

      minWidth: 150,
    },
    {
      field: "dl_no",
      headerName: t("dl.no.label"),
      hide: !dl_no,
      minWidth: 150,
    },
    {
      field: "elector_number",
      headerName: t("common.electors.number"),
      hide: !elector_number,
      minWidth: 150,
    },
    {
      field: "passport_no",
      headerName: t("common.passport.no"),
      hide: !passport_no,
      minWidth: 150,
    },
    {
      field: "mode_of_receipt",
      headerName: t("mode.of.receipt.label"),
      hide: !mode_of_receipt,
      minWidth: 150,
    },
    {
      field: "prasad",
      headerName: t("prasad.label"),
      hide: !prasad,
      minWidth: 80,
    },
    {
      field: "state",
      headerName: t("state.label"),
      hide: !state,
      minWidth: 170,
    },
    {
      field: "atg",
      headerName: t("atg.label"),
      hide: !atg,
      minWidth: 80,
    },
  ];

  return { columns };
};
