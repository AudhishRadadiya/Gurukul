import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useCallback } from "react";
import type { UseFormSetValue } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { BankDetailFormFieldValues } from "@web/components/settings/trust-master/AddTrustMaster/BankDetail/Dialog/BankDetailForm";
import type { TrustMasterFormFieldValues } from "@web/components/settings/trust-master/AddTrustMaster/TrustMasterForm";

type DeleteBankDetailDialogProps = {
  bankDetail: BankDetailFormFieldValues;
  bankDetailFormValues: BankDetailFormFieldValues[];
  onClose: () => void;
  open: boolean;
  setValue: UseFormSetValue<TrustMasterFormFieldValues>;
};

export const DeleteBankDetailDialog = ({
  bankDetail,
  bankDetailFormValues,
  onClose,
  open,
  setValue,
}: DeleteBankDetailDialogProps) => {
  const { t } = useTranslation();

  const onDeleteDocumentHandler = useCallback(() => {
    const bankDetailData = bankDetailFormValues.filter(
      (documentObj) => documentObj.acc_no !== bankDetail.acc_no
    );

    setValue("bank_detail", bankDetailData);

    onClose();

    toasts.success({
      title: t("dialog.delete.success", {
        deleteMessage: bankDetail.bank_name,
      }),
    });
  }, [bankDetailFormValues, bankDetail]);

  return (
    <DeleteDialog
      title={t("dialog.delete.message", {
        deleteMessage: bankDetail.bank_name,
      })}
      open={open}
      isDeleteLoading={false}
      onDelete={() => onDeleteDocumentHandler()}
      onClose={() => onClose()}
    />
  );
};
