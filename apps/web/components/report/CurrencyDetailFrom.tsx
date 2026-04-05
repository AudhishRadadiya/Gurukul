import { FormContainer, TextField } from "@codezee/sixtify-brahma"; // Just for layout container
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid, Stack, Typography } from "@mui/material";
import type { ForwardedRef } from "react";
import { forwardRef, Fragment, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { BranchAutocomplete } from "@web/components/common/Autocomplete/BranchAutocomplete";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages } from "@web/utils/helper";

const currencyValues = [2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

const CurrencyRowSchema = z.object({
  amount: z.number().min(0, "common.invalid"),
  currency: z.number(),
  qty: z.number().min(0, "common.invalid"),
});

const CurrencyFormSchema = z
  .object({
    branch_id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    data: z.array(CurrencyRowSchema),
    total_amount: z.number(),
    total_qty: z.number(),
  })
  .transform((val) => {
    const total_qty = val.data.reduce((sum, row) => sum + row.qty, 0);

    const total_amount = val.data.reduce((sum, row) => sum + row.amount, 0);

    return {
      ...val,
      total_amount,
      total_qty,
    };
  });

export type CurrencyFormFieldValues = z.infer<typeof CurrencyFormSchema>;

type CurrencyFormProps = {
  defaultValues?: CurrencyFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<CurrencyFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<CurrencyFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: CurrencyFormFieldValues = {
  branch_id: null,
  data: currencyValues.map((c) => ({
    amount: 0,
    currency: c,
    qty: 0,
  })),
  total_amount: 0,
  total_qty: 0,
};

export const CurrencyDetailFrom = forwardRef(
  (
    { defaultValues = formDefaultValues, loading = false }: CurrencyFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const {
      control,
      formState: { errors },
      handleSubmit,
      setError,
      setValue,
    } = useForm<CurrencyFormFieldValues>({
      mode: "all",
      resolver: zodResolver(CurrencyFormSchema),
      values: defaultValues,
    });

    useEnableDisableButton({ control, defaultValues, errors });

    const watchedDetails = useWatch({ control, name: "data" });

    useMemo(() => {
      watchedDetails.forEach((row, index) => {
        const newAmount = row.qty * row.currency;

        if (newAmount !== row.amount) {
          setValue(`data.${index}.amount`, newAmount, {
            shouldDirty: true,
            shouldValidate: false,
          });
        }
      });
    }, [watchedDetails]);

    useImperativeHandle(ref, () => ({
      setError,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          onSubmit(formValues);
        })();
      },
    }));

    const totalQty = useMemo(
      () => watchedDetails.reduce((sum, row) => sum + row.qty, 0),
      [watchedDetails]
    );

    const totalAmount = useMemo(
      () => watchedDetails.reduce((sum, row) => sum + row.amount, 0),
      [watchedDetails]
    );

    return (
      <Stack gap="15px">
        <BranchAutocomplete
          isUserWise
          label=""
          loading={loading}
          name="branch_id"
          control={control}
          required
          error={!!errors?.branch_id}
          helperText={errorMessages(errors?.branch_id?.message)}
        />
        <FormContainer>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Typography fontWeight={600}>
                {t("currency.detail.currency")}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography fontWeight={600}>
                {t("currency.detail.qty")}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography fontWeight={600}>
                {t("currency.detail.amount")}
              </Typography>
            </Grid>

            {currencyValues.map((currency, index) => (
              // eslint-disable-next-line sonarjs/no-array-index-key
              <Fragment key={index}>
                <Grid item xs={4}>
                  <Typography>{currency}</Typography>
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    control={control}
                    name={`data.${index}.qty`}
                    type="number"
                    loading={loading}
                    required
                    error={!!errors.data?.[index]?.qty}
                    helperText={errorMessages(
                      errors.data?.[index]?.qty?.message
                    )}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    control={control}
                    name={`data.${index}.amount`}
                    type="number"
                    loading={loading}
                    disabled
                    error={!!errors.data?.[index]?.amount}
                    helperText={errorMessages(
                      errors.data?.[index]?.amount?.message
                    )}
                  />
                </Grid>
              </Fragment>
            ))}

            <Grid item xs={4}>
              <Typography fontWeight={600}>{t("common.total")}</Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography fontWeight={600}>{totalQty}</Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography fontWeight={600}>{totalAmount}</Typography>
            </Grid>
          </Grid>
        </FormContainer>
      </Stack>
    );
  }
);

CurrencyDetailFrom.displayName = "CurrencyDetailFrom";
