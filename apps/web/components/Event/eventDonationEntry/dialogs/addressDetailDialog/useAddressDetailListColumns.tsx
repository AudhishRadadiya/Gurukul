import { CheckCircleOutlineOutlined } from "@mui/icons-material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";
import _compact from "lodash/compact";
import _join from "lodash/join";

import type { AddressDetail } from "@web/components/Event/eventDonationEntry/dialogs/addressDetailDialog/hooks/useGetAddressDetail";
import type { AgColumnsArgs, AgColumnsWithActions } from "@web/types/agGrid";

type UseAddressDetailListColumns = {
  onAction: (rowData: AddressDetail) => void;
};
export const useAddressDetailListColumns = ({
  onAction,
}: AgColumnsArgs<UseAddressDetailListColumns>) => {
  const column: AgColumnsWithActions<AddressDetail> = [
    {
      field: "contact_no",
      headerName: t("common.contact.label"),
    },
    {
      cellRenderer: ({ data }: CustomCellRendererProps<AddressDetail>) => {
        if (!data) {
          return;
        }

        const { first_name, middle_name, surname } = data;

        const fullName = _join(
          _compact([first_name, middle_name, surname]),
          " "
        );

        return fullName;
      },
      field: "first_name",
      headerName: t("common.name"),
    },
    {
      field: "city",
      headerName: t("common.city"),
    },
    {
      field: "address",
      headerName: t("address.label"),
    },
    {
      cellRenderer: ({ data }: CustomCellRendererProps) => {
        if (!data) {
          return;
        }

        return (
          <CheckCircleOutlineOutlined
            fontSize="medium"
            color="success"
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
