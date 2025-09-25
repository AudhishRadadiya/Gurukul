import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";

import { useDeleteFinancialYearMaster } from "@web/components/settings/financial-year-master/FinancialYearMasterList/Dialogs/hooks/useDeleteFinancialYearMaster";
import type { FinancialYear } from "@web/components/settings/financial-year-master/FinancialYearMasterList/hooks/useGetFinancialYearMaster";
import { onError } from "@web/utils/errors";

type DeleteFinancialMasterDialogProps = {
  financialYear: FinancialYear;
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
};

export const DeleteFinancialYearMasterDialog = ({
  financialYear,
  onClose,
  onDeleteSuccess,
  open,
}: DeleteFinancialMasterDialogProps) => {
  const { t } = useTranslation();

  const { isPending, mutate } = useDeleteFinancialYearMaster({
    financialYearId: financialYear.financial_year_id,
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        onClose();
        onDeleteSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  return (
    <DeleteDialog
      title={t("dialog.delete.message", {
        deleteMessage: financialYear.financial_year,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
