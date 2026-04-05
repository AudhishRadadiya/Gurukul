import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { useAddUserMaster } from "@web/components/user/user-master/AddUserMaster/hooks/useAddUserMaster";
import {
  UserMasterFrom,
  type FormRef,
} from "@web/components/user/user-master/AddUserMaster/UserMasterFrom";
import { onError } from "@web/utils/errors";

export const AddUserMaster = () => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { isPending, mutate } = useAddUserMaster({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/user/user-master");
      },
    },
  });

  const onCreateUserMaster = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <>
      <UserMasterFrom ref={formRef} />

      <PadBox padding={{ padding: "20px 20px 0 0" }}>
        <Stack direction="row" justifyContent="end" gap="10px">
          <Button
            variant="outlined"
            onClick={() => {
              router.push("/user/user-master");
            }}
          >
            {t("common.cancel.button")}
          </Button>

          <Button loading={isPending} onClick={onCreateUserMaster}>
            {t("common.save.button")}
          </Button>
        </Stack>
      </PadBox>
    </>
  );
};
