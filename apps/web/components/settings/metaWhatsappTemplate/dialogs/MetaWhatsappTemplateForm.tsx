import {
  AddIconAction,
  ContentBox,
  GridProvider,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import type { UseFormSetError } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { MetaWhatsappModuleAutocomplete } from "@web/components/common/Autocomplete/MetaWhatsappModuleAutocomplete";
import { MetaWhatsappSettingAutocomplete } from "@web/components/common/Autocomplete/MetaWhatsappSettingAutocomplete";
import { MetaWhatsappTemplateAutocomplete } from "@web/components/common/Autocomplete/MetaWhatsappTemplateAutocomplete";
import { MetaWhatsappTemplateVariablesAutocomplete } from "@web/components/common/Autocomplete/MetaWhatsappTemplateVariablesAutocomplete";
import { MetaWhatsappTemplatePreview } from "@web/components/settings/metaWhatsappTemplate/dialogs/components/MetaWhatsappTemplatePreview";
import { useFetchMetaWhatsappTemplateVariables } from "@web/components/settings/metaWhatsappTemplate/dialogs/hooks/useFetchMetaWhatsappTemplateVariables";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import {
  errorMessages,
  filterNestedChangedFormFields,
} from "@web/utils/helper";

const variableTemplateSchema = z
  .object({
    temp_variable_parameter: z.string().nullable(),
    variable_mapping: z.string().nullable(),
  })
  .superRefine((value, ctx) => {
    if (!value.temp_variable_parameter) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["temp_variable_parameter"],
      });
    }

    if (!value.variable_mapping) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["variable_mapping"],
      });
    }
  });

const MetaWhatsappTemplateFormSchema = z.object({
  is_active: z.boolean(),
  meta_whatsapp_setting_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  module_name: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  template_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  variable_templates: z.array(variableTemplateSchema).default([]),
});

export type MetaWhatsappTemplateFormFieldValues = z.infer<
  typeof MetaWhatsappTemplateFormSchema
> & {
  variable_mapping?: Record<string, string | null>;
};

export type MetaWhatsappTemplateVariable = {
  component_type: string;
  index: number;
  placeholder: string;
  text: string;
};

const formDefaultValues: MetaWhatsappTemplateFormFieldValues = {
  is_active: true,
  meta_whatsapp_setting_id: null,
  module_name: null,
  template_id: null,
  variable_templates: [],
};

type MetaWhatsappTemplateFormArgs = {
  defaultValues?: MetaWhatsappTemplateFormFieldValues;
  loading: boolean;
};

export type FormRef = {
  setError: UseFormSetError<MetaWhatsappTemplateFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<MetaWhatsappTemplateFormFieldValues>) => void
  ) => void;
};

const sanitizeVariableMapping = (
  variableMapping: Record<string, string | null>
) => {
  const sanitizedMapping: Record<string, string> = {};

  for (const [key, value] of Object.entries(variableMapping)) {
    if (value) {
      sanitizedMapping[key] = value;
    }
  }

  return sanitizedMapping;
};

const createVariableMappingFromTemplates = (
  variables: MetaWhatsappTemplateVariable[],
  variableTemplates: MetaWhatsappTemplateFormFieldValues["variable_templates"]
) => {
  return variables.reduce<Record<string, string | null>>(
    (acc, variable, index) => {
      acc[variable.index.toString()] =
        variableTemplates[index]?.variable_mapping ?? null;

      return acc;
    },
    {}
  );
};

export const MetaWhatsappTemplateForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: MetaWhatsappTemplateFormArgs,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      clearErrors,
      control,
      formState: { dirtyFields, errors },
      getValues,
      handleSubmit,
      setError,
      setValue,
      watch,
    } = useForm<MetaWhatsappTemplateFormFieldValues>({
      mode: "all",
      resolver: zodResolver(MetaWhatsappTemplateFormSchema),
      values: defaultValues,
    });

    const {
      fields: variableTemplateFields,
      replace: replaceVariableTemplates,
    } = useFieldArray({
      control,
      name: "variable_templates",
    });

    useEnableDisableButton({ control, defaultValues, errors });

    const variableInputRefs = useRef<
      Record<number, HTMLTextAreaElement | null>
    >({});

    const previousTempVariableParameterRef = useRef<string[]>([]);

    const lastSyncedTemplateKeyRef = useRef<string>("");

    const templateId = watch("template_id");

    const variableTemplates = watch("variable_templates");

    const metaWhatsappSettingId = watch("meta_whatsapp_setting_id");

    const { data: templateVariables, isFetching: loadingVariables } =
      useFetchMetaWhatsappTemplateVariables({
        metaWhatsappSettingId,
        templateId,
      });

    const variables = templateVariables?.variables ?? [];

    const variablesSignature = useMemo(() => {
      return variables
        .map(({ component_type, index, placeholder }) => {
          return `${component_type}:${index}:${placeholder}`;
        })
        .join("|");
    }, [variables]);

    const templatePreviewText = variables[0]?.text ?? null;

    useEffect(() => {
      if (!templateId || variables.length === 0) {
        if (getValues("variable_templates").length > 0) {
          replaceVariableTemplates([]);
        }

        lastSyncedTemplateKeyRef.current = "";
        previousTempVariableParameterRef.current = [];

        return;
      }

      const syncKey = `${templateId}::${variablesSignature}`;

      const currentTemplates = getValues("variable_templates");

      if (
        lastSyncedTemplateKeyRef.current === syncKey &&
        currentTemplates.length
      ) {
        return;
      }

      const nextTemplates = variables.map((variable, index) => {
        const currentTemplate = currentTemplates?.[index];

        return {
          temp_variable_parameter:
            currentTemplate?.temp_variable_parameter ??
            defaultValues.variable_mapping?.[variable.index.toString()] ??
            null,
          variable_mapping:
            currentTemplate?.variable_mapping ??
            defaultValues.variable_mapping?.[variable.index.toString()] ??
            null,
        };
      });

      const isSameTemplates =
        currentTemplates.length === nextTemplates.length &&
        currentTemplates.every((template, index) => {
          return (
            template.temp_variable_parameter ===
              nextTemplates[index]?.temp_variable_parameter &&
            template.variable_mapping === nextTemplates[index]?.variable_mapping
          );
        });

      if (!isSameTemplates) {
        replaceVariableTemplates(nextTemplates);
      }

      previousTempVariableParameterRef.current = nextTemplates.map(
        ({ temp_variable_parameter }) => temp_variable_parameter ?? ""
      );
      lastSyncedTemplateKeyRef.current = syncKey;
    }, [
      defaultValues.variable_mapping,
      getValues,
      replaceVariableTemplates,
      templateId,
      variablesSignature,
    ]);

    useImperativeHandle(ref, () => ({
      setError,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const { variable_templates, ...rest } = formValues;

          const filteredFormValues = filterNestedChangedFormFields(rest, {
            ...dirtyFields,
            is_active: true,
            meta_whatsapp_setting_id: true,
            module_name: true,
            template_id: true,
          });

          const variable_mapping = sanitizeVariableMapping(
            createVariableMappingFromTemplates(variables, variable_templates)
          );

          const modifiedData = {
            ...filteredFormValues,
            variable_mapping,
          };

          onSubmit(modifiedData);
        })();
      },
    }));

    useEffect(() => {
      const previousTempValues = previousTempVariableParameterRef.current;

      const currentTempValues =
        variableTemplates?.map(
          ({ temp_variable_parameter }) => temp_variable_parameter ?? ""
        ) ?? [];

      if (
        previousTempValues.length === 0 ||
        previousTempValues.length !== currentTempValues.length
      ) {
        previousTempVariableParameterRef.current = [...currentTempValues];

        return;
      }

      for (const [index, currentValue] of currentTempValues.entries()) {
        if (previousTempValues[index] === currentValue) {
          continue;
        }

        setValue(`variable_templates.${index}.variable_mapping`, null, {
          shouldDirty: true,
        });

        clearErrors(`variable_templates.${index}.variable_mapping`);
      }

      previousTempVariableParameterRef.current = [...currentTempValues];
    }, [clearErrors, JSON.stringify(variableTemplates)]);

    const handleInsertParam = (fieldIndex: number) => {
      const insertValue =
        variableTemplates?.[fieldIndex]?.temp_variable_parameter?.toString() ??
        "";

      if (!insertValue) {
        return;
      }

      const currentValue = (getValues(
        `variable_templates.${fieldIndex}.variable_mapping`
      ) ?? "") as string | null;

      const safeCurrentValue = currentValue ?? "";

      if (safeCurrentValue.includes(insertValue)) {
        return;
      }

      const textarea = variableInputRefs.current[fieldIndex];

      if (!textarea) {
        setValue(
          `variable_templates.${fieldIndex}.variable_mapping`,
          `${safeCurrentValue}${insertValue}`,
          {
            shouldDirty: true,
            shouldValidate: true,
          }
        );

        return;
      }

      const selectionStart = textarea.selectionStart ?? safeCurrentValue.length;

      const selectionEnd = textarea.selectionEnd ?? safeCurrentValue.length;

      const newValue =
        safeCurrentValue.slice(0, selectionStart) +
        insertValue +
        safeCurrentValue.slice(selectionEnd);

      if (newValue === safeCurrentValue) {
        return;
      }

      setValue(`variable_templates.${fieldIndex}.variable_mapping`, newValue, {
        shouldDirty: true,
        shouldValidate: true,
      });

      requestAnimationFrame(() => {
        const cursorPosition = selectionStart + insertValue.length;

        textarea.focus();
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      });
    };

    const {
      meta_whatsapp_setting_id,
      module_name,
      template_id,
      variable_templates,
    } = errors;

    return (
      <Stack gap="15px">
        <GridProvider gap="15px" columns={2}>
          <MetaWhatsappSettingAutocomplete
            name="meta_whatsapp_setting_id"
            control={control}
            loading={loading}
            required
            error={!!meta_whatsapp_setting_id}
            helperText={errorMessages(meta_whatsapp_setting_id?.message)}
            clearIcon
          />

          <MetaWhatsappTemplateAutocomplete
            name="template_id"
            control={control}
            loading={loading}
            metaWhatsappSettingId={metaWhatsappSettingId}
            required
            error={!!template_id}
            helperText={errorMessages(template_id?.message)}
            clearIcon
          />

          <MetaWhatsappModuleAutocomplete
            name="module_name"
            control={control}
            loading={loading}
            required
            error={!!module_name}
            helperText={errorMessages(module_name?.message)}
            clearIcon
          />
        </GridProvider>

        <Stack gap="10px">
          <Typography variant="subtitle2">
            {t("metaWhatsappTemplate.variableMapping.label")}
          </Typography>

          <Stack
            direction={{ md: "row", xs: "column" }}
            gap="20px"
            alignItems="stretch"
          >
            <Stack sx={{ flex: { md: 1 }, minWidth: 0 }}>
              <ContentBox>
                <Stack gap="15px" sx={{ p: 2 }}>
                  {variables.map((variable, index) => {
                    return (
                      <Stack
                        key={
                          variableTemplateFields[index]?.id ?? variable.index
                        }
                        gap="10px"
                      >
                        <Typography variant="body2">
                          {t("metaWhatsappTemplate.variable.placeholder.label")}
                          : {variable.placeholder}
                        </Typography>

                        <Stack direction="row" gap="10px" alignItems="center">
                          <Stack flex={1}>
                            <MetaWhatsappTemplateVariablesAutocomplete
                              name={`variable_templates.${index}.temp_variable_parameter`}
                              control={control}
                              loading={loading || loadingVariables}
                              required
                              label={t("common.template.parameters")}
                              error={
                                !!variable_templates?.[index]
                                  ?.temp_variable_parameter
                              }
                              helperText={errorMessages(
                                variable_templates?.[index]
                                  ?.temp_variable_parameter?.message
                              )}
                            />
                          </Stack>

                          <AddIconAction
                            onClick={() => handleInsertParam(index)}
                            disabled={
                              !!variableTemplates?.[index]
                                ?.temp_variable_parameter &&
                              !!variableTemplates?.[index]?.variable_mapping
                            }
                          />
                        </Stack>

                        <TextField
                          name={`variable_templates.${index}.variable_mapping`}
                          control={control}
                          loading={loading || loadingVariables}
                          required
                          multiline
                          letterCase="mixed"
                          characterType="any-character"
                          label={`Variable (${variable.placeholder})`}
                          error={
                            !!variable_templates?.[index]?.variable_mapping
                          }
                          helperText={errorMessages(
                            variable_templates?.[index]?.variable_mapping
                              ?.message
                          )}
                          inputRef={(el) => {
                            variableInputRefs.current[index] = el;
                          }}
                        />
                      </Stack>
                    );
                  })}
                </Stack>
              </ContentBox>
            </Stack>

            <Stack
              sx={{
                flex: { md: "0 0 36%" },
                minWidth: { md: 360 },
                width: "100%",
              }}
            >
              <MetaWhatsappTemplatePreview
                loading={loading || loadingVariables}
                text={templatePreviewText}
              />
            </Stack>
          </Stack>
        </Stack>

        <RadioGroupField
          name="is_active"
          control={control}
          loading={loading}
          label={t("isActive.label")}
          options={[
            {
              disabled: false,
              label: t("common.yes"),
              values: true,
            },
            {
              disabled: false,
              label: t("common.no"),
              values: false,
            },
          ]}
        />
      </Stack>
    );
  }
);

MetaWhatsappTemplateForm.displayName = "MetaWhatsappTemplateForm";
