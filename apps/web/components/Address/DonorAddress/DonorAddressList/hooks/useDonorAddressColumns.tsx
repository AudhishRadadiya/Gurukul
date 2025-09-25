import {
  CancelOutlined,
  CheckCircleOutlineOutlined,
} from "@mui/icons-material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import type { DonorAddress } from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useGetDonorAddress";
import type { AgColumnsArgs, AgColumnsWithActions } from "@web/types/agGrid";

type UseDonorAddressColumns = {
  onAction: (rowData: DonorAddress) => void;
};

export const useDonorAddressColumns = ({
  onAction,
}: AgColumnsArgs<UseDonorAddressColumns>) => {
  const column: AgColumnsWithActions<DonorAddress> = [
    {
      field: "contact_no",
      headerName: t("contactNumber.label"),
    },
    {
      field: "first_name",
      headerName: t("firstName.label"),
    },
    {
      field: "middle_name",
      headerName: t("middleName.label"),
    },
    {
      field: "surname",
      headerName: t("surname.label"),
    },
    {
      field: "pan_no",
      headerName: t("panNumber.label"),
    },
    {
      field: "email_id",
      filter: "agTextColumnFilter",
      headerName: t("email.label"),
      minWidth: 220,
    },
    {
      field: "address",
      headerName: t("address.label"),
      minWidth: 270,
    },
    {
      field: "is_ignored",
      headerName: t("isActive.label"),
    },
    {
      cellRenderer: ({ data }: CustomCellRendererProps) => {
        if (!data) {
          return;
        }

        const { is_ignored } = data;

        return is_ignored ? (
          <CheckCircleOutlineOutlined
            fontSize="medium"
            color="success"
            style={{ cursor: "pointer" }}
            onClick={() => {
              onAction(data);
            }}
          />
        ) : (
          <CancelOutlined
            fontSize="medium"
            color="error"
            style={{ cursor: "pointer" }}
            onClick={() => {
              onAction(data);
            }}
          />
        );
      },
      field: "action",
      headerName: "",
      lockPinned: true,
      maxWidth: 55,
      pinned: "right",
      sortable: false,
    },
  ];

  return { column };
};
