import { AgGrid } from "@codezee/sixtify-brahma";
import { useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import { useBankDetailColumns } from "@web/components/settings/trust-master/AddTrustMaster/BankDetail/BankDetailList/hooks/useBankDetailColumns";
import type { BankDetailFormFieldValues } from "@web/components/settings/trust-master/AddTrustMaster/BankDetail/Dialog/BankDetailForm";
import { DeleteBankDetailDialog } from "@web/components/settings/trust-master/AddTrustMaster/BankDetail/Dialog/DeleteBankDetailDialog";
import { EditBankDetailDialog } from "@web/components/settings/trust-master/AddTrustMaster/BankDetail/Dialog/EditBankDetailDialog";
import type { TrustMasterFormFieldValues } from "@web/components/settings/trust-master/AddTrustMaster/TrustMasterForm";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

type BankDetailListProps = {
  bankDetailFormValues: BankDetailFormFieldValues[];
  setValue: UseFormSetValue<TrustMasterFormFieldValues>;
};

export const BankDetailList = ({
  bankDetailFormValues,
  setValue,
}: BankDetailListProps) => {
  const [currentBankDetail, setCurrentBankDetail] =
    useState<BankDetailFormFieldValues>();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { column } = useBankDetailColumns({
    onAction: (actionType, bankDetail) => {
      onDialogOpen(actionType);
      setCurrentBankDetail(bankDetail);
    },
  });

  const dialogRenderer: DialogRenderer = {
    delete: currentBankDetail && (
      <DeleteBankDetailDialog
        open
        setValue={setValue}
        onClose={onDialogClose}
        bankDetail={currentBankDetail}
        bankDetailFormValues={bankDetailFormValues}
      />
    ),

    edit: currentBankDetail && (
      <EditBankDetailDialog
        open
        onClose={onDialogClose}
        bankDetail={currentBankDetail}
        onEdit={(formValues) => {
          const bankDetailData = bankDetailFormValues.map((bankDetail) => {
            if (bankDetail.acc_no === currentBankDetail.acc_no) {
              return { ...bankDetail, ...formValues };
            }

            return bankDetail;
          });

          setValue("bank_detail", bankDetailData);
          onDialogClose();
        }}
      />
    ),
  };

  return (
    <>
      <AgGrid<BankDetailFormFieldValues>
        rowData={bankDetailFormValues}
        rowModelType="clientSide"
        columnDefs={column}
        height="calc(100vh - 600px)"
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
