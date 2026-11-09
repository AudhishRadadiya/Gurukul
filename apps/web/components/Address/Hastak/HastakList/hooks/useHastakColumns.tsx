import { ActionCell, useGetDeviceType } from "@codezee/sixtify-brahma";
import {
  CancelOutlined,
  CheckCircleOutlineOutlined,
} from "@mui/icons-material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import type { Hastak } from "@web/components/Address/Hastak/HastakList/hooks/useGetHastak";
import { useGetTrueFalseOptions } from "@web/components/common/Autocomplete/hooks/useGetTrueFalseOptions";
import type { AgColumnsArgs, AgColumnsWithActions } from "@web/types/agGrid";
import type { AgGridActionItems } from "@web/types/shared-types";
import { CustomEnumFilter } from "@web/utils/ag-grid-custom-filter";

type UseHastakColumns = {
  onCreate: (rowData: Hastak) => void;
  onStatusChange: (rowData: Hastak) => void;
};

export const useHastakColumns = ({
  onCreate,
  onStatusChange,
}: AgColumnsArgs<UseHastakColumns>) => {
  const { isMobile } = useGetDeviceType();

  const { trueFalseOptions } = useGetTrueFalseOptions();

  const column: AgColumnsWithActions<Hastak> = [
    {
      field: "hastak_mobile_no",
      headerName: t("hastak.mobileNumber.label"),
    },
    {
      field: "hastak_name",
      headerName: t("common.hastak.name"),
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
      cellRenderer: ({ data }: CustomCellRendererProps<Hastak>) => {
        if (!data) {
          return;
        }

        const { is_ignored } = data;

        const items: AgGridActionItems[] = [
          {
            onClick: () => onCreate(data),
            title: `${t("common.create")} ${t("hastak.list.label")}`,
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
                onClick={() => onStatusChange(data)}
              />
            ) : (
              <CheckCircleOutlineOutlined
                fontSize={isMobile ? "small" : "medium"}
                color="success"
                style={{ cursor: "pointer" }}
                onClick={() => onStatusChange(data)}
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
