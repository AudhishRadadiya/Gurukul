import { toasts } from "@codezee/sixtify-brahma";
import { Stack, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";
import { CheckCircle, GoogleDocs } from "iconoir-react";

import type { PreviousDonationDetail } from "@web/components/Donation/donationEntry/dialogs/hooks/useGetPreviousDonationDetail";
import type { AgColumnsArgs, AgColumnsWithActions } from "@web/types/agGrid";
import type { DialogTypes } from "@web/types/dialogs";

type UsePreviousDonationColumns = {
  onAction: (actionType: DialogTypes, rowData: PreviousDonationDetail) => void;
};
export const usePreviousDonationListColumns = ({
  onAction,
}: AgColumnsArgs<UsePreviousDonationColumns>) => {
  const theme = useTheme();

  const { darkMint, sapphireBlue } = theme.palette.app.color;

  const column: AgColumnsWithActions<PreviousDonationDetail> = [
    {
      field: "name_of_receipt",
      headerName: t("common.receipt.label", {
        label: t("common.name"),
      }),
    },
    {
      field: "address",
      headerName: t("address.label"),
    },
    {
      field: "city",
      headerName: t("common.city"),
    },
    {
      field: "email_id",
      headerName: t("email.label"),
    },
    {
      field: "pan_no",
      headerName: t("panNumber.label"),
    },
    {
      field: "driving_licence_no",
      headerName: t("dl.no.label"),
    },
    {
      field: "aadhar_no",
      headerName: t("aadhar.no.label"),
    },
    {
      field: "electors_number",
      headerName: t("common.electors.number"),
    },
    {
      field: "passport_no",
      headerName: t("common.passport.no"),
    },
    {
      cellRenderer: ({ data }: CustomCellRendererProps) => {
        if (!data) {
          return;
        }

        return (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap="10px"
          >
            <CheckCircle
              color={`${darkMint[900]}`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                onAction("history", data);
                toasts.success({
                  title: t("common.filled.data.message"),
                });
              }}
            />

            <GoogleDocs
              color={`${sapphireBlue[900]}`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                onAction("receiptEntry", data);
              }}
            />
          </Stack>
        );
      },
      field: "action",
      filter: "",
      headerName: "",
      lockPinned: true,
      maxWidth: 70,
      pinned: "right",
      sortable: false,
    },
  ];

  return { column };
};
