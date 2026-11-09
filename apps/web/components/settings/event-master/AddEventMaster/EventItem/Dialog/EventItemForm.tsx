import {
  FormGridLayout,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DeleteOutline as DeleteOutlineIcon,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";
import { IconButton, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { EventItemTypeAutocomplete } from "@web/components/common/Autocomplete/EventItemTypeAutocomplete";
import {
  CUSTOM1,
  CHECKBOX_OPTIONS,
  RADIO_OPTIONS,
  MULTIPLE,
  SINGLE,
} from "@web/components/common/hooks/constant";
import { ImageUploadField } from "@web/components/common/ImageUploadField";
import { NumericTextField } from "@web/components/common/NumericTextField/NumericTextField";
import {
  digitMaxLimit,
  errorMessages,
  resetDependentFields,
} from "@web/utils/helper";

const dropdownValueRowSchema = z.object({
  description: z.string().max(255, "common.maxLength").nullable().optional(),
  is_active: z.boolean(),
  key: z.string().nullable(),
  total_qty: z.number().nullable(),
  values: z.number().nullable(),
});

export const EventItemFormSchema = z
  .object({
    amount: z.number().nullable(),
    description: z.string().max(255, "common.maxLength").nullable().optional(),
    dropdown_values: z.array(dropdownValueRowSchema).nullable().optional(),
    event_item_id: z.string().nullable().optional(),
    icon: z.string().optional().nullable(),
    is_active: z.boolean(),
    is_allow_for_sub_fields: z.boolean(),
    is_multi: z.boolean().optional(),
    is_old: z.boolean().optional(),
    is_optional: z.boolean(),
    is_sub_fields_mandatory: z.boolean(),
    max_amount: z.number().nullable(),
    max_qty: z.number().nullable(),
    min_amount: z.number().nullable(),
    min_qty: z.number().nullable(),
    sequence: z
      .number()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    sub_field_description: z
      .string()
      .max(255, "common.maxLength")
      .nullable()
      .optional(),
    sub_field_title: z.string().nullable().optional(),
    title: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    type: z
      .union([
        z.literal(SINGLE),
        z.literal(MULTIPLE),
        z.literal(CUSTOM1),
        z.literal(CHECKBOX_OPTIONS),
        z.literal(RADIO_OPTIONS),
      ])
      .nullable(),
  })
  // eslint-disable-next-line sonarjs/cognitive-complexity
  .superRefine((data, ctx) => {
    const isDropdownType =
      data.type === CHECKBOX_OPTIONS || data.type === RADIO_OPTIONS;

    if (isDropdownType) {
      const rows = data.dropdown_values ?? [];

      if (!rows.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["dropdown_values"],
        });
      }

      rows.forEach((row, index) => {
        if (!row.values) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "common.required",
            path: ["dropdown_values", index, "values"],
          });
        }

        if (!row.key) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "common.required",
            path: ["dropdown_values", index, "key"],
          });
        }

        if (row.total_qty === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "common.required",
            path: ["dropdown_values", index, "total_qty"],
          });
        }
      });
    }

    if (data.type == CUSTOM1 && (!data.min_amount || !data.max_amount)) {
      if (!data.min_amount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["min_amount"],
        });
      }

      if (!data.max_amount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["max_amount"],
        });
      }
    }

    if (
      data.type == CUSTOM1 &&
      data.min_amount !== null &&
      data.min_amount < 1
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: JSON.stringify({
          key: "common.min_amount.min",
          params: { minimum_amount: 1 },
        }),
        path: ["min_amount"],
      });
    }

    if (
      data.type == CUSTOM1 &&
      data.max_amount !== null &&
      data.max_amount > digitMaxLimit
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: JSON.stringify({
          key: "common.max_amount.max",
          params: { maximum_amount: digitMaxLimit },
        }),
        path: ["max_amount"],
      });
    }

    if (
      data.type == CUSTOM1 &&
      data.min_amount !== null &&
      data.max_amount !== null &&
      data.min_amount >= data.max_amount
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: JSON.stringify({
          key: "common.amount.range",
          params: {
            maximum_amount: data.max_amount,
            minimum_amount: data.min_amount,
          },
        }),
        path: ["min_amount"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: JSON.stringify({
          key: "common.amount.range",
          params: {
            maximum_amount: data.max_amount,
            minimum_amount: data.min_amount,
          },
        }),
        path: ["max_amount"],
      });
    }

    if (data.type === MULTIPLE) {
      if (data.min_qty === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["min_qty"],
        });
      }

      if (data.max_qty === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["max_qty"],
        });
      }

      if (data.min_qty !== null && data.min_qty < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("common.min_qty.min", { minimum_qty: 0 }),
          path: ["min_qty"],
        });
      }

      if (data.max_qty !== null && data.max_qty > digitMaxLimit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("common.max_qty.max", { maximum_qty: digitMaxLimit }),
          path: ["max_qty"],
        });
      }

      if (
        data.min_qty !== null &&
        data.max_qty !== null &&
        data.min_qty >= data.max_qty
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.qty.range",
          path: ["min_qty"],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.qty.range",
          path: ["max_qty"],
        });
      }

      if (data.is_allow_for_sub_fields) {
        if (!data.sub_field_title) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "common.required",
            path: ["sub_field_title"],
          });
        }

        if (!data.sub_field_description) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "common.required",
            path: ["sub_field_description"],
          });
        }
      }
    }

    if (
      String(data.type) &&
      data.type !== CUSTOM1 &&
      data.type !== CHECKBOX_OPTIONS &&
      data.type !== RADIO_OPTIONS &&
      !data.amount
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["amount"],
      });
    }
  });

export type EventItemFormFieldValues = z.infer<typeof EventItemFormSchema>;

type EventItemFormProps = {
  defaultValues?: EventItemFormFieldValues;
};

export type FormRef = {
  setError: UseFormSetError<EventItemFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: EventItemFormFieldValues) => void
  ) => void;
};

const dropdownValueRowDefaultValues = {
  description: null,
  is_active: true,
  key: null,
  total_qty: -1,
  values: null,
};

const formDefaultValues: EventItemFormFieldValues = {
  amount: null,
  description: null,
  dropdown_values: [],
  icon: null,
  is_active: false,
  is_allow_for_sub_fields: false,
  is_multi: false,
  is_optional: false,
  is_sub_fields_mandatory: false,
  max_amount: null,
  max_qty: null,
  min_amount: null,
  min_qty: null,
  sequence: null,
  sub_field_description: null,
  sub_field_title: null,
  title: null,
  type: null,
};

export const EventItemForm = forwardRef(
  (
    { defaultValues = formDefaultValues }: EventItemFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const theme = useTheme();

    const { darkOrange } = theme.palette.app.color;

    const {
      clearErrors,
      control,
      formState: { dirtyFields, errors },
      getValues,
      handleSubmit,
      resetField,
      setError,
      setValue,
      watch,
    } = useForm({
      mode: "all",
      resolver: zodResolver(EventItemFormSchema),
      values: defaultValues,
    });

    const typeWatch = watch("type");

    const minQty = watch("min_qty");

    const maxQty = watch("max_qty");

    const isAllowForSubFields = watch("is_allow_for_sub_fields");

    const isSubFieldsMandatory = watch("is_sub_fields_mandatory");

    const subFieldDescription = watch("sub_field_description");

    const subFieldTitle = watch("sub_field_title");

    useImperativeHandle(ref, () => ({
      setError,

      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          onSubmit({ event_item_id: uuidv4(), ...formValues });
        })();
      },
    }));

    const isDropdownType =
      typeWatch === CHECKBOX_OPTIONS || typeWatch === RADIO_OPTIONS;

    const { append, fields, remove, replace } = useFieldArray({
      control,
      name: "dropdown_values",
    });

    const {
      amount,
      description,
      dropdown_values,
      max_amount,
      max_qty,
      min_amount,
      min_qty,
      sequence,
      sub_field_description,
      sub_field_title,
      title,
      type,
    } = errors;

    useEffect(() => {
      let dependentFields: (keyof EventItemFormFieldValues)[] = [];

      if (typeWatch === CUSTOM1) {
        // If type is 2 (CUSTOM1), reset only amount
        dependentFields = ["amount"];
      } else if (typeWatch === SINGLE || typeWatch === MULTIPLE) {
        // If type is 0 (SINGLE) or 1 (MULTIPLE), reset only max_amount and min_amount
        dependentFields = ["max_amount", "min_amount"];
      } else if (isDropdownType) {
        // If type is 3 (CHECKBOX_OPTIONS) or 4 (RADIO_OPTIONS), reset amount, max_amount and min_amount
        dependentFields = ["amount", "max_amount", "min_amount"];
      }

      if (dependentFields.length > 0) {
        const dependentFieldsMap: Partial<
          Record<
            keyof EventItemFormFieldValues,
            (keyof EventItemFormFieldValues)[]
          >
        > = {
          type: dependentFields,
        };

        resetDependentFields({
          clearErrors,
          dependentFieldsMap,
          dirtyFields,
          fieldName: "type",
          fieldValue: typeWatch,
          setValue,
        });
      }

      if (!isDropdownType) {
        const dropdownRows = getValues("dropdown_values");

        if (dropdownRows?.length) {
          setValue("dropdown_values", [], { shouldDirty: true });
        }

        clearErrors("dropdown_values");
      } else {
        const rows = getValues("dropdown_values");

        if (!rows?.length) {
          replace([dropdownValueRowDefaultValues]);
        }
      }
    }, [
      clearErrors,
      dirtyFields,
      getValues,
      isDropdownType,
      replace,
      setValue,
      typeWatch,
    ]);

    useEffect(() => {
      if (typeWatch === MULTIPLE) {
        if (dirtyFields.type || !minQty || !maxQty) {
          setValue("min_qty", 0, { shouldDirty: true });
          setValue("max_qty", 5, { shouldDirty: true });
          clearErrors(["min_qty", "max_qty"]);

          return;
        }
      }

      if (typeWatch !== MULTIPLE && (!typeWatch || dirtyFields.type)) {
        setValue("min_qty", null, { shouldDirty: true });
        setValue("max_qty", null, { shouldDirty: true });
        setValue("sub_field_title", null, { shouldDirty: true });
        setValue("sub_field_description", null, { shouldDirty: true });
        clearErrors([
          "min_qty",
          "max_qty",
          "sub_field_title",
          "sub_field_description",
        ]);
      }
    }, [clearErrors, dirtyFields.type, setValue, typeWatch]);

    useEffect(() => {
      if (!isAllowForSubFields) {
        if (isSubFieldsMandatory) {
          resetField("is_sub_fields_mandatory");
        }

        if (subFieldTitle) {
          resetField("sub_field_title");
        }

        if (subFieldDescription) {
          resetField("sub_field_description");
        }
      }
    }, [
      clearErrors,
      getValues,
      isAllowForSubFields,
      isSubFieldsMandatory,
      resetField,
      setValue,
    ]);

    return (
      <Stack gap="16px">
        <ImageUploadField
          control={control}
          name="icon"
          label={t("common.image.label", {
            label: t("common.logo"),
          })}
        />

        <FormGridLayout columns={2}>
          <TextField
            control={control}
            name="title"
            required
            characterType="any-character"
            letterCase="mixed"
            label={t("title.label")}
            error={!!title}
            helperText={errorMessages(title?.message)}
          />

          <TextField
            control={control}
            name="description"
            multiline
            label={t("description.label")}
            letterCase="mixed"
            characterType="any-character"
            error={!!description}
            helperText={errorMessages(description?.message)}
          />

          <EventItemTypeAutocomplete
            required
            name="type"
            label={t("type.label")}
            error={!!type}
            control={control}
            helperText={errorMessages(type?.message)}
          />

          <NumericTextField
            control={control}
            label={t("currency.detail.amount")}
            disabled={typeWatch == CUSTOM1 || isDropdownType}
            name="amount"
            required={typeWatch !== CUSTOM1 && !isDropdownType}
            error={!!amount}
            thousandSeparator
            removeDecimalScale
            helperText={errorMessages(amount?.message)}
          />
        </FormGridLayout>

        {isDropdownType && (
          <FormGridLayout columns={2}>
            <RadioGroupField
              name="is_multi"
              control={control}
              isHorizontal
              label={t("common.isMulti.label")}
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
          </FormGridLayout>
        )}

        {isDropdownType && (
          <Stack gap="12px">
            <Stack
              direction="row"
              gap="10px"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack
                direction={{ sm: "row", xs: "column" }}
                gap={{ sm: "20px", xs: "4px" }}
                alignItems={{ sm: "center", xs: "flex-start" }}
                sx={{ minWidth: 0 }}
              >
                <Typography fontWeight={600}>
                  {t("common.itemAmountDropdownValues.label")}
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={500}
                  color={darkOrange[900]}
                >
                  set quantity as -1 for unlimited access.
                </Typography>
              </Stack>

              <IconButton
                aria-label={t("common.add")}
                onClick={() => append(dropdownValueRowDefaultValues)}
                sx={{ mt: "8px" }}
              >
                <AddCircleIcon color="primary" />
              </IconButton>
            </Stack>

            {!Array.isArray(dropdown_values) && dropdown_values?.message && (
              <Typography color="error" variant="caption">
                {errorMessages(dropdown_values.message)}
              </Typography>
            )}

            <Stack gap="10px">
              {fields.map((field, index) => (
                <Stack
                  direction="row"
                  gap="10px"
                  alignItems="start"
                  key={field.id}
                >
                  <Stack
                    gap="15px"
                    display="grid"
                    sx={{
                      flex: 1,
                      gridTemplateColumns: {
                        lg: "minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.2fr) minmax(220px, 1.5fr)",
                        md: "repeat(3, minmax(0, 1fr))",
                        sm: "repeat(2, minmax(0, 1fr))",
                        xs: "repeat(1, minmax(0, 1fr))",
                      },
                      minWidth: 0,
                    }}
                    alignItems="start"
                  >
                    <TextField
                      control={control}
                      name={`dropdown_values.${index}.key`}
                      required
                      characterType="any-character"
                      letterCase="mixed"
                      label={t("common.name")}
                      error={!!dropdown_values?.[index]?.key}
                      helperText={errorMessages(
                        dropdown_values?.[index]?.key?.message
                      )}
                    />

                    <NumericTextField
                      control={control}
                      name={`dropdown_values.${index}.values`}
                      label={t("currency.detail.amount")}
                      required
                      error={!!dropdown_values?.[index]?.values}
                      thousandSeparator
                      removeDecimalScale
                      helperText={errorMessages(
                        dropdown_values?.[index]?.values?.message
                      )}
                    />

                    <NumericTextField
                      control={control}
                      name={`dropdown_values.${index}.total_qty`}
                      label={t("total.quantity.label")}
                      required
                      minValue={-1}
                      removeDecimalScale
                      error={!!dropdown_values?.[index]?.total_qty}
                      helperText={errorMessages(
                        dropdown_values?.[index]?.total_qty?.message
                      )}
                    />

                    <TextField
                      control={control}
                      name={`dropdown_values.${index}.description`}
                      label={t("description.label")}
                      letterCase="mixed"
                      characterType="any-character"
                      error={!!dropdown_values?.[index]?.description}
                      helperText={errorMessages(
                        dropdown_values?.[index]?.description?.message
                      )}
                    />

                    <RadioGroupField
                      name={`dropdown_values.${index}.is_active`}
                      control={control}
                      isHorizontal
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

                  <IconButton
                    aria-label={t("common.delete")}
                    disabled={fields.length <= 1}
                    onClick={() => remove(index)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}

        {typeWatch == CUSTOM1 && (
          <FormGridLayout columns={2}>
            <TextField
              label={t("common.min_amount.label")}
              type="number"
              name="min_amount"
              control={control}
              required={typeWatch == CUSTOM1}
              error={!!min_amount}
              helperText={errorMessages(min_amount?.message)}
            />

            <TextField
              label={t("common.max_amount.label")}
              type="number"
              name="max_amount"
              control={control}
              required={typeWatch == CUSTOM1}
              error={!!max_amount}
              helperText={errorMessages(max_amount?.message)}
            />
          </FormGridLayout>
        )}

        {typeWatch == MULTIPLE && (
          <FormGridLayout columns={2}>
            <TextField
              label={t("common.min_qty.label")}
              name="min_qty"
              type="number"
              control={control}
              required
              error={!!min_qty}
              helperText={errorMessages(min_qty?.message)}
            />

            <TextField
              label={t("common.max_qty.label")}
              name="max_qty"
              control={control}
              type="number"
              required
              error={!!max_qty}
              helperText={errorMessages(max_qty?.message)}
            />
          </FormGridLayout>
        )}

        <FormGridLayout columns={typeWatch === MULTIPLE ? 4 : 3}>
          <RadioGroupField
            name="is_active"
            control={control}
            isHorizontal={typeWatch !== MULTIPLE}
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

          <RadioGroupField
            name="is_optional"
            control={control}
            isHorizontal={typeWatch !== MULTIPLE}
            label={t("isOptional.label")}
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

          {typeWatch === MULTIPLE && (
            <RadioGroupField
              name="is_allow_for_sub_fields"
              control={control}
              label={t("common.isAllowForSubFields.label")}
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
          )}

          <TextField
            label={t("sequence.label")}
            type="number"
            name="sequence"
            control={control}
            required
            error={!!sequence}
            helperText={errorMessages(sequence?.message)}
          />
        </FormGridLayout>

        {typeWatch === MULTIPLE && isAllowForSubFields && (
          <FormGridLayout columns={3}>
            <RadioGroupField
              name="is_sub_fields_mandatory"
              control={control}
              isHorizontal
              label={t("common.isSubFieldsMandatory.label")}
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

            <TextField
              control={control}
              name="sub_field_title"
              required
              characterType="any-character"
              letterCase="mixed"
              label={t("common.subFieldTitle.label")}
              error={!!sub_field_title}
              helperText={errorMessages(sub_field_title?.message)}
            />

            <TextField
              control={control}
              name="sub_field_description"
              required
              multiline
              characterType="any-character"
              letterCase="mixed"
              label={t("common.subFieldDescription.label")}
              error={!!sub_field_description}
              helperText={errorMessages(sub_field_description?.message)}
            />
          </FormGridLayout>
        )}
      </Stack>
    );
  }
);

EventItemForm.displayName = "EventItemForm";
