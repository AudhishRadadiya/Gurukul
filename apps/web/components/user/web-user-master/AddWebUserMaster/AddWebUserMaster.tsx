import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { useAddWebUserMaster } from "@web/components/user/web-user-master/AddWebUserMaster/hooks/useAddWebUserMaster";
import {
  WebUserMasterForm,
  type WebUserMasterFormRef,
} from "@web/components/user/web-user-master/AddWebUserMaster/WebUserMasterForm";
import { onError } from "@web/utils/errors";

export const AddWebUserMaster = () => {
  const router = useRouter();

  const formRef = useRef<WebUserMasterFormRef>(null);

  const { isPending, mutate } = useAddWebUserMaster({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/user/web-user-master");
      },
    },
  });

  const onCreateWebUserMaster = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <PadBox padding={{ padding: { sm: "10px", xs: "8px" } }}>
      <Stack gap="10px">
        <WebUserMasterForm ref={formRef} />

        <PadBox padding={{ padding: "20px 20px 0 0" }}>
          <Stack direction="row" justifyContent="end" gap="10px">
            <Button
              variant="outlined"
              onClick={() => router.push("/user/web-user-master")}
            >
              {t("common.cancel.button")}
            </Button>
            <Button loading={isPending} onClick={onCreateWebUserMaster}>
              {t("common.save.button")}
            </Button>
          </Stack>
        </PadBox>
      </Stack>
    </PadBox>
  );
};
