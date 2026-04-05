import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useMemo, useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import { useEditPaymentGateway } from "@web/components/settings/paymentGateway/dialog/hooks/useEditPaymentGateway";
import type { UseGetPaymentGatewayDetailsArgs } from "@web/components/settings/paymentGateway/dialog/hooks/useGetPaymentGatewayDetails";
import { useGetPaymentGatewayDetails } from "@web/components/settings/paymentGateway/dialog/hooks/useGetPaymentGatewayDetails";
import type {
  FormRef,
  PaymentGatewayFormFieldValues,
} from "@web/components/settings/paymentGateway/dialog/PaymentGatewayForm";
import { PaymentGatewayForm } from "@web/components/settings/paymentGateway/dialog/PaymentGatewayForm";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditPaymentGatewayDialogProps = {
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
} & UseGetPaymentGatewayDetailsArgs;

export const EditPaymentGatewayDialog = ({
  onClose,
  onEditSuccess,
  open,
  paymentGatewayId,
}: EditPaymentGatewayDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: paymentGatewayData, isPending: isPendingPaymentGatewayData } =
    useGetPaymentGatewayDetails({
      paymentGatewayId,
    });

  const { isPending, mutate } = useEditPaymentGateway({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),

      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
    paymentGatewayId,
  });

  const onEditPaymentGateway = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (paymentGatewayData) {
      const paymentGatewayFormFieldValues: PaymentGatewayFormFieldValues = {
        ...paymentGatewayData,
        secret_key: "DummySecretKey@123",
      };

      return paymentGatewayFormFieldValues;
    }
  }, [paymentGatewayData]);

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title={t("common.edit.label", {
        label: t("payment.gateway.menu.label"),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            loading={isPending}
            onClick={onEditPaymentGateway}
            disabled={isDisabled()}
          />
        </ButtonContainer>
      }
    >
      <PaymentGatewayForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingPaymentGatewayData}
      />
    </Dialog>
  );
};
