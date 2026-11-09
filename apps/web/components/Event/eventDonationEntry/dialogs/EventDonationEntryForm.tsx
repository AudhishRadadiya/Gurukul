import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  DatePicker,
  FormContainer,
  FormGridLayout,
  HistoryIconAction,
  TextField,
  useDialogActions,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack } from "@mui/material";
import { t } from "i18next";
import { DateTime } from "luxon";
import type { ForwardedRef, ReactNode } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

import { BranchWiseEventAutocomplete } from "@web/components/common/Autocomplete/BranchWiseEventAutocomplete";
import { NumericTextField } from "@web/components/common/NumericTextField/NumericTextField";
import { AddressDetailDialog } from "@web/components/Event/eventDonationEntry/dialogs/addressDetailDialog/AddressDetailDialog";
import { useBranch } from "@web/context/BranchContext";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const EventDonationEntryFormSchema = z.object({
  amount: z
    .number()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  branch_id: z.string().nullable(),
  date: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  donar_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  donar_name: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  event_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  hastak_id: z.string().nullable(),
  hastak_name: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  note: z.string().max(255, "common.maxLength").nullable().optional(),
});

export type EventDonationEntryFormFieldValues = z.infer<
  typeof EventDonationEntryFormSchema
>;

type EventDonationEntryFormProps = Partial<{
  defaultValues: EventDonationEntryFormFieldValues;
  loading: boolean;
}>;

export type FormRef = {
  setError: UseFormSetError<EventDonationEntryFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<EventDonationEntryFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: EventDonationEntryFormFieldValues = {
  amount: null,
  branch_id: null,
  date: DateTime.now().toISODate(),
  donar_id: null,
  donar_name: null,
  event_id: null,
  hastak_id: null,
  hastak_name: null,
  note: null,
};

type FieldWithHistoryProps = {
  field: ReactNode;
  onHistoryClick: () => void;
};

const FieldWithHistory = ({ field, onHistoryClick }: FieldWithHistoryProps) => {
  return (
    <Stack direction="row" gap="10px" alignItems="center" flexWrap="nowrap">
      <Box sx={{ flex: "1 1 auto", minWidth: 0, width: "auto" }}>{field}</Box>

      <Box sx={{ flex: "0 0 auto" }}>
        <HistoryIconAction onClick={onHistoryClick} />
      </Box>
    </Stack>
  );
};

export const EventDonationEntryForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: EventDonationEntryFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

    const { isMobile } = useGetDeviceType();

    const methods = useForm<EventDonationEntryFormFieldValues>({
      mode: "all",
      resolver: zodResolver(EventDonationEntryFormSchema),
      values: defaultValues,
    });

    const { branchIds } = useBranch();

    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
    } = methods;

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      setError,

      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(formValues, {
            ...dirtyFields,
            date: true,
          });

          onSubmit({ ...filterFormValues, branch_id: branchIds });
        })();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      donarHistory: (
        <AddressDetailDialog
          open
          onClose={onDialogClose}
          idField="donar_id"
          nameField="donar_name"
        />
      ),
      hastakHistory: (
        <AddressDetailDialog
          open
          onClose={onDialogClose}
          idField="hastak_id"
          nameField="hastak_name"
        />
      ),
    };

    const { amount, date, donar_name, event_id, hastak_name, note } = errors;

    return (
      <FormProvider {...methods}>
        <FormContainer>
          <Stack gap={isMobile ? 1 : 1.5}>
            <FormGridLayout columns={2} columnsOnMobile={1}>
              <BranchWiseEventAutocomplete
                loading={loading}
                name="event_id"
                label={t("common.event.label")}
                required
                control={control}
                error={!!event_id}
                branchIds={[branchIds]}
                helperText={errorMessages(event_id?.message)}
              />

              <DatePicker
                control={control}
                label={t("date.label")}
                name="date"
                loading={loading}
                required
                clearable={false}
                error={!!date}
                helperText={errorMessages(date?.message)}
              />
            </FormGridLayout>

            <FormGridLayout columns={2} columnsOnMobile={1}>
              <FieldWithHistory
                onHistoryClick={() => {
                  onDialogOpen("donarHistory");
                }}
                field={
                  <TextField
                    control={control}
                    loading={loading}
                    name="donar_name"
                    label={t("donor.label")}
                    required
                    disabled
                    setError={setError}
                    error={!!donar_name}
                    helperText={errorMessages(donar_name?.message)}
                  />
                }
              />

              <FieldWithHistory
                onHistoryClick={() => {
                  onDialogOpen("hastakHistory");
                }}
                field={
                  <TextField
                    control={control}
                    loading={loading}
                    name="hastak_name"
                    label={t("hastak.label")}
                    required
                    disabled
                    setError={setError}
                    error={!!hastak_name}
                    helperText={errorMessages(hastak_name?.message)}
                  />
                }
              />
            </FormGridLayout>

            <FormGridLayout columns={2} columnsOnMobile={1}>
              <NumericTextField
                control={control}
                loading={loading}
                label={t("amount.label")}
                required
                name="amount"
                error={!!amount}
                thousandSeparator
                removeDecimalScale
                helperText={errorMessages(amount?.message)}
              />

              <TextField
                name="note"
                label={t("note.label")}
                loading={loading}
                control={control}
                multiline
                letterCase="mixed"
                characterType="any-character"
                error={!!note}
                helperText={errorMessages(note?.message)}
              />
            </FormGridLayout>
          </Stack>
        </FormContainer>

        {openedDialog && dialogRenderer[openedDialog]}
      </FormProvider>
    );
  }
);

EventDonationEntryForm.displayName = "EventDonationEntryForm";
