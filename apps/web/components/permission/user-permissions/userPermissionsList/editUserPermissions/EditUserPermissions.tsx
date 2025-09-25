import { Button, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import { addSelectAllFlag } from "@web/components/permission/role/roleList/editRole/EditRole";
import type {
  FormRef,
  RolesPermissionsFormFieldValues,
} from "@web/components/permission/RolesPermissionsForm";
import { RolesPermissionsForm } from "@web/components/permission/RolesPermissionsForm";
import { useEditUserPermissions } from "@web/components/permission/user-permissions/userPermissionsList/editUserPermissions/hooks/useEditUserPermissions";
import { useGetUserPermissionsData } from "@web/components/permission/user-permissions/userPermissionsList/editUserPermissions/hooks/useGetUserPermissionsData";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditUserPermissionsProps = {
  userId: string;
};

export const EditUserPermissions = ({ userId }: EditUserPermissionsProps) => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const onCancel = () => {
    router.push("/permission/role?page=list-user-permissions");
  };

  const { data: rolesDetails, isLoading: isPenaltyRuleLoading } =
    useGetUserPermissionsData({
      userId,
    });

  const { isPending, mutate } = useEditUserPermissions({
    options: {
      onError: (error) => {
        onError(error, formRef.current?.setError);
      },
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        onCancel();
      },
    },
    userId,
  });

  const onEditUserPermissions = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues: RolesPermissionsFormFieldValues = useMemo(() => {
    return {
      is_user_permission: true,
      modules: rolesDetails ? addSelectAllFlag(rolesDetails.modules) : [],
      role_id: null,
      role_name: null,
    };
  }, [rolesDetails]);

  return (
    <Stack spacing={2}>
      <RolesPermissionsForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPenaltyRuleLoading}
      />

      <Stack direction="row" gap="15px" justifyContent="flex-end">
        <Button variant="outlined" onClick={onCancel}>
          {t("common.cancel.button")}
        </Button>

        <EditAction
          disabled={isDisabled()}
          onClick={onEditUserPermissions}
          loading={isPending}
        />
      </Stack>
    </Stack>
  );
};
