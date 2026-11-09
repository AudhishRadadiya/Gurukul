import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DeleteCsrCertificateDialog } from "@web/components/settings/csr-certificate/CsrCertificateList/Dialogs/DeleteCsrCertificateDialog";
import { EditCsrCertificateDialog } from "@web/components/settings/csr-certificate/CsrCertificateList/Dialogs/EditCsrCertificateDialog";
import { useCsrCertificateColumns } from "@web/components/settings/csr-certificate/CsrCertificateList/hooks/useCsrCertificateColumns";
import {
  useGetCsrCertificate,
  type CsrCertificate,
} from "@web/components/settings/csr-certificate/CsrCertificateList/hooks/useGetCsrCertificate";
import { CSR_CERTIFICATE_PERMISSION } from "@web/constants/permission/settings/csrCertificate/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

export const CsrCertificateList = () => {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { validateAccess } = useUserPermissions();

  const [currentCsrCertificate, setCurrentCsrCertificate] =
    useState<CsrCertificate>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetCsrCertificate({
    endRow,
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { certificateDetails, totalCount } = data || {};

  const { column } = useCsrCertificateColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentCsrCertificate && (
      <DeleteCsrCertificateDialog
        open
        certificate={currentCsrCertificate}
        onDeleteSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),

    edit: currentCsrCertificate && (
      <EditCsrCertificateDialog
        open
        certificateId={currentCsrCertificate.certificate_id}
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<CsrCertificate>
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
            isView: validateAccess(CSR_CERTIFICATE_PERMISSION.EDIT),
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentCsrCertificate(data);
            },
            title: t("common.edit"),
          },
          {
            isView: validateAccess(CSR_CERTIFICATE_PERMISSION.DELETE),
            onClick: (data) => {
              onDialogOpen("delete");
              setCurrentCsrCertificate(data);
            },
            title: t("common.delete"),
          },
        ]}
      />
      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
