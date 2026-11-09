import { CheckBox, useGetDeviceType } from "@codezee/sixtify-brahma";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import {
  Accordion,
  AccordionDetails,
  Box,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import _capitalize from "lodash/capitalize";
import _has from "lodash/has";
import _mapValues from "lodash/mapValues";
import { useCallback, useMemo, useState } from "react";
import { type Path, useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import type { RolesPermissionsFormFieldValues } from "@web/components/permission/RolesPermissionsForm";

export type Permission = Partial<{
  create: boolean;
  delete: boolean;
  edit: boolean;
  view: boolean;
}>;

type Module = {
  module_key: string;
  module_name: string;
  parent_key?: string;
  permissions: Permission;
  select_all?: boolean;
  select_row?: boolean;
  sub_modules?: Module[];
};

type NestedModuleProps = {
  isView?: boolean;
  loading?: boolean;
  module: Module;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moduleIndex: any;
};

const updateModulePermissionsRecursively = (
  module: Module,
  selectAll: boolean,
  isDefaultSelected: boolean
): Module => {
  const updatedModule = { ...module };

  updatedModule.select_all = selectAll;

  for (const key in updatedModule.permissions) {
    if (_has(updatedModule.permissions, key)) {
      if (isDefaultSelected && key === "view" && !selectAll) {
        continue;
      }
    }

    updatedModule.permissions[key as keyof Permission] = selectAll;
  }

  if (updatedModule.sub_modules && updatedModule.sub_modules.length > 0) {
    updatedModule.sub_modules = updatedModule.sub_modules.map((subModule) =>
      updateModulePermissionsRecursively(
        subModule,
        selectAll,
        isDefaultSelected
      )
    );
  }

  return updatedModule;
};

export const NestedModule = ({
  isView = false,
  loading,
  module,
  moduleIndex,
}: NestedModuleProps) => {
  const { layout } = useGetDeviceType();

  const isMobile = layout === "mobile";

  const { control, getValues, setValue, watch } =
    useFormContext<RolesPermissionsFormFieldValues>();

  const [isOpen, setIsOpen] = useState(false);

  const ALL_PERMISSION_KEYS = ["view", "create", "edit", "delete"];

  const modulePermissions = watch(`modules.${moduleIndex}.permissions`);

  const isPermissionsRefresh = Object.values(modulePermissions || {});

  const isModuleVisible = modulePermissions?.view ?? false;

  const defaultSelectedModuleKeys = ["basic_detail"];

  const isDefaultSelected = defaultSelectedModuleKeys.includes(
    module.module_key
  );

  const hasSubModules = module.sub_modules && module.sub_modules.length > 0;

  const watchParentView = watch(`modules.${moduleIndex}.permissions.view`);

  const currentModule = getValues(`modules.${moduleIndex}`);

  useMemo(() => {
    const currentModule = getValues(`modules.${moduleIndex}`);

    if (!currentModule || currentModule?.sub_modules?.length) {
      return;
    }

    const currentPermissions = currentModule.permissions || {};

    const allChecked = Object.values(currentPermissions).every(Boolean);

    // Only update select_row if it doesn't match the current state
    if (currentModule.select_row !== allChecked) {
      setValue(`modules.${moduleIndex}.select_row`, allChecked);
    }
  }, [isPermissionsRefresh]);

  useMemo(() => {
    if (!currentModule || currentModule.module_key !== "employee") {
      return;
    }

    currentModule.sub_modules?.forEach((sub, subIndex) => {
      if (
        defaultSelectedModuleKeys.includes(sub.module_key) &&
        watchParentView
      ) {
        setValue(
          `permissions.${moduleIndex}.sub_modules.${subIndex}.permissions.view` as Path<RolesPermissionsFormFieldValues>,
          true
        );
      }
    });
  }, [watchParentView, currentModule?.sub_modules, moduleIndex]);

  useMemo(() => {
    setIsOpen(isModuleVisible);
  }, [isModuleVisible]);

  const handleSelectRow = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      const currentValue = watch(`modules.${moduleIndex}.select_row`);

      const newValue = !currentValue;

      const currentPermissions = watch(`modules.${moduleIndex}.permissions`);

      const updatedPermissions = _mapValues(currentPermissions, (_val, key) =>
        isDefaultSelected && key === "view" && !newValue ? true : newValue
      );

      setValue(`modules.${moduleIndex}.permissions`, updatedPermissions);

      setValue(`modules.${moduleIndex}.select_row`, newValue);
    },
    [moduleIndex]
  );

  const handleSelectAll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      const currentModule = getValues(`modules.${moduleIndex}`);

      if (
        currentModule.module_key === "employee" &&
        currentModule.permissions.view === true
      ) {
        const basicDetailIndex = currentModule.sub_modules?.findIndex(
          (m) => m.module_key === "basic_detail"
        );

        if (basicDetailIndex !== undefined && basicDetailIndex >= 0) {
          setValue(
            `permissions.${moduleIndex}.sub_modules.${basicDetailIndex}.permissions.view` as Path<RolesPermissionsFormFieldValues>,
            true
          );
        }
      }

      if (currentModule) {
        const updatedModule = updateModulePermissionsRecursively(
          currentModule,
          !watch(`modules.${moduleIndex}.select_all`),
          isDefaultSelected
        );

        setValue(`modules.${moduleIndex}`, updatedModule, {
          shouldValidate: true,
        });
      }
    },
    [moduleIndex]
  );

  const selectAllControl = hasSubModules ? (
    <>
      <CheckBox
        loading={loading}
        size="small"
        disabled={isView}
        control={control}
        name={`modules.${moduleIndex}.select_all`}
        onClick={handleSelectAll}
      />

      <Typography
        variant="subtitle2"
        whiteSpace="nowrap"
        fontSize={isMobile ? "12px" : "14px"}
      >
        Select All
      </Typography>
    </>
  ) : (
    <CheckBox
      loading={loading}
      size="small"
      control={control}
      disabled={isView}
      name={`modules.${moduleIndex}.select_row`}
      onClick={handleSelectRow}
    />
  );

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        flexWrap={{ md: "nowrap", xs: "wrap" }}
        sx={{
          columnGap: { xs: 1 },
          pl: { md: "16px", xs: 1.5 },
          pr: { md: "20px", xs: "10px" },
          py: { md: "12px", xs: 1.25 },
          rowGap: { xs: 1 },
          ...(module.sub_modules?.length
            ? {
                backgroundColor: "hsla(203, 70.10%, 62.00%, 0.09)",
                // TODO: Bhavik right now color is not in color palette, will update this color soon,
                boxShadow: "0px 1px 4px rgba(0,0,0,0.1)",
              }
            : {
                backgroundColor: " #b1afac16",
              }),
        }}
      >
        <Typography
          variant={module.sub_modules?.length ? "subtitle2" : "body2"}
          sx={{
            display: { md: "none", xs: "block" },
            flex: "1 1 auto",
            minWidth: 0,
          }}
        >
          {module.module_name}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          gap="6px"
          sx={{
            flexShrink: 0,
            ml: { md: 2 },
            order: { md: 1, xs: 0 },
            width: { md: "110px" },
          }}
        >
          {selectAllControl}
        </Stack>

        <Grid
          container
          spacing={{ md: 2, xs: 1 }}
          sx={{
            alignItems: "center",
            display: "flex",
            flex: { md: 1, xs: "1 1 100%" },
            margin: "0px",
            order: { md: 0, xs: 1 },
            width: { md: "auto", xs: "100%" },
          }}
        >
          <Grid
            item
            md={3}
            xs={12}
            sx={{ display: { md: "block", xs: "none" }, pr: { md: 1 } }}
          >
            <Typography
              variant={module.sub_modules?.length ? "subtitle2" : "body2"}
              sx={{ wordBreak: "break-word" }}
            >
              {module.module_name}
            </Typography>
          </Grid>

          {ALL_PERMISSION_KEYS.map((key) => {
            const isViewKey = key === "view";

            const isModuleViewChecked = watch(
              `modules.${moduleIndex}.permissions.view`
            );

            const shouldDisable =
              isView ||
              (isDefaultSelected && isViewKey) ||
              (!modulePermissions.view && _capitalize(key) !== "View");

            const handleClick = () => {
              if ((isDefaultSelected && isViewKey) || isView) {
                return;
              }

              if (!isView && (isViewKey || isModuleViewChecked)) {
                setValue(
                  `modules.${moduleIndex}.permissions.${key as keyof Permission}`,
                  !watch(
                    `modules.${moduleIndex}.permissions.${key as keyof Permission}`
                  )
                );
              }

              if (isViewKey && isModuleViewChecked) {
                const rowValue = watch(`modules.${moduleIndex}.permissions`);

                const updatedPermissions = _mapValues(rowValue, () => false);

                setValue(
                  `modules.${moduleIndex}.permissions`,
                  updatedPermissions
                );
                setValue(`modules.${moduleIndex}.select_all`, false);
              }
            };

            const renderToggleIcon = () => {
              if (
                _capitalize(key) !== "View" ||
                (module?.sub_modules?.length ?? 0) === 0
              ) {
                return null;
              }

              return modulePermissions.view ? (
                <KeyboardArrowUpRoundedIcon fontSize="small" />
              ) : (
                <KeyboardArrowDownRoundedIcon fontSize="small" />
              );
            };

            return (
              <Grid
                key={uuidv4()}
                item
                md={2}
                sm={3}
                xs={6}
                sx={{ display: "flex", gap: "5px" }}
              >
                {key in module.permissions ? (
                  <Stack
                    flexDirection="row"
                    alignItems="center"
                    gap={{ md: "6px", xs: "3px" }}
                    onClick={handleClick}
                    sx={{ cursor: isView ? "default" : "pointer" }}
                  >
                    <CheckBox
                      loading={loading}
                      disabled={shouldDisable}
                      control={control}
                      name={`modules.${moduleIndex}.permissions.${key as keyof Permission}`}
                      size="small"
                    />
                    <Typography
                      variant="body2"
                      fontSize={isMobile ? "12px" : "13px"}
                      whiteSpace="nowrap"
                    >
                      {_capitalize(key)}
                    </Typography>
                    {renderToggleIcon()}
                  </Stack>
                ) : (
                  <Typography variant="body2">-</Typography>
                )}
              </Grid>
            );
          })}
        </Grid>
      </Stack>

      {isModuleVisible && hasSubModules && (
        <Accordion
          expanded={isOpen}
          onChange={() => setIsOpen((prev) => !prev)}
          sx={{
            "&.Mui-expanded": {
              margin: 0,
            },
            border: "1.5px solid rgba(0,0,0,0.08)",
          }}
        >
          <AccordionDetails
            sx={{
              overflowX: "auto",
              padding: { md: "8px 12px 8px 16px", xs: "8px" },
            }}
          >
            {module?.sub_modules?.map((sub, index) => (
              <NestedModule
                isView={isView}
                key={sub.module_key}
                module={sub}
                moduleIndex={`${moduleIndex}.sub_modules.${index}`}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};
