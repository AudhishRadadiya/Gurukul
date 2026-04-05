import {
  FormGridLayout,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { EventItemTypeAutocomplete } from "@web/components/common/Autocomplete/EventItemTypeAutocomplete";
import {
  CUSTOM1,
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

export const EventItemFormSchema = z
  .object({
    amount: z.number().nullable(),
    description: z.string().max(255, "common.maxLength").nullable().optional(),
    event_item_id: z.string().nullable().optional(),
    icon: z.string().optional().nullable(),
    is_active: z.boolean(),
    is_old: z.boolean().optional(),
    is_optional: z.boolean(),
    max_amount: z.number().nullable(),
    min_amount: z.number().nullable(),
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
    type: z
      .union([z.literal(SINGLE), z.literal(MULTIPLE), z.literal(CUSTOM1)])
      .nullable(),
  })
  .superRefine((data, ctx) => {
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

    if (String(data.type) && data.type !== CUSTOM1 && !data.amount) {
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

const formDefaultValues: EventItemFormFieldValues = {
  amount: null,
  description: null,
  icon: null,
  is_active: false,
  is_optional: false,
  max_amount: null,
  min_amount: null,
  sequence: null,
  title: null,
  type: null,
};

export const EventItemForm = forwardRef(
  (
    { defaultValues = formDefaultValues }: EventItemFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      clearErrors,
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
      setValue,
      watch,
    } = useForm({
      mode: "all",
      resolver: zodResolver(EventItemFormSchema),
      values: defaultValues,
    });

    useImperativeHandle(ref, () => ({
      setError,

      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          onSubmit({ event_item_id: uuidv4(), ...formValues });
        })();
      },
    }));

    const typeWatch = watch("type");

    const { amount, max_amount, min_amount, sequence, title, type } = errors;

    useMemo(() => {
      let dependentFields: (keyof EventItemFormFieldValues)[] = [];

      if (typeWatch === CUSTOM1) {
        // If type is 2 (CUSTOM1), reset only amount
        dependentFields = ["amount"];
      } else if (typeWatch === SINGLE || typeWatch === MULTIPLE) {
        // If type is 0 (SINGLE) or 1 (MULTIPLE), reset only max_amount and min_amount
        dependentFields = ["max_amount", "min_amount"];
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
    }, [typeWatch]);

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
            label="Description"
            letterCase="mixed"
            characterType="any-character"
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
            disabled={typeWatch == CUSTOM1}
            name="amount"
            required={typeWatch !== CUSTOM1}
            error={!!amount}
            thousandSeparator
            removeDecimalScale
            helperText={errorMessages(amount?.message)}
          />
        </FormGridLayout>

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

        <FormGridLayout columns={3}>
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
      </Stack>
    );
  }
);

EventItemForm.displayName = "EventItemForm";
