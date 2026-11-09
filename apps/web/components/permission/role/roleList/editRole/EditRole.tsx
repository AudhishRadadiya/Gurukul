import { Button, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import { useEditRoles } from "@web/components/permission/role/roleList/editRole/hooks/useEditRoles";
import { useGetRoles } from "@web/components/permission/role/roleList/editRole/hooks/useGetRoles";
import type {
  FormRef,
  RolesPermissionsFormFieldValues,
  SubModule,
} from "@web/components/permission/RolesPermissionsForm";
import { RolesPermissionsForm } from "@web/components/permission/RolesPermissionsForm";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

export const addSelectAllFlag = (modules: SubModule[]): SubModule[] => {
  return modules.map((module) => {
    const processedSubModules = module.sub_modules
      ? addSelectAllFlag(module.sub_modules)
      : undefined;

    const allPermissionsTrue = Object.values(module.permissions).every(
      (val) => val === true
    );

    const allSubmodulesSelected = processedSubModules
      ? processedSubModules.every((sub) => sub.select_all === true)
      : true;

    return {
      ...module,
      select_all: allPermissionsTrue && allSubmodulesSelected,
      sub_modules: processedSubModules,
    };
  });
};

type EditRoleProps = {
  roleId: string;
};

export const EditRole = ({ roleId }: EditRoleProps) => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const onCancel = () => {
    router.push("/permission/role?page=list-roles");
  };

  const { data: rolesDetails, isLoading: isPenaltyRuleLoading } = useGetRoles({
    roleId,
  });

  const { isPending, mutate } = useEditRoles({
    options: {
      onError: (error) => {
        onError(error, formRef.current?.setError);
      },
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        onCancel();
      },
    },
    roleId,
  });

  const onEditRoles = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (rolesDetails) {
      const rolesPermissionsFormFieldValues: RolesPermissionsFormFieldValues = {
        ...rolesDetails,
        modules: addSelectAllFlag(rolesDetails.modules),
      };

      return rolesPermissionsFormFieldValues;
    }
  }, [rolesDetails]);

  return (
    <Stack spacing={{ md: 3, xs: 2 }}>
      <RolesPermissionsForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPenaltyRuleLoading}
      />

      <Stack
        direction="row"
        gap="15px"
        justifyContent="flex-end"
        flexWrap="wrap"
        sx={{
          "& > *": {
            flex: { sm: "0 0 auto", xs: "1 1 auto" },
            minWidth: { sm: "auto", xs: "120px" },
          },
        }}
      >
        <Button variant="outlined" onClick={onCancel}>
          {t("common.cancel.button")}
        </Button>

        <EditAction
          disabled={isDisabled()}
          onClick={onEditRoles}
          loading={isPending}
        />
      </Stack>
    </Stack>
  );
};
