import { Button, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";

import { useGetPermissionModules } from "@web/components/permission/hooks/useGetPermissionModules";
import type {
  FormRef,
  RolesPermissionsFormFieldValues,
} from "@web/components/permission/RolesPermissionsForm";
import { RolesPermissionsForm } from "@web/components/permission/RolesPermissionsForm";
import { useAddUserPermissions } from "@web/components/permission/user-permissions/addUserPermissions/hooks/useAddUserPermissions";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type AddUserPermissionsProps = {
  userId: string;
};

export const AddUserPermissions = ({ userId }: AddUserPermissionsProps) => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: permissionModulesData, isLoading } = useGetPermissionModules();

  const defaultValues: RolesPermissionsFormFieldValues = useMemo(() => {
    return {
      is_user_permission: true,
      modules: permissionModulesData ?? [],
      role_id: null,
      role_name: null,
    };
  }, [permissionModulesData]);

  const { isPending, mutate } = useAddUserPermissions({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/permission/user-permissions?page=list-user-permissions");
      },
    },
    userId,
  });

  const onUserPermissionsCreate = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Stack gap="20px">
      <RolesPermissionsForm
        ref={formRef}
        loading={isLoading}
        defaultValues={defaultValues}
      />

      <Stack direction="row" justifyContent="end" gap="10px">
        <Button
          variant="outlined"
          onClick={() => {
            router.push(
              "/permission/user-permissions?page=list-user-permissions"
            );
          }}
        >
          {t("common.cancel.button")}
        </Button>

        <Button
          loading={isPending}
          onClick={onUserPermissionsCreate}
          disabled={isDisabled()}
        >
          {t("common.save.button")}
        </Button>
      </Stack>
    </Stack>
  );
};
