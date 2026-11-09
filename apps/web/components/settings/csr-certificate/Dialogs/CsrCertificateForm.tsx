import { FormGridLayout, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FinancialYearAutocomplete } from "@web/components/common/Autocomplete/FinancialYearAutocomplete";
import { TrustAutocomplete } from "@web/components/common/Autocomplete/TrustAutocomplete";
import {
  DocumentUploadField,
  attachmentEntryFormSchema,
  getAttachmentMediaUrl,
} from "@web/components/common/DocumentUploadField";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const CsrCertificateFormSchema = z.object({
  certificate_pdf: z
    .array(attachmentEntryFormSchema)
    .min(1, { message: "common.required" })
    .nullable()
    .refine((value) => !!value?.length, { message: "common.required" }),
  csr_number: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, { message: "common.required" }),
  financial_year_id: z
    .array(z.string())
    .min(1, { message: "common.required" })
    .default([]),
  trust_id: z
    .string()
    .nullable()
    .refine((value) => !!value, { message: "common.required" }),
});

export type CsrCertificateFormFieldValues = z.infer<
  typeof CsrCertificateFormSchema
>;

export type CsrCertificateApiPayload = {
  certificate_pdf: string | null;
  csr_number: string | null;
  financial_year_id: string[] | null;
  trust_id: string | null;
};

type CsrCertificateFormProps = {
  defaultValues?: CsrCertificateFormFieldValues;
  loading?: boolean;
};

export type CsrCertificateFormRef = {
  setError: UseFormSetError<CsrCertificateFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<CsrCertificateApiPayload>) => void
  ) => void;
};

const formDefaultValues: CsrCertificateFormFieldValues = {
  certificate_pdf: null,
  csr_number: null,
  financial_year_id: [],
  trust_id: null,
};

export const CsrCertificateForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: CsrCertificateFormProps,
    ref: ForwardedRef<CsrCertificateFormRef>
  ) => {
    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
    } = useForm({
      mode: "all",
      resolver: zodResolver(CsrCertificateFormSchema),
      values: defaultValues,
    });

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      setError,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const certificatePdf = getAttachmentMediaUrl(
            formValues.certificate_pdf
          );

          onSubmit(
            filterChangedFormFields(
              { ...formValues, certificate_pdf: certificatePdf },
              { ...dirtyFields, certificate_pdf: true }
            )
          );
        })();
      },
    }));

    const { certificate_pdf, csr_number, financial_year_id, trust_id } = errors;

    return (
      <Stack gap="15px">
        <FormGridLayout columns={2}>
          <TrustAutocomplete
            useUserWise
            label={t("trust.label")}
            required
            loading={loading}
            name="trust_id"
            control={control}
            error={!!trust_id}
            helperText={errorMessages(trust_id?.message)}
          />
          <FinancialYearAutocomplete
            loading={loading}
            name="financial_year_id"
            control={control}
            multiple
            label={t("financial.year.label")}
            required
            error={!!financial_year_id}
            helperText={errorMessages(financial_year_id?.message)}
          />
          <TextField
            name="csr_number"
            control={control}
            loading={loading}
            label={t("csr.number.label")}
            required
            letterCase="mixed"
            setError={setError}
            error={!!csr_number}
            helperText={errorMessages(csr_number?.message)}
          />
          <DocumentUploadField
            name="certificate_pdf"
            control={control}
            loading={loading}
            isUploadForCertificate
            required
            label={t("certificatePdf.label")}
            error={!!certificate_pdf}
            helperText={errorMessages(certificate_pdf?.message)}
          />
        </FormGridLayout>
      </Stack>
    );
  }
);

CsrCertificateForm.displayName = "CsrCertificateForm";
