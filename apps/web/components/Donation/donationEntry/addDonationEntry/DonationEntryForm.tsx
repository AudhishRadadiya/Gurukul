import { toasts } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  FormProvider,
  useForm,
  type UseFormReset,
  type UseFormSetError,
} from "react-hook-form";
import type { z } from "zod";

import { useGetDonationModeOptions } from "@web/components/common/Autocomplete/hooks/useGetDonationModeOptions";
import { useGetEventOptions } from "@web/components/common/Autocomplete/hooks/useGetEventOptions";
import { useGetReceiptNumber } from "@web/components/common/Autocomplete/hooks/useGetReceiptNumber";
import { useGetTrustOptions } from "@web/components/common/Autocomplete/hooks/useGetTrustOptions";
import { DonationEntryFormFields } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryFormFields";
import {
  donationEntryFormDefaultValues,
  DonationEntryFormSchema,
} from "@web/components/Donation/donationEntry/addDonationEntry/hooks/DonationEntryFormSchema";
import { PreviousDonationDetailDialog } from "@web/components/Donation/donationEntry/dialogs/PreviousDonationDetailDialog";
import type { DialogRenderer } from "@web/types/dialogs";
import type { RemoveNull } from "@web/types/shared-types";
import { useDialogActions } from "@web/types/useDialogActions";
import { filterNestedChangedFormFields } from "@web/utils/helper";

export type DonationEntryFormFieldValues = z.infer<
  typeof DonationEntryFormSchema
>;

export type DonationEntryFormNonNullFieldValues =
  RemoveNull<DonationEntryFormFieldValues>;

export type DonationEntryFormArgs = {
  defaultValues?: DonationEntryFormNonNullFieldValues;
  loading: boolean;
};

export type FormRef = {
  reset: UseFormReset<DonationEntryFormNonNullFieldValues>;
  setError: UseFormSetError<DonationEntryFormNonNullFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<DonationEntryFormNonNullFieldValues>) => void
  ) => void;
};

export const DonationEntryForm = forwardRef(
  (
    {
      defaultValues = donationEntryFormDefaultValues,
      loading = false,
    }: DonationEntryFormArgs,
    ref: ForwardedRef<FormRef>
  ) => {
    const [toggleDonationEntryList, setToggleDonationEntryList] =
      useState(false);

    const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

    const methods = useForm<DonationEntryFormNonNullFieldValues>({
      mode: "all",
      resolver: zodResolver(DonationEntryFormSchema),
      values: defaultValues,
    });

    const {
      clearErrors,
      formState: { dirtyFields },
      handleSubmit,
      reset,
      resetField,
      setError,
      setValue,
      watch,
    } = methods;

    const trustId = watch("trust_id");

    const lastName = watch("last_name");

    const firstName = watch("first_name");

    const middleName = watch("middle_name");

    const isReminder = watch("is_reminder");

    const isBankMode = watch("is_bank_mode");

    const contactNumber = watch("contact_no");

    const eventTypeId = watch("event_type_id");

    const businessName = watch("business_name");

    const donationModeId = watch("donation_mode_id");

    const showBusinessName = watch("show_business_name");

    const { data: donationModeOptions } = useGetDonationModeOptions();

    const { data: eventOptions } = useGetEventOptions();

    const { data: receiptNumber } = useGetReceiptNumber({
      donation_mode_id: donationModeId,
      trust_id: trustId,
    });

    const generatedReceiptNumber = receiptNumber?.receipt_number;

    const generatedReceiptSequence = receiptNumber?.receipt_sequence;

    useEffect(() => {
      const mode = donationModeOptions.find(
        ({ value }) => value === donationModeId
      );

      setValue("is_bank_mode", !!mode?.is_bank);
    }, [donationModeId, donationModeOptions]);

    useEffect(() => {
      const event = eventOptions.find(({ value }) => value === eventTypeId);

      setValue("is_reminder", !!event?.need_reminder);
    }, [eventTypeId, eventOptions]);

    useEffect(() => {
      if (generatedReceiptNumber && generatedReceiptSequence) {
        setValue("receipt_no", generatedReceiptNumber, {
          shouldDirty: true,
        });

        setValue("receipt_sequence", generatedReceiptSequence, {
          shouldDirty: true,
        });

        clearErrors("receipt_no");
      }
    }, [receiptNumber]);

    useEffect(() => {
      if (!isBankMode) {
        resetField("cheque_no");

        resetField("bank_id");
      }

      if (!isReminder) {
        resetField("event_reminder_date");

        resetField("event_reminder_note");
      }

      if (!showBusinessName) {
        resetField("business_name");
      }
    }, [isBankMode, showBusinessName, isReminder]);

    useEffect(() => {
      if (!showBusinessName) {
        const receiptName = [firstName, middleName, lastName]
          .filter(Boolean)
          .join(" ");

        setValue("name_of_receipt", receiptName, { shouldDirty: true });
      }

      if (showBusinessName && businessName) {
        setValue("name_of_receipt", businessName, { shouldDirty: true });
      }
    }, [firstName, middleName, lastName, businessName]);

    useImperativeHandle(ref, () => ({
      reset,
      setError,

      submitForm(onSubmit) {
        handleSubmit(
          (formValues) => {
            const filterFormValues = filterNestedChangedFormFields(formValues, {
              ...dirtyFields,
              atg: true,
              date: true,
              print_receipt: true,
            });

            onSubmit(filterFormValues);
          },

          (formErrors) => {
            if (formErrors.proof_validate?.message === "proof.validation") {
              toasts.error({
                title: t("proof.validation"),
              });
            }
          }
        )();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      history: (
        <PreviousDonationDetailDialog
          open
          onClose={onDialogClose}
          contactNumber={contactNumber}
          toggleDonationEntryList={toggleDonationEntryList}
          setToggleDonationEntryList={setToggleDonationEntryList}
        />
      ),
    };

    const { data: trustOption } = useGetTrustOptions();

    useMemo(() => {
      const trustData = trustOption?.find(({ value }) => value === trustId);

      if (trustData) {
        setValue("trust_data", trustData);
      }
    }, [trustId]);

    return (
      <FormProvider {...methods}>
        <DonationEntryFormFields
          loading={loading}
          onDialogOpen={onDialogOpen}
          toggleDonationEntryList={toggleDonationEntryList}
          setToggleDonationEntryList={setToggleDonationEntryList}
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </FormProvider>
    );
  }
);

DonationEntryForm.displayName = "DonationEntryForm";
