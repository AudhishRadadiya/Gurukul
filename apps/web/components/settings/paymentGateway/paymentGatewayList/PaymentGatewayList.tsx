import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { EditPaymentGatewayDialog } from "@web/components/settings/paymentGateway/dialog/EditPaymentGatewayDialog";
import type { PaymentGatewayDetail } from "@web/components/settings/paymentGateway/paymentGatewayList/hooks/useGetPaymentGateway";
import { useGetPaymentGateway } from "@web/components/settings/paymentGateway/paymentGatewayList/hooks/useGetPaymentGateway";
import { usePaymentGatewayColumns } from "@web/components/settings/paymentGateway/paymentGatewayList/hooks/usePaymentGatewayColumns";
import { PAYMENT_GATEWAY_PERMISSION } from "@web/constants/permission/settings/paymentGateway/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";

export const PaymentGatewayList = () => {
  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const [currentPaymentGateway, setCurrentPaymentGateway] =
    useState<PaymentGatewayDetail>();

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetPaymentGateway({
    endRow,
    filterModel: agGridFilterModel,
    startRow,
  });

  const { paymentGatewayList: rowData, totalCount } = data || {};

  const { column } = usePaymentGatewayColumns();

  const dialogRenderer: DialogRenderer = {
    edit: currentPaymentGateway && (
      <EditPaymentGatewayDialog
        open
        paymentGatewayId={currentPaymentGateway?.payment_gateway_id}
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<PaymentGatewayDetail>
        isLoading={isFetching}
        page={page}
        rowData={rowData}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        count={totalCount}
        onFilterChange={setAgGridFilterModel}
        onRowsPerPageChange={onRowsPerPageChange}
        height={200}
        actions={[
          {
            isView: validateAccess(PAYMENT_GATEWAY_PERMISSION.EDIT),
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentPaymentGateway(data);
            },
            title: t("common.edit"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

PaymentGatewayList.displayName = "PaymentGatewayList";
