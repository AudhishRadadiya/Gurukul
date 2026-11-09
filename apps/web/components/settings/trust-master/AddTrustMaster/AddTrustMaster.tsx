import {
  Button,
  ButtonContainer,
  PadBox,
  toasts,
} from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { useAddTrustMaster } from "@web/components/settings/trust-master/AddTrustMaster/hooks/useAddTrustMaster";
import type { FormRef } from "@web/components/settings/trust-master/AddTrustMaster/TrustMasterForm";
import { TrustMasterForm } from "@web/components/settings/trust-master/AddTrustMaster/TrustMasterForm";
import { onError } from "@web/utils/errors";

export const AddTrustMaster = () => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { isPending, mutate } = useAddTrustMaster({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),

      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/settings/trust-master");
      },
    },
  });

  const onCreateTrustMaster = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <PadBox padding={{ padding: { md: "20px", xs: "12px 10px" } }}>
      <Stack gap={{ md: "10px", xs: "8px" }}>
        <TrustMasterForm ref={formRef} loading={isPending} />

        <ButtonContainer>
          <Button
            variant="outlined"
            onClick={() => {
              router.push("/settings/trust-master");
            }}
          >
            {t("common.cancel.button")}
          </Button>

          <Button loading={isPending} onClick={onCreateTrustMaster}>
            {t("common.save.button")}
          </Button>
        </ButtonContainer>
      </Stack>
    </PadBox>
  );
};
