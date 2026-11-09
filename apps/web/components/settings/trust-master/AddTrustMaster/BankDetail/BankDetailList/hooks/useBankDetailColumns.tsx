import {
  Chip,
  DeleteIconAction,
  EditIconAction,
  LoadingCell,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";

import type { FinancialYear } from "@web/components/settings/financial-year-master/FinancialYearMasterList/hooks/useGetFinancialYearMaster";
import type { BankDetailFormFieldValues } from "@web/components/settings/trust-master/AddTrustMaster/BankDetail/Dialog/BankDetailForm";
import type { AgColumnsArgs, AgColumnsWithActions } from "@web/types/agGrid";
import type { DialogTypes } from "@web/types/dialogs";

type UseBankDetailColumns = {
  onAction: (
    actionType: DialogTypes,
    rowData: BankDetailFormFieldValues
  ) => void;
};

export const useBankDetailColumns = ({
  onAction,
}: AgColumnsArgs<UseBankDetailColumns>) => {
  const { isMobile } = useGetDeviceType();

  const column: AgColumnsWithActions<BankDetailFormFieldValues> = [
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return value ? value : "-";
      },
      field: "acc_no",
      headerName: "Account No",
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return value ? value : " -";
      },
      field: "bank_branch",
      headerName: "Bank Branch",
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return value ? value : " -";
      },
      field: "bank_name",
      headerName: "Bank Name",
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return value ? value : " -";
      },
      field: "ifsc_code",
      headerName: "IFSC Code",
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps<FinancialYear>) => {
        if (value == null) {
          return null;
        }

        return value ? <Chip label="Yes" /> : <Chip label="No" color="error" />;
      },
      field: "is_active",
      headerName: "Is Active",
      sortable: true,
    },
    {
      cellRenderer: ({ data }: CustomCellRendererProps) => {
        if (!data) {
          return <LoadingCell />;
        }

        return (
          <Stack direction="row">
            <EditIconAction
              size={isMobile ? "small" : "medium"}
              onClick={() => {
                onAction("edit", data);
              }}
            />

            <DeleteIconAction
              size={isMobile ? "small" : "medium"}
              onClick={() => {
                onAction("delete", data);
              }}
            />
          </Stack>
        );
      },
      field: "action",
      headerName: "",
      lockPinned: true,
      maxWidth: isMobile ? 100 : 120,
      pinned: "right",
      sortable: false,
    },
  ];

  return { column };
};
