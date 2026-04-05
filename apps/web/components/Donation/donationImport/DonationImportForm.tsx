import { Button, FormSection } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import type { ColDefField } from "ag-grid-community";
import { t } from "i18next";
import { Download } from "iconoir-react";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import { FormProvider, useForm, type UseFormSetError } from "react-hook-form";
import { z } from "zod";

import { TrustAutocompleteFromMultipleBranch } from "@web/components/common/Autocomplete/TrustAutocompleteFromMultipleBranch";
import { ExcelImportProcess } from "@web/components/common/ExcelImport/ExcelImportProcess";
import { useFileDownload } from "@web/components/common/useFileDownload";
import {
  donationFieldLabels,
  SAMPLE_FILE,
} from "@web/components/Donation/donationImport/hooks/constant";
import type { DonationImportDetails } from "@web/components/Donation/donationImport/hooks/useDonationImport";
import { useBranch } from "@web/context/BranchContext";
import {
  errorMessages,
  filterNestedChangedFormFields,
} from "@web/utils/helper";

const DonationImportFormSchema = z
  .object({
    branch_id: z.string().nullable(),
    excel_file: z.instanceof(File).nullable(),
    trust_id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
  })
  .superRefine((val, ctx) => {
    if (val.trust_id && !val.excel_file) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["excel_file"],
      });
    }
  });

export type DonationImportFormFieldValues = z.infer<
  typeof DonationImportFormSchema
>;

const formDefaultValues: DonationImportFormFieldValues = {
  branch_id: null,
  excel_file: null,
  trust_id: null,
};

type DonationImportFormArgs = {
  defaultValues?: DonationImportFormFieldValues;
  excelDonationImportData: {
    rows: DonationImportDetails[];
    titles: ColDefField<DonationImportDetails>[];
  };
  loading?: boolean;
  setExcelDonationImportData: (value: {
    rows: DonationImportDetails[];
    titles: (keyof DonationImportDetails)[];
  }) => void;
};

export type FormRef = {
  setError: UseFormSetError<DonationImportFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<DonationImportFormFieldValues>) => void
  ) => void;
};

export const DonationImportForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      excelDonationImportData,
      loading = false,
      setExcelDonationImportData,
    }: DonationImportFormArgs,
    ref: ForwardedRef<FormRef>
  ) => {
    const methods = useForm({
      mode: "all",
      resolver: zodResolver(DonationImportFormSchema),
      values: defaultValues,
    });

    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
    } = methods;

    const { downloadFile } = useFileDownload();

    const { branchIds } = useBranch();

    useImperativeHandle(ref, () => ({
      setError,

      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const { trust_id } = formValues;

          const filterFormValues = filterNestedChangedFormFields(
            { trust_id },
            dirtyFields
          );

          onSubmit({ ...filterFormValues, branch_id: branchIds });
        })();
      },
    }));

    return (
      <FormProvider {...methods}>
        <FormSection title={t("donation.import.label")}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <TrustAutocompleteFromMultipleBranch
              loading={loading}
              branchIds={[branchIds]}
              name="trust_id"
              control={control}
              label={t("trust.label")}
              required
              sx={{
                width: "350px",
              }}
              error={!!errors.trust_id}
              helperText={errorMessages(errors.trust_id?.message)}
            />

            <Button
              startIcon={<Download height={22} width={22} />}
              onClick={() => {
                downloadFile(SAMPLE_FILE, "donation_sample_file.xlsx");
              }}
            >
              {t("sample.file.label")}
            </Button>
          </Stack>
        </FormSection>

        <FormSection>
          <Stack gap="25px">
            <ExcelImportProcess<DonationImportDetails>
              name="excel_file"
              excelImportFieldLabels={donationFieldLabels}
              excelImportData={excelDonationImportData}
              setExcelImportData={setExcelDonationImportData}
            />
          </Stack>
        </FormSection>
      </FormProvider>
    );
  }
);

DonationImportForm.displayName = "DonationImportForm";
