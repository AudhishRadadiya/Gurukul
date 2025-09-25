import { Button, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import type {
  FormRef,
  UserMasterFormFieldValues,
} from "@web/components/user/user-master/AddUserMaster/UserMasterFrom";
import { UserMasterFrom } from "@web/components/user/user-master/AddUserMaster/UserMasterFrom";
import { useEditUserMaster } from "@web/components/user/user-master/EditUserMaster/hooks/useEditUserMaster";
import { useGetUserMasterDetails } from "@web/components/user/user-master/EditUserMaster/hooks/useGetUserMasterDetails";
import { onError } from "@web/utils/errors";

type EditUserMasterProps = {
  userId: string;
};

export const EditUserMaster = ({ userId }: EditUserMasterProps) => {
  const formRef = useRef<FormRef>(null);

  const router = useRouter();

  const { data: userDetails, isLoading: isUserMasterLoading } =
    useGetUserMasterDetails({
      userId,
    });

  const { isPending, mutate } = useEditUserMaster({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: async (data) => {
        toasts.success({ title: data.message });
        router.push("/user/user-master");
      },
    },
    userId,
  });

  const onEditUserMaster = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (userDetails) {
      const userMasterFormFieldValues: UserMasterFormFieldValues = {
        ...userDetails,
        // eslint-disable-next-line sonarjs/no-hardcoded-credentials
        password: "DummyPassword@123",
      };

      return userMasterFormFieldValues;
    }
  }, [userDetails]);

  return (
    <Stack spacing={2}>
      <UserMasterFrom
        ref={formRef}
        defaultValues={defaultValues}
        loading={isUserMasterLoading}
      />

      <Stack direction="row" gap="15px" justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={() => {
            router.push("/user/user-master");
          }}
        >
          {t("common.cancel.button")}
        </Button>

        <EditAction onClick={onEditUserMaster} loading={isPending} />
      </Stack>
    </Stack>
  );
};
