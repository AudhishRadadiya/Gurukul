import { Button, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import type { FormRef } from "@web/components/settings/trust-master/AddTrustMaster/TrustMasterForm";
import { TrustMasterForm } from "@web/components/settings/trust-master/AddTrustMaster/TrustMasterForm";
import { useEditTrustMaster } from "@web/components/settings/trust-master/EditTrustMaster/hooks/useEditTrustMaster";
import { useGetTrustMasterDetails } from "@web/components/settings/trust-master/EditTrustMaster/hooks/useGetTrustMaster";
import { onError } from "@web/utils/errors";

type EditTrustMasterProps = {
  trustMasterId: string;
};
export const EditTrustMaster = ({ trustMasterId }: EditTrustMasterProps) => {
  const formRef = useRef<FormRef>(null);

  const router = useRouter();

  const { data: trustMasterDetails, isLoading: isTrustMasterLoading } =
    useGetTrustMasterDetails({
      trustMasterId,
    });

  const { isPending, mutate } = useEditTrustMaster({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/settings/trust-master");
      },
    },
    trustMasterId,
  });

  const onEditTrustMaster = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Stack spacing={2}>
      <TrustMasterForm
        ref={formRef}
        defaultValues={trustMasterDetails}
        loading={isTrustMasterLoading}
      />

      <Stack direction="row" gap="15px" justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={() => {
            router.push("/settings/trust-master");
          }}
        >
          {t("common.cancel.button")}
        </Button>

        <EditAction onClick={onEditTrustMaster} loading={isPending} />
      </Stack>
    </Stack>
  );
};
