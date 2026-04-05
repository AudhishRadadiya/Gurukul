import {
  toasts,
  ButtonContainer,
  Button,
  Dialog,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import { useAddPaymentGateway } from "@web/components/settings/paymentGateway/dialog/hooks/useAddPaymentGateway";
import type { FormRef } from "@web/components/settings/paymentGateway/dialog/PaymentGatewayForm";
import { PaymentGatewayForm } from "@web/components/settings/paymentGateway/dialog/PaymentGatewayForm";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type AddPaymentGatewayDialogProps = {
  onAddSuccess: () => void;
  onClose: () => void;
  open: boolean;
};

export const AddPaymentGatewayDialog = ({
  onAddSuccess,
  onClose,
  open,
}: AddPaymentGatewayDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useAddPaymentGateway({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),

      onSuccess: (data) => {
        onClose();

        onAddSuccess();

        toasts.success({ title: data.message });
      },
    },
  });

  const onCreatePaymentGateway = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title={t("common.button.add", {
        label: t("payment.gateway.menu.label"),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <Button
            onClick={onCreatePaymentGateway}
            loading={isPending}
            disabled={isDisabled()}
          >
            {t("common.save.button")}
          </Button>
        </ButtonContainer>
      }
    >
      <PaymentGatewayForm ref={formRef} />
    </Dialog>
  );
};
