import {
  Chip,
  FormGridLayout,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, TextField as MuiTextField, Stack } from "@mui/material";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import type { UseFormSetError } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { EventDropdownFieldTypeAutocomplete } from "@web/components/common/Autocomplete/EventDropdownFieldTypeAutocomplete";
import { errorMessages } from "@web/utils/helper";

export const EventDropdownFormSchema = z
  .object({
    description: z.string().max(255, "common.maxLength").nullable().optional(),
    event_dropdown_id: z.string().nullable().optional(),
    field_type: z
      .number()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    is_active: z.boolean(),
    is_old: z.boolean().optional(),
    is_optional: z.boolean(),
    sequence: z
      .number()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    title: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    values: z.array(z.string()).nullable().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.field_type === 8) {
      if (!val.values?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("common.required"),
          path: ["values"],
        });
      }
    }
  });

export type EventDropdownFormFieldValues = z.infer<
  typeof EventDropdownFormSchema
>;

type EventDropdownFormProps = {
  defaultValues?: EventDropdownFormFieldValues;
};

export type FormRef = {
  setError: UseFormSetError<EventDropdownFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: EventDropdownFormFieldValues) => void
  ) => void;
};

const formDefaultValues: EventDropdownFormFieldValues = {
  field_type: 0,
  is_active: false,
  is_optional: false,
  sequence: null,
  title: null,
  values: [],
};

export const EventDropdownForm = forwardRef(
  (
    { defaultValues = formDefaultValues }: EventDropdownFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const [inputValue, setInputValue] = useState("");

    const {
      control,
      formState: { errors },
      handleSubmit,
      setError,
      setValue,
      watch,
    } = useForm({
      mode: "all",
      resolver: zodResolver(EventDropdownFormSchema),
      values: defaultValues,
    });

    useImperativeHandle(ref, () => ({
      setError,

      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          onSubmit({ event_dropdown_id: uuidv4(), ...formValues });
        })();
      },
    }));

    const fieldType = watch("field_type");

    const { description, field_type, sequence, title, values } = errors;

    useMemo(() => {
      if (fieldType !== 8) {
        setValue("values", formDefaultValues.values, { shouldDirty: true });
      }
    }, [fieldType]);

    return (
      <Stack gap="16px">
        <FormGridLayout columns={2}>
          <TextField
            control={control}
            name="title"
            required
            characterType="any-character"
            letterCase="mixed"
            label={t("common.form.options", {
              label: t("title.label"),
            })}
            error={!!title}
            helperText={errorMessages(title?.message)}
          />

          <TextField
            control={control}
            name="description"
            letterCase="mixed"
            multiline
            characterType="any-character"
            label={t("description.label")}
            error={!!description}
            helperText={errorMessages(description?.message)}
          />
        </FormGridLayout>

        <FormGridLayout columns={2}>
          <EventDropdownFieldTypeAutocomplete
            required
            name="field_type"
            control={control}
            error={!!field_type}
            helperText={errorMessages(field_type?.message)}
          />

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

        {fieldType === 8 && (
          <Controller
            name="values"
            control={control}
            render={({ field }) => {
              const currentValues: string[] = field.value || [];

              const handleInputKeyDown = (
                event: React.KeyboardEvent<HTMLInputElement>
              ) => {
                if (event.key === " " && inputValue.trim()) {
                  event.preventDefault();

                  const trimmedValue = inputValue.trim();

                  if (trimmedValue && !currentValues.includes(trimmedValue)) {
                    field.onChange([...currentValues, trimmedValue]);
                    setInputValue("");
                  }
                }
              };

              const handleInputBlur = () => {
                const trimmedValue = inputValue.trim();

                if (trimmedValue && !currentValues.includes(trimmedValue)) {
                  field.onChange([...currentValues, trimmedValue]);
                  setInputValue("");
                }
              };

              const handleDeleteChip = (valueToDelete: string) => {
                field.onChange(
                  currentValues.filter((val) => val !== valueToDelete)
                );
              };

              return (
                <Stack gap="5px">
                  <MuiTextField
                    fullWidth
                    label={t("common.form.options", {
                      label: t("title.values"),
                    })}
                    value={inputValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setInputValue(e.target.value)
                    }
                    onKeyDown={handleInputKeyDown}
                    onBlur={handleInputBlur}
                    required
                    error={!!values}
                    helperText={
                      values
                        ? errorMessages(values.message as string)
                        : "Press space to add values"
                    }
                    placeholder="Type and press space to add values"
                    sx={{
                      "& .MuiInputBase-root": {
                        "--input-base-height": "100%",
                      },
                      "&.MuiTextField-sizeSmall .MuiInputBase-root": {
                        "--input-base-height-small": "40px",
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        "&.MuiInputLabel-shrink": {
                          transform: "translate(14px, -9px) scale(0.75)",
                        },
                        "&:not(.MuiInputLabel-shrink)": {
                          fontSize: "14px",
                          top: "calc(var(--input-base-height, 56px) / 2)",
                          transform: "translate(14px, -90%)",
                        },
                        opacity: 0.8,
                      },
                    }}
                  />

                  {currentValues.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      {currentValues.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          onDelete={() => handleDeleteChip(value)}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                </Stack>
              );
            }}
          />
        )}

        <FormGridLayout columns={2}>
          <RadioGroupField
            name="is_active"
            control={control}
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
        </FormGridLayout>
      </Stack>
    );
  }
);

EventDropdownForm.displayName = "EventDropdownForm";
