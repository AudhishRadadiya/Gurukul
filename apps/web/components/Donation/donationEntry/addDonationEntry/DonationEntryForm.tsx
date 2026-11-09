import { toasts } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import type { ForwardedRef } from "react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FormProvider,
  useForm,
  type UseFormGetValues,
  type UseFormReset,
  type UseFormSetError,
} from "react-hook-form";
import type { z } from "zod";

import { useGetBranchOptions } from "@web/components/common/Autocomplete/hooks/useGetBranchOptions";
import type { BusinessNameOptionType } from "@web/components/common/Autocomplete/hooks/useGetBusinessNameOptions";
import { useGetDonationModeOptions } from "@web/components/common/Autocomplete/hooks/useGetDonationModeOptions";
import { useGetEventOptions } from "@web/components/common/Autocomplete/hooks/useGetEventOptions";
import { useGetReceiptNumber } from "@web/components/common/Autocomplete/hooks/useGetReceiptNumber";
import { useGetTrustOptions } from "@web/components/common/Autocomplete/hooks/useGetTrustOptions";
import { DonationEntryFormFields } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryFormFields";
import {
  donationEntryFormDefaultValues,
  DonationEntryFormSchema,
} from "@web/components/Donation/donationEntry/addDonationEntry/hooks/DonationEntryFormSchema";
import { useGetLatestReceiptNo } from "@web/components/Donation/donationEntry/addDonationEntry/hooks/useGetLatestReceiptNo";
import { BranchConfirmationDialog } from "@web/components/Donation/donationEntry/dialogs/BranchConfirmationDialog";
import { PreviousDonationDetailDialog } from "@web/components/Donation/donationEntry/dialogs/PreviousDonationDetailDialog";
import { useBranch } from "@web/context/BranchContext";
import { businessDetailKeys } from "@web/queryKeysFactories/businessDetail";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";
import { removeNegationValues } from "@web/utils/helper";

export type DonationEntryFormFieldValues = z.infer<
  typeof DonationEntryFormSchema
>;

export type DonationEntryFormArgs = {
  defaultValues?: DonationEntryFormFieldValues;
  loading: boolean;
};

export type FormRef = {
  getValues: UseFormGetValues<DonationEntryFormFieldValues>;
  reset: UseFormReset<DonationEntryFormFieldValues>;
  setError: UseFormSetError<DonationEntryFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<DonationEntryFormFieldValues>) => void
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
    const router = useRouter();

    const [toggleDonationEntryList, setToggleDonationEntryList] =
      useState(false);

    const initialBranchIdRef = useRef<string | null>(null);

    const hasShownInitialDialogRef = useRef(false);

    // Mark branch as confirmed (store only the last one)
    const markBranchAsConfirmed = (branchId: string) => {
      if (typeof window === "undefined") {
        return;
      }

      localStorage.setItem("donationEntryLastConfirmedBranch", branchId);
    };

    const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

    const methods = useForm<DonationEntryFormFieldValues>({
      mode: "all",
      resolver: zodResolver(DonationEntryFormSchema),
      values: defaultValues,
    });

    const { branchIds } = useBranch();

    const { data: branchOptions } = useGetBranchOptions({ isUserWise: true });

    const currentBranchName = useMemo(() => {
      if (!branchIds || !branchOptions) {
        return undefined;
      }

      const branch = branchOptions.find(({ value }) => value === branchIds);

      return branch?.label;
    }, [branchIds, branchOptions]);

    const {
      clearErrors,
      getValues,
      handleSubmit,
      reset,
      resetField,
      setError,
      setValue,
      watch,
    } = methods;

    const trustId = watch("trust_id") ?? "";

    const lastName = watch("last_name");

    const firstName = watch("first_name");

    const middleName = watch("middle_name");

    const isReminder = watch("is_reminder");

    const isBankMode = watch("is_bank_mode");

    const contactNumber = watch("contact_no") ?? "";

    const eventTypeId = watch("event_type_id");

    const businessName = watch("business_name");

    const donationModeId = watch("donation_mode_id") ?? "";

    const showBusinessName = watch("show_business_name");

    const selectedPreviousDonation = watch("selected_previousDonation");

    const selectedPrevDonationKeys: (keyof typeof selectedPreviousDonation)[] =
      ["address", "city", "email_id", "pan_no", "pincode", "state"];

    const { data: donationModeOptions } = useGetDonationModeOptions();

    const { data: eventOptions } = useGetEventOptions();

    const { data: BusinessNameOptions = [] } = useQuery<
      BusinessNameOptionType[]
    >({
      enabled: false,
      queryFn: () => {
        return [];
      },
      queryKey: businessDetailKeys.options(contactNumber),
    });

    const { data: receiptNumber } = useGetReceiptNumber({
      branch_id: branchIds,
      trust_id: trustId,
    });

    const { data: latestReceiptNo } = useGetLatestReceiptNo();

    const generatedReceiptNumber = receiptNumber?.receipt_number;

    const generatedReceiptSequence = receiptNumber?.receipt_sequence;

    useMemo(() => {
      setValue("ref_receipt_no", latestReceiptNo?.ref_receipt_no, {
        shouldDirty: true,
      });
    }, [latestReceiptNo]);

    useEffect(() => {
      const mode = donationModeOptions?.find(
        ({ value }) => value === donationModeId
      );

      setValue("is_bank_mode", !!mode?.is_bank);
    }, [donationModeId, donationModeOptions]);

    useEffect(() => {
      const event = eventOptions.find(({ value }) => value === eventTypeId);

      setValue("is_reminder", !!event?.need_reminder);
    }, [eventTypeId, eventOptions]);

    useEffect(() => {
      if (
        generatedReceiptNumber &&
        generatedReceiptSequence &&
        !defaultValues.receipt_no
      ) {
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
    }, [isBankMode, showBusinessName, isReminder]);

    useEffect(() => {
      if (!businessName) {
        const receiptName = [firstName, middleName, lastName]
          .filter(Boolean)
          .join(" ");

        setValue("name_of_receipt", receiptName, { shouldDirty: true });

        const hasAllSelectedDonationValues = selectedPrevDonationKeys.some(
          (key) => selectedPreviousDonation[key] != null
        );

        if (hasAllSelectedDonationValues) {
          selectedPrevDonationKeys.forEach((key) => {
            setValue(key, selectedPreviousDonation[key], {
              shouldDirty: true,
            });
          });
        }
      }

      if (showBusinessName && businessName) {
        const businessNameObj = BusinessNameOptions.find(
          ({ value }) => value === businessName
        );

        if (businessNameObj) {
          const { address, city, email, label, pan_no, pincode, state } =
            businessNameObj;

          setValue("name_of_receipt", label, { shouldDirty: true });
          setValue("pan_no", pan_no, { shouldDirty: true });
          setValue("address", address, { shouldDirty: true });
          setValue("email_id", email, { shouldDirty: true });
          setValue("pincode", pincode, { shouldDirty: true });
          setValue("state", state, { shouldDirty: true });
          setValue("city", city, { shouldDirty: true });
        }
      }
    }, [firstName, middleName, lastName, businessName]);

    const { data: trustOptions } = useGetTrustOptions();

    useMemo(() => {
      if (!!trustOptions && !!trustId) {
        const trustData = trustOptions.find(({ value }) => value === trustId);

        if (trustData) {
          setValue("trust_data", trustData);
        }
      }
    }, [trustId, trustOptions]);

    const getCashLimitIfExceeded = (
      formValues: DonationEntryFormFieldValues
    ) => {
      const selectedDonationMode = donationModeOptions.find(
        ({ value }) => value === formValues.donation_mode_id
      );

      const isCashMode = selectedDonationMode?.label?.toLowerCase() === "cash";

      if (!isCashMode) {
        return null;
      }

      const cashLimit = trustOptions.find(
        ({ value }) => value === formValues.trust_id
      )?.cash_limit;

      if (!!cashLimit && !!formValues.amount && formValues.amount > cashLimit) {
        return cashLimit;
      }

      return null;
    };

    useImperativeHandle(ref, () => ({
      getValues,
      reset,
      setError,

      submitForm(onSubmit) {
        handleSubmit(
          (formValues) => {
            const exceededCashLimit = getCashLimitIfExceeded(formValues);

            if (exceededCashLimit) {
              toasts.error({
                title: t("common.amount.cash_limit", {
                  maximum_amount: exceededCashLimit,
                }),
              });

              return;
            }

            const filterFormValues = removeNegationValues(formValues);

            onSubmit({ ...filterFormValues, branch_id: branchIds });
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

    const handleBranchConfirmation = () => {
      if (branchIds) {
        markBranchAsConfirmed(branchIds);
      }

      onDialogClose();
    };

    const handleBranchCancellation = () => {
      onDialogClose();
      router.push("/donation/donation-entry");
    };

    const dialogRenderer: DialogRenderer = {
      branchConfirmation: (
        <BranchConfirmationDialog
          branchName={currentBranchName}
          open
          onClose={handleBranchCancellation}
          onConfirm={handleBranchConfirmation}
        />
      ),
      history: (
        <PreviousDonationDetailDialog
          open
          onClose={() => {
            onDialogClose();

            setTimeout(() => {
              const amountInput: HTMLInputElement | null =
                document.querySelector("input[name='amount']");

              if (amountInput) {
                amountInput.focus();
              }
            }, 300);
          }}
          contactNumber={contactNumber}
          toggleDonationEntryList={toggleDonationEntryList}
          setToggleDonationEntryList={setToggleDonationEntryList}
        />
      ),
    };

    // Show branch confirmation dialog on first load or when branch changes
    useMemo(() => {
      if (!branchIds) {
        return;
      }

      // Get last confirmed branch from localStorage
      const lastConfirmedBranch =
        typeof window !== "undefined"
          ? localStorage.getItem("donationEntryLastConfirmedBranch")
          : null;

      // If current branch is the same as last confirmed branch, don't show modal
      if (lastConfirmedBranch === branchIds) {
        initialBranchIdRef.current = branchIds;
        hasShownInitialDialogRef.current = true;

        return;
      }

      // If branch changed and new branch is different from last confirmed, show dialog
      if (
        initialBranchIdRef.current &&
        initialBranchIdRef.current !== branchIds
      ) {
        initialBranchIdRef.current = branchIds;
        onDialogOpen("branchConfirmation");

        return;
      }

      // First time loading with this branch (or different from last confirmed)
      if (!hasShownInitialDialogRef.current) {
        initialBranchIdRef.current = branchIds;
        hasShownInitialDialogRef.current = true;
        onDialogOpen("branchConfirmation");
      }
    }, [branchIds]);

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
