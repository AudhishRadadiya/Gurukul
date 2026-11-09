import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DeleteMetaWhatsappTemplateDialog } from "@web/components/settings/metaWhatsappTemplate/MetaWhatsappTemplateList/dialogs/DeleteMetaWhatsappTemplateDialog";
import { EditMetaWhatsappTemplateDialog } from "@web/components/settings/metaWhatsappTemplate/MetaWhatsappTemplateList/dialogs/EditMetaWhatsappTemplateDialog";
import {
  useGetMetaWhatsappTemplate,
  type MetaWhatsappTemplateDetail,
} from "@web/components/settings/metaWhatsappTemplate/MetaWhatsappTemplateList/hooks/useGetMetaWhatsappTemplate";
import { useMetaWhatsappTemplateColumns } from "@web/components/settings/metaWhatsappTemplate/MetaWhatsappTemplateList/hooks/useMetaWhatsappTemplateColumns";
import { META_WHATSAPP_TEMPLATE_PERMISSION } from "@web/constants/permission/settings/metaWhatsappTemplate/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";

export const MetaWhatsappTemplateList = () => {
  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentMetaWhatsappTemplate, setCurrentMetaWhatsappTemplate] =
    useState<MetaWhatsappTemplateDetail>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetMetaWhatsappTemplate({
    endRow,
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { metaWhatsappTemplateDetail: rowData, totalCount } = data || {};

  const { column } = useMetaWhatsappTemplateColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentMetaWhatsappTemplate && (
      <DeleteMetaWhatsappTemplateDialog
        open
        metaWhatsappTemplate={currentMetaWhatsappTemplate}
        onDeleteSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
    edit: currentMetaWhatsappTemplate && (
      <EditMetaWhatsappTemplateDialog
        open
        metaWhatsappTemplateId={
          currentMetaWhatsappTemplate.meta_whatsapp_template_id
        }
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<MetaWhatsappTemplateDetail>
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={rowData}
        onPageChange={onPageChange}
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        onGridStateChange={setAgGridState}
        height={160}
        actions={[
          {
            isView: validateAccess(META_WHATSAPP_TEMPLATE_PERMISSION.EDIT),
            onClick: (data) => {
              if (!data.meta_whatsapp_template_id) {
                return;
              }

              onDialogOpen("edit");
              setCurrentMetaWhatsappTemplate(data);
            },
            title: t("common.edit"),
          },
          {
            isView: validateAccess(META_WHATSAPP_TEMPLATE_PERMISSION.DELETE),
            onClick: (data) => {
              if (!data.meta_whatsapp_template_id) {
                return;
              }

              onDialogOpen("delete");
              setCurrentMetaWhatsappTemplate(data);
            },
            title: t("common.delete"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
