import { ActionCell, useGetDeviceType } from "@codezee/sixtify-brahma";
import {
  CancelOutlined,
  CheckCircleOutlineOutlined,
} from "@mui/icons-material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import type { DonorAddress } from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useGetDonorAddress";
import { useGetTrueFalseOptions } from "@web/components/common/Autocomplete/hooks/useGetTrueFalseOptions";
import type { AgColumnsArgs, AgColumnsWithActions } from "@web/types/agGrid";
import type { AgGridActionItems } from "@web/types/shared-types";
import { CustomEnumFilter } from "@web/utils/ag-grid-custom-filter";

type UseDonorAddressColumns = {
  onAction: (rowData: DonorAddress) => void;
};

export const useDonorAddressColumns = ({
  onAction,
}: AgColumnsArgs<UseDonorAddressColumns>) => {
  const { trueFalseOptions } = useGetTrueFalseOptions();

  const { isMobile } = useGetDeviceType();

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
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("isActive.label"),
    },
    {
      cellRenderer: ({ data }: CustomCellRendererProps<DonorAddress>) => {
        if (!data) {
          return;
        }

        const { is_ignored } = data;

        const items: AgGridActionItems[] = [
          {
            onClick: () => {
              window.open(
                `/address/address-book?page=add-address-book&donation_id=${data.donation_id}`,
                "_blank"
              );
            },
            title: `${t("common.create")} ${t("contact.label")}`,
          },
        ];

        return (
          <>
            <ActionCell items={items} />
            {is_ignored ? (
              <CancelOutlined
                fontSize={isMobile ? "small" : "medium"}
                color="error"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  onAction(data);
                }}
              />
            ) : (
              <CheckCircleOutlineOutlined
                fontSize={isMobile ? "small" : "medium"}
                color="success"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  onAction(data);
                }}
              />
            )}
          </>
        );
      },
      field: "action",
      headerName: "",
      lockPinned: true,
      maxWidth: 70,
      pinned: "right",
      sortable: false,
    },
  ];

  return { column };
};
