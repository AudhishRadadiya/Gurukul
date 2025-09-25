"use client";

import { FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import {
  type ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { RolesAutocomplete } from "@web/components/common/Autocomplete/RolesAutocomplete";
import { NestedModule } from "@web/components/permission/NestedModule";
import { addSelectAllFlag } from "@web/components/permission/role/roleList/editRole/EditRole";
import { useGetRoles } from "@web/components/permission/role/roleList/editRole/hooks/useGetRoles";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages } from "@web/utils/helper";

const permissionsSchema = z.object({
  create: z.boolean().optional(),
  delete: z.boolean().optional(),
  edit: z.boolean().optional(),
  view: z.boolean().optional(),
});

export type SubModule = {
  module_key: string;
  module_name: string;
  permissions: z.infer<typeof permissionsSchema>;
  select_all?: boolean;
  select_row?: boolean;
  sub_modules?: SubModule[];
};

const subModuleSchema: z.ZodType<SubModule> = z.lazy(() =>
  z.object({
    module_key: z.string(),
    module_name: z.string(),
    permissions: permissionsSchema,
    select_all: z.boolean().optional(),
    select_row: z.boolean().optional(),
    sub_modules: z.array(subModuleSchema),
  })
);

const RolesPermissionsFormSchema = z
  .object({
    is_user_permission: z.boolean().optional(),
    modules: z.array(subModuleSchema),
    role_id: z.string().nullable().optional(),
    role_name: z.string().max(50, "common.maxLength").nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.is_user_permission && !data.role_name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["role_name"],
      });
    }
  });

export type PermissionsFieldValues = z.infer<typeof permissionsSchema>;

export type RolesPermissionsFormFieldValues = z.infer<
  typeof RolesPermissionsFormSchema
>;

export type UserPermissionPayload = {
  modules: RolesPermissionsFormFieldValues["modules"];
};

type RolesPermissionsFormProps = {
  defaultValues?: RolesPermissionsFormFieldValues;
  isView?: boolean;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<RolesPermissionsFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<RolesPermissionsFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: RolesPermissionsFormFieldValues = {
  is_user_permission: false,
  modules: [
    {
      module_key: "25dcd1cb-980c-49e7-af8b-8f40fa95d013",
      module_name: "Payment gateway",
      permissions: {
        create: false,
        delete: false,
        edit: false,
        view: false,
      },
      sub_modules: [],
    },
    {
      module_key: "2acf2cf0-b22f-4c09-ac28-5629ad4fd213",
      module_name: "Address",
      permissions: {
        create: false,
        delete: false,
        edit: false,
        view: false,
      },
      sub_modules: [
        {
          module_key: "426235fc-50e7-4c36-809c-26e82ebd4496",
          module_name: "Address list",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "39ac9d6a-61fe-4e4e-85af-140ed9e0b938",
          module_name: "Address type",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "ccdcd737-1d8b-43d2-aca0-b2634a4bec05",
          module_name: "Master type and parameter",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "0922e4c3-4783-402c-bdba-f99a9a308ec1",
          module_name: "Donor address list",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "7cf801a4-133e-41a4-8c5b-8f5d0e06dd20",
          module_name: "Address book",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "ccdcd737-1d8b-43d2-aca0-b2634a4bec05",
          module_name: "Master type and parameter",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "39ac9d6a-61fe-4e4e-85af-140ed9e0b938",
          module_name: "Address type",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
      ],
    },
    {
      module_key: "383b52d9-1492-4e49-aede-06c7fe65430a",
      module_name: "Event",
      permissions: {
        create: false,
        delete: false,
        edit: false,
        view: false,
      },
      sub_modules: [
        {
          module_key: "a7268fd2-5c5e-48dc-a056-1877ca757905",
          module_name: "Event donation list",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "cbb436bb-b6e0-43d6-a5ff-f4aebac738c9",
          module_name: "Event Master",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "a7268fd2-5c5e-48dc-a056-1877ca757905",
          module_name: "Event donation list",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "cbb436bb-b6e0-43d6-a5ff-f4aebac738c9",
          module_name: "Event Master",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "c1369dd4-63b1-44f4-8d16-71448b1d5bc5",
          module_name: "Event donation entry",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "855ebc20-1f17-4fd2-8eab-364457b0e795",
          module_name: "Event Donation Entry",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "49d71be2-7117-48f9-9dae-bad8de6ec560",
          module_name: "Event summary report",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "07a7e240-cc7f-4e2d-a975-b62a67f197fb",
          module_name: "Event reminder list",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
      ],
    },
    {
      module_key: "6afc0e20-940e-4bd5-aabb-672bd8435433",
      module_name: "Donation",
      permissions: {
        create: false,
        delete: false,
        edit: false,
        view: false,
      },
      sub_modules: [
        {
          module_key: "fb2c5622-fbd4-462f-9cd4-b0558741b9fa",
          module_name: "Donation import from Excel",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "b1ec98a4-3ab3-459e-a05d-2c3a36903a0b",
          module_name: "Daily Collection report",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "78e3554e-c156-421e-8a98-7974645503c0",
          module_name: "Suvichar Master",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "0d03c61c-6982-482c-90eb-2eb83c103726",
          module_name: "Donation master",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "352e504f-9bf0-4fcc-81f7-e3e1395d1646",
          module_name: "Bank master",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "74b4f06d-e148-432a-a6ee-f183bbe1315a",
          module_name: "A/C year master",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "523193d2-c046-4f53-9675-9b925cd40140",
          module_name: "Donation mode",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "a7fded2f-4549-4afa-834e-03a1c7428498",
          module_name: "Cheque Reconciliation",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "e1e443f8-2473-4e51-8af8-c290b5ffe82f",
          module_name: "Donation collection report",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "7b89460a-cf0d-4585-9c34-2df1c79f8797",
          module_name: "Trust Master",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "78e3554e-c156-421e-8a98-7974645503c0",
          module_name: "Suvichar Master",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "74b4f06d-e148-432a-a6ee-f183bbe1315a",
          module_name: "A/C year master",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "e6e3b0c2-d8e1-4a6f-9b0b-b6f69538ed48",
          module_name: "Booking type Master",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "352e504f-9bf0-4fcc-81f7-e3e1395d1646",
          module_name: "Bank master",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "81183953-187c-438c-b47a-f22a0ff65163",
          module_name: "Donation Report",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "b1ec98a4-3ab3-459e-a05d-2c3a36903a0b",
          module_name: "Daily Collection report",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "e62635b4-5a79-4d37-b361-48f5136463e6",
          module_name: "Cancel Receipt",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "a7fded2f-4549-4afa-834e-03a1c7428498",
          module_name: "Cheque Reconciliation",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "0ce6a8c0-d8ae-40d4-95a0-350e13174e52",
          module_name: "Donation summary",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "e1e443f8-2473-4e51-8af8-c290b5ffe82f",
          module_name: "Donation collection report",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "523193d2-c046-4f53-9675-9b925cd40140",
          module_name: "Donation mode",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "4b1b4621-4a3c-4cf8-a697-18535352f3f4",
          module_name: "Donation entry",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "52c483bf-6a12-474e-8c9a-70319e8f5e20",
          module_name: "Booking Entry",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "0d03c61c-6982-482c-90eb-2eb83c103726",
          module_name: "Donation master",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "49b99e6a-ab8c-4e1b-a244-c306fed07bb4",
          module_name: "Donation list",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
      ],
    },
    {
      module_key: "83e38dc5-c4c2-4282-89a4-74d30d90dd2b",
      module_name: "User",
      permissions: {
        create: false,
        delete: false,
        edit: false,
        view: false,
      },
      sub_modules: [
        {
          module_key: "384c3c6a-5516-4c88-a074-45ee70d68d26",
          module_name: "User Permission",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "384c3c6a-5516-4c88-a074-45ee70d68d26",
          module_name: "User Permission",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "384c3c6a-5516-4c88-a074-45ee70d68d26",
          module_name: "User Permission",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "9e5c4045-980f-4681-aa30-7a6276d225df",
          module_name: "User Master",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "2cedd2e9-9657-4aca-b758-cf2d3a66adcc",
          module_name: "User login report",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "5156c442-5192-4bf4-8a45-4082a352cb59",
          module_name: "Roll Entry and permission",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "5156c442-5192-4bf4-8a45-4082a352cb59",
          module_name: "Roll Entry and permission",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "2cedd2e9-9657-4aca-b758-cf2d3a66adcc",
          module_name: "User login report",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "9e5c4045-980f-4681-aa30-7a6276d225df",
          module_name: "User Master",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "5156c442-5192-4bf4-8a45-4082a352cb59",
          module_name: "Roll Entry and permission",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
      ],
    },
    {
      module_key: "fa5aac80-c587-4fb0-a438-a0fe7014b245",
      module_name: "Settings",
      permissions: {
        create: false,
        delete: false,
        edit: false,
        view: false,
      },
      sub_modules: [
        {
          module_key: "cf97b63d-2997-452f-a95d-7796cb25a641",
          module_name: "sms template",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "54f14f77-3119-43a0-a963-857e3cde14c0",
          module_name: "sms settings",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "55659c5a-df79-4c22-9967-ab50edf3f7b9",
          module_name: "Branch master",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "d71e342c-c240-4a22-87df-09ec6734fc6a",
          module_name: "email settings",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "d71e342c-c240-4a22-87df-09ec6734fc6a",
          module_name: "email settings",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "1afe7ca1-ab37-4454-a6c5-aa3d5dc7a20b",
          module_name: "Sms master",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "55659c5a-df79-4c22-9967-ab50edf3f7b9",
          module_name: "Branch master",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "1afe7ca1-ab37-4454-a6c5-aa3d5dc7a20b",
          module_name: "Sms master",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "cf97b63d-2997-452f-a95d-7796cb25a641",
          module_name: "sms template",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
        {
          module_key: "c603da40-9a78-4506-99b2-5b95c150f146",
          module_name: "Change password",
          permissions: {
            create: false,
            delete: false,
            edit: false,
            view: false,
          },
          sub_modules: [],
        },
      ],
    },
  ],
  role_id: null,
  role_name: null,
};

export const RolesPermissionsForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      isView = false,
      loading,
    }: RolesPermissionsFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const methods = useForm({
      mode: "all",
      resolver: zodResolver(RolesPermissionsFormSchema),
      values: defaultValues,
    });

    const {
      control,
      formState: { errors },
      handleSubmit,
      setError,
      setValue,
      watch,
    } = methods;

    const permissionsData = watch("modules");

    const roleId = watch("role_id") ?? "";

    useEnableDisableButton({ control, defaultValues, errors });

    const updatePermissions = (
      modules: SubModule[],
      parentView: boolean = true
    ): SubModule[] =>
      modules.map((mod): SubModule => {
        const newPermissions = { ...mod.permissions };

        if (!parentView) {
          Object.keys(newPermissions).forEach((key) => {
            newPermissions[key as keyof SubModule["permissions"]] = false;
          });
        }

        return {
          ...mod,
          permissions: newPermissions,
          sub_modules: updatePermissions(
            mod.sub_modules ?? [],
            newPermissions.view ?? parentView
          ),
        };
      });

    useImperativeHandle(ref, () => ({
      setError,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filteredValues = { ...formValues };

          const updatedPermissions = updatePermissions(
            filteredValues.modules ?? []
          );

          onSubmit({ ...filteredValues, modules: updatedPermissions });
        })();
      },
    }));

    const { data: rolesDetails } = useGetRoles({
      roleId,
    });

    useMemo(() => {
      if (rolesDetails && roleId) {
        return setValue("modules", addSelectAllFlag(rolesDetails.modules));
      }

      return setValue("modules", defaultValues.modules);
    }, [rolesDetails, roleId]);

    return (
      <FormProvider {...methods}>
        <Stack gap="40px">
          <Stack gap="15px">
            <FormRow maxColumn={3}>
              {watch("is_user_permission") ? (
                <RolesAutocomplete name="role_id" control={control} />
              ) : (
                <TextField
                  loading={loading}
                  control={control}
                  disabled={isView}
                  label={t("common.role.name.label")}
                  name="role_name"
                  required
                  error={!!errors.role_name}
                  helperText={errorMessages(errors.role_name?.message)}
                />
              )}
            </FormRow>
            <Typography variant="h6">{t("permission.menu.label")}</Typography>

            <Typography variant="body2">
              {t("common.role.page.typography")}
            </Typography>

            <Box>
              {permissionsData.length > 0 &&
                permissionsData.map((module, index) => (
                  <NestedModule
                    loading={loading}
                    isView={isView}
                    key={module.module_key}
                    module={module}
                    moduleIndex={index}
                  />
                ))}
            </Box>
          </Stack>
        </Stack>
      </FormProvider>
    );
  }
);

RolesPermissionsForm.displayName = "RolesPermissionsForm";
