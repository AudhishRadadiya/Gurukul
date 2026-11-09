import { Button, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import {
  WebUserMasterForm,
  type WebUserMasterFormRef,
} from "@web/components/user/web-user-master/AddWebUserMaster/WebUserMasterForm";
import { useEditWebUserMaster } from "@web/components/user/web-user-master/EditWebUserMaster/hooks/useEditWebUserMaster";
import { useGetWebUserMasterDetails } from "@web/components/user/web-user-master/EditWebUserMaster/hooks/useGetWebUserMasterDetails";
import { onError } from "@web/utils/errors";

export const EditWebUserMaster = ({ webUserId }: { webUserId: string }) => {
  const router = useRouter();

  const formRef = useRef<WebUserMasterFormRef>(null);

  const { data: webUserMasterDetails, isLoading } = useGetWebUserMasterDetails({
    webUserId,
  });

  const { isPending, mutate } = useEditWebUserMaster({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (response) => {
        toasts.success({ title: response.message });
        router.push("/user/web-user-master");
      },
    },
    webUserId,
  });

  const onEditWebUserMaster = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Stack spacing={2}>
      <WebUserMasterForm
        ref={formRef}
        defaultValues={webUserMasterDetails}
        loading={isLoading}
      />
      <Stack direction="row" gap="15px" justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={() => {
            router.push("/user/web-user-master");
          }}
        >
          {t("common.cancel.button")}
        </Button>

        <EditAction onClick={onEditWebUserMaster} loading={isPending} />
      </Stack>
    </Stack>
  );
};
