import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import type { FormRef } from "@web/components/settings/financial-year-master/Dialogs/FinancialYearMasterForm";
import { FinancialYearMasterForm } from "@web/components/settings/financial-year-master/Dialogs/FinancialYearMasterForm";
import { useEditFinancialYearMaster } from "@web/components/settings/financial-year-master/FinancialYearMasterList/Dialogs/hooks/useEditFinancialYearMaster";
import { useGetFinancialYearMasterDetails } from "@web/components/settings/financial-year-master/FinancialYearMasterList/Dialogs/hooks/useGetFinancialYearMasterDetails";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditFinancialYearMasterDialogProps = {
  financialYearId: string;
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
};

export const EditFinancialYearMasterDialog = ({
  financialYearId,
  onClose,
  onEditSuccess,
  open,
}: EditFinancialYearMasterDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const {
    data: financialYearMasterData,
    isPending: isPendingFinancialYearMasterData,
  } = useGetFinancialYearMasterDetails({
    financialYearId,
  });

  const { isPending, mutate } = useEditFinancialYearMaster({
    financialYearId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onEditFinancialYearMaster = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Edit Financial Year"
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEditFinancialYearMaster}
            loading={isPending}
            disabled={isDisabled()}
          />
        </ButtonContainer>
      }
    >
      <FinancialYearMasterForm
        ref={formRef}
        defaultValues={financialYearMasterData}
        loading={isPendingFinancialYearMasterData}
      />
    </Dialog>
  );
};
