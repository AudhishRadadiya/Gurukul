import { Button, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";

import { useGetPermissionModules } from "@web/components/permission/hooks/useGetPermissionModules";
import { useAddRoles } from "@web/components/permission/role/addRole/hooks/useAddRoles";
import {
  RolesPermissionsForm,
  type FormRef,
  type RolesPermissionsFormFieldValues,
} from "@web/components/permission/RolesPermissionsForm";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

export const AddRoles = () => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: permissionModulesData } = useGetPermissionModules();

  const defaultValues: RolesPermissionsFormFieldValues = useMemo(() => {
    return {
      is_user_permission: false,
      modules: permissionModulesData ?? [],
      role_id: null,
      role_name: null,
    };
  }, [permissionModulesData]);

  const { isPending, mutate } = useAddRoles({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/permission/role?page=list-roles");
      },
    },
  });

  const onRolesCreate = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Stack gap="20px">
      <RolesPermissionsForm ref={formRef} defaultValues={defaultValues} />

      <Stack direction="row" justifyContent="end" gap="10px">
        <Button
          variant="outlined"
          onClick={() => {
            router.push("/permission/role?page=list-roles");
          }}
        >
          {t("common.cancel.button")}
        </Button>

        <Button
          loading={isPending}
          onClick={onRolesCreate}
          disabled={isDisabled()}
        >
          {t("common.save.button")}
        </Button>
      </Stack>
    </Stack>
  );
};
