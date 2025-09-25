import type { ActionButton } from "@codezee/sixtify-brahma/src/ActionButtons/types";
import { ExpandMore } from "@mui/icons-material";
import { t } from "i18next";

export const useActionButton = (
  handleExport: (type: "excel" | "pdf") => void
): { actionButtons: ActionButton[] } => {
  const actionButtons: ActionButton[] = [
    {
      dataCy: "export",
      dataPTag: "export",
      endIcon: <ExpandMore />,
      key: "right",
      label: t("export.label"),
      menuItems: [
        {
          dataCy: "xls",
          dataPTag: "xls",
          key: "xls",
          label: t("common.file.label", {
            label: t("excel.label"),
          }),
          onClick: () => {
            handleExport("excel");
          },
        },
        {
          dataCy: "pfd",
          dataPTag: "pfd",
          key: "pfd",
          label: t("common.file.label", {
            label: t("pdf.label"),
          }),
          onClick: () => {
            handleExport("pdf");
          },
        },
      ],
      menuPlacement: "left",
      size: "small",
      variant: "outlined",
    },
  ];

  return { actionButtons };
};
