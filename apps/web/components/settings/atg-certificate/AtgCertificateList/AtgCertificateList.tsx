import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DeleteAtgCertificateDialog } from "@web/components/settings/atg-certificate/AtgCertificateList/Dialogs/DeleteAtgCertificateDialog";
import { EditAtgCertificateDialog } from "@web/components/settings/atg-certificate/AtgCertificateList/Dialogs/EditAtgCertificateDialog";
import { useAtgCertificateColumns } from "@web/components/settings/atg-certificate/AtgCertificateList/hooks/useAtgCertificateColumns";
import {
  type AtgCertificate,
  useGetAtgCertificate,
} from "@web/components/settings/atg-certificate/AtgCertificateList/hooks/useGetAtgCertificate";
import { ATG_CERTIFICATE_PERMISSION } from "@web/constants/permission/settings/atgCertificate/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

export const AtgCertificateList = () => {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { validateAccess } = useUserPermissions();

  const [currentAtgCertificate, setCurrentAtgCertificate] =
    useState<AtgCertificate>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetAtgCertificate({
    endRow,
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { certificateDetails, totalCount } = data || {};

  const { column } = useAtgCertificateColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentAtgCertificate && (
      <DeleteAtgCertificateDialog
        open
        certificate={currentAtgCertificate}
        onDeleteSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),

    edit: currentAtgCertificate && (
      <EditAtgCertificateDialog
        open
        certificateId={currentAtgCertificate.certificate_id}
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<AtgCertificate>
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={certificateDetails}
        onPageChange={onPageChange}
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        onGridStateChange={setAgGridState}
        height={160}
        actions={[
          {
            isView: validateAccess(ATG_CERTIFICATE_PERMISSION.EDIT),
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentAtgCertificate(data);
            },
            title: t("common.edit"),
          },
          {
            isView: validateAccess(ATG_CERTIFICATE_PERMISSION.DELETE),
            onClick: (data) => {
              onDialogOpen("delete");
              setCurrentAtgCertificate(data);
            },
            title: t("common.delete"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
