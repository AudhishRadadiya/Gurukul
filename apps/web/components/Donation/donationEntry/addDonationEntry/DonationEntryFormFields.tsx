import {
  DatePicker,
  EditIconAction,
  GridProvider,
  HistoryIconAction,
  TextField,
} from "@codezee/sixtify-brahma";
import { MailOutlineOutlined } from "@mui/icons-material";
import CachedIcon from "@mui/icons-material/Cached";
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";

import { AlertMessage } from "@web/components/common/AlertMessage";
import { BankAutocomplete } from "@web/components/common/Autocomplete/BankAutocomplete";
import { BranchWiseEventAutocomplete } from "@web/components/common/Autocomplete/BranchWiseEventAutocomplete";
import { BusinessNameAutocomplete } from "@web/components/common/Autocomplete/BusinessNameAutocomplete";
import { CityAutocomplete } from "@web/components/common/Autocomplete/CityAutocomplete";
import { CommonAutocomplete } from "@web/components/common/Autocomplete/CommonAutocomplete";
import { ContactNumberAutocomplete } from "@web/components/common/Autocomplete/ContactNumberAutocomplete";
import { DonationAutocomplete } from "@web/components/common/Autocomplete/DonationAutocomplete";
import { DonationModeAutocomplete } from "@web/components/common/Autocomplete/DonationModeAutocomplete";
import { StateAutocomplete } from "@web/components/common/Autocomplete/StateAutocomplete";
import { TrustAutocompleteFromMultipleBranch } from "@web/components/common/Autocomplete/TrustAutocompleteFromMultipleBranch";
import { CheckboxWithLabel } from "@web/components/common/checkboxWithLabel/CheckboxWithLabel";
import {
  CONTACT_NO,
  FIRST_NAME,
  LAST_NAME,
  MIDDLE_NAME,
} from "@web/components/common/hooks/constant";
import { NumericTextField } from "@web/components/common/NumericTextField/NumericTextField";
import { PanCardTextField } from "@web/components/common/PanCardTextField/PanCardTextField";
import type { DonationEntryFormFieldValues } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import type { PreviousDonationDetail } from "@web/components/Donation/donationEntry/dialogs/hooks/useGetPreviousDonationDetail";
import { useGetPreviousDonationDetail } from "@web/components/Donation/donationEntry/dialogs/hooks/useGetPreviousDonationDetail";
import { donationEntryFields } from "@web/components/Donation/donationEntry/dialogs/PreviousDonationList";
import { useBranch } from "@web/context/BranchContext";
import { usePostCityAndStateFromPinCode } from "@web/hooks/address/usePostCityAndStateFromPinCode";
import { cancelReceiptKeys } from "@web/queryKeysFactories/cancelReceipt";
import type { DialogTypes } from "@web/types/dialogs";
import { Debounce_Delay, errorMessages } from "@web/utils/helper";

export type DonationEntryFormFieldsArgs = {
  loading: boolean;
  onDialogOpen: (config: DialogTypes) => void;
  setToggleDonationEntryList: (data: boolean) => void;
  toggleDonationEntryList: boolean;
};

export const DonationEntryFormFields = ({
  loading,
  onDialogOpen,
  setToggleDonationEntryList,
  toggleDonationEntryList,
}: DonationEntryFormFieldsArgs) => {
  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  const queryClient = useQueryClient();

  const methods = useFormContext<DonationEntryFormFieldValues>();

  const {
    clearErrors,
    control,
    formState: { defaultValues, dirtyFields, errors },
    setError,
    setValue,
    watch,
  } = methods;

  const { branchIds } = useBranch();

  const trustId = watch("trust_id");

  const isLastFiveDays = watch("last_five_entry");

  const contactNumber = watch("contact_no");

  const showBusinessName = watch("show_business_name") ?? false;

  const businessName = watch("business_name") ?? null;

  const donationModeId = watch("donation_mode_id");

  const isReminder = watch("is_reminder");

  const isBankMode = watch("is_bank_mode");

  const receiptNo = watch("receipt_no");

  const amount = watch("amount");

  const addressLimit = watch("trust_data.address_limit");

  const chequeLimit = watch("trust_data.cheque_limit");

  const isShowIdFields = watch("show_id_fields");

  const onRefreshReceiptNumber = () => {
    if (trustId && branchIds) {
      queryClient.invalidateQueries({
        queryKey: cancelReceiptKeys.generateReceiptNumber(branchIds, trustId),
      });
    }
  };

  const [pincodeInput] = useDebounceValue(watch("pincode"), Debounce_Delay);

  const [shouldFetchPreviousDonation, setShouldFetchPreviousDonation] =
    useState(false);

  const { data: previousDonationData } = useGetPreviousDonationDetail({
    contact_no:
      shouldFetchPreviousDonation && contactNumber ? contactNumber : "",
    endRow: 1,
    startRow: 0,
  });

  const { data } = usePostCityAndStateFromPinCode({
    pinCode: !errors.pincode && pincodeInput ? pincodeInput : "",
  });

  const { city, state } = useMemo<
    Pick<DonationEntryFormFieldValues, "city" | "state">
  >(() => {
    return {
      city: data?.city ?? null,
      state: data?.state ?? null,
    };
  }, [data]);

  useMemo(() => {
    setValue("city", city, { shouldValidate: true });
    setValue("state", state, { shouldValidate: true });
  }, [city, state, showBusinessName]);

  useMemo(() => {
    if (!isShowIdFields) {
      if (isBankMode && chequeLimit && amount) {
        if (amount > chequeLimit) {
          setValue("show_id_fields", true);
        } else {
          setValue("show_id_fields", false);
        }
      }
    }
  }, [amount, isBankMode, chequeLimit]);

  // Auto-fill form fields from previous donation when Tab is pressed
  useMemo(() => {
    if (
      shouldFetchPreviousDonation &&
      previousDonationData?.donationDetail &&
      previousDonationData.donationDetail.length > 0 &&
      contactNumber
    ) {
      const firstDonation = previousDonationData.donationDetail[0];

      if (!firstDonation) {
        return;
      }

      const firstDonationData = {
        address: firstDonation.address,
        city: firstDonation.city,
        email_id: firstDonation.email_id,
        pan_no: firstDonation.pan_no,
        pincode: firstDonation.pincode,
        state: firstDonation.state,
      };

      setValue("selected_previousDonation", firstDonationData, {
        shouldDirty: true,
      });

      donationEntryFields.forEach((field) => {
        const value = firstDonation[field as keyof PreviousDonationDetail];

        setValue(field, value as never, {
          shouldDirty: true,
        });
      });

      clearErrors(donationEntryFields);
      setShouldFetchPreviousDonation(false);
    }
  }, [previousDonationData, contactNumber, shouldFetchPreviousDonation]);

  return (
    <Stack gap="20px" padding="20px">
      <Stack direction="row" gap="20px" alignItems="center">
        <Typography width="15%" variant="h5">
          {t("donation.entry.label")}
        </Typography>

        <Stack direction="row" gap="20px" flexWrap="wrap">
          <CheckboxWithLabel
            control={control}
            name="atg"
            label={t("common.80g")}
          />

          <CheckboxWithLabel
            control={control}
            name="prasad"
            label={t("prasad.label")}
          />

          <CheckboxWithLabel
            control={control}
            name="direct_print"
            label={t("common.direct.print")}
          />

          <CheckboxWithLabel
            control={control}
            name="print_receipt"
            label={t("common.direct.print.receipt")}
          />

          <CheckboxWithLabel
            control={control}
            name="send_email"
            label={t("common.send.label", { label: t("email.label") })}
          />

          <CheckboxWithLabel
            control={control}
            name="send_sms"
            label={t("common.send.label", { label: t("sms.label") })}
          />

          <CheckboxWithLabel
            control={control}
            name="send_whatsapp"
            label={t("common.send.label", {
              label: t("common.whatsApp.label"),
            })}
          />

          <CheckboxWithLabel
            control={control}
            name="focus_on_trust"
            label={t("common.focus.on.trust")}
          />

          <CheckboxWithLabel
            control={control}
            name="last_five_entry"
            label={t("common.show.last.five.entries")}
          />
        </Stack>
      </Stack>

      <GridProvider gap="20px" columns={3}>
        <DatePicker
          name="date"
          label={t("date.label")}
          control={control}
          loading={loading}
          clearable={false}
          disabled
          required
          error={!!errors.date}
          helperText={errorMessages(errors.date?.message)}
        />

        <TextField
          control={control}
          loading={loading}
          isCapitalize
          label={t("common.receipt.label", {
            label: t("common.number.label"),
          })}
          name="receipt_no"
          disabled
          required
          error={!!errors.receipt_no}
          helperText={errorMessages(errors.receipt_no?.message)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={onRefreshReceiptNumber}
                  disabled={!trustId || !donationModeId}
                >
                  <CachedIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TrustAutocompleteFromMultipleBranch
          loading={loading}
          name="trust_id"
          label={t("trust.label")}
          disabled={
            (!!defaultValues?.trust_id && dirtyFields.trust_id) ||
            !!defaultValues?.trust_id
          }
          control={control}
          required
          error={!!errors.trust_id}
          helperText={errorMessages(errors.trust_id?.message)}
          branchIds={[branchIds]}
        />
      </GridProvider>

      <GridProvider gap="20px" columns={3}>
        <DonationModeAutocomplete
          loading={loading}
          name="donation_mode_id"
          disabled={
            !trustId ||
            (!!defaultValues?.donation_mode_id &&
              dirtyFields.donation_mode_id) ||
            !!defaultValues?.donation_mode_id
          }
          control={control}
          required
          error={!!errors.donation_mode_id}
          helperText={errorMessages(errors.donation_mode_id?.message)}
        />

        <Stack direction="row" gap="10px" alignItems="center">
          <Box flex="0 0 90%">
            <ContactNumberAutocomplete
              name="contact_no"
              loading={loading}
              disabled={!receiptNo}
              optionsKey={CONTACT_NO}
              control={control}
              module="past-entry"
              required
              label={t("common.contact.label")}
              error={!!errors.contact_no}
              helperText={errorMessages(errors.contact_no?.message)}
              onKeyDown={(e) => {
                if (e.key === "Tab" && !errors.contact_no && contactNumber) {
                  // Always trigger fetch for auto-fill (hook called once)
                  setShouldFetchPreviousDonation(true);

                  // Open history dialog if last_five_entry is checked
                  if (isLastFiveDays) {
                    onDialogOpen("history");
                    setToggleDonationEntryList(false);
                  }
                }
              }}
            />
          </Box>

          <Box flex="0 0 10%">
            <HistoryIconAction
              disabled={!contactNumber || !isLastFiveDays}
              onClick={() => {
                onDialogOpen("history");
                setToggleDonationEntryList(false);
              }}
            />
          </Box>
        </Stack>

        <TextField
          control={control}
          label={t("email.label")}
          disabled={!receiptNo}
          name="email_id"
          letterCase="mixed"
          required
          loading={loading}
          error={!!errors.email_id}
          helperText={errorMessages(errors.email_id?.message)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineOutlined fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </GridProvider>

      <GridProvider gap="20px" columns={showBusinessName ? 4 : 3}>
        <CommonAutocomplete
          name="first_name"
          loading={loading}
          disabled={!receiptNo || !!businessName}
          optionsKey={FIRST_NAME}
          control={control}
          module="past-entry"
          freeSolo
          required
          characterType="string"
          createOptionOnType
          letterCase="uppercase"
          label={t("common.first.name")}
          error={!!errors.first_name}
          helperText={errorMessages(errors.first_name?.message)}
          setError={setError}
        />

        <CommonAutocomplete
          name="middle_name"
          loading={loading}
          freeSolo
          disabled={!receiptNo || !!businessName}
          optionsKey={MIDDLE_NAME}
          control={control}
          characterType="string"
          createOptionOnType
          letterCase="uppercase"
          module="past-entry"
          label={t("middleName.label")}
          error={!!errors.middle_name}
          helperText={errorMessages(errors.middle_name?.message)}
          setError={setError}
        />

        <Stack direction="row" gap="10px" alignItems="center">
          <Box flex="0 0 90%">
            <CommonAutocomplete
              name="last_name"
              loading={loading}
              optionsKey={LAST_NAME}
              disabled={!receiptNo || !!businessName}
              freeSolo
              characterType="string"
              createOptionOnType
              letterCase="uppercase"
              control={control}
              module="past-entry"
              label={t("common.last.name")}
              error={!!errors.last_name}
              helperText={errorMessages(errors.last_name?.message)}
              setError={setError}
            />
          </Box>

          <Box flex="0 0 10%">
            <EditIconAction
              onClick={() => {
                setValue("show_business_name", !showBusinessName);
              }}
            />
          </Box>

          <Box flex="0 0 90%">
            {showBusinessName && (
              <BusinessNameAutocomplete
                createOptionOnType
                loading={loading}
                disabled={!receiptNo}
                name="business_name"
                freeSolo
                control={control}
                contactNumber={contactNumber ?? ""}
                error={!!errors.business_name}
                helperText={errorMessages(errors.business_name?.message)}
              />
            )}
          </Box>
        </Stack>
      </GridProvider>

      <GridProvider gap="20px">
        <TextField
          name="name_of_receipt"
          control={control}
          loading={loading}
          disabled={!receiptNo}
          label={t("common.name.of.receipt")}
          required
          error={!!errors.name_of_receipt}
          helperText={errorMessages(errors.name_of_receipt?.message)}
        />

        <TextField
          name="address"
          control={control}
          disabled={!receiptNo}
          loading={loading}
          label={t("address.label")}
          required={!!amount && !!addressLimit && amount > addressLimit}
          multiline
          characterType="any-character"
          rows={4}
          error={!!errors.address}
          helperText={errorMessages(errors.address?.message)}
        />

        <TextField
          name="pincode"
          control={control}
          maxLength={6}
          disabled={!receiptNo}
          loading={loading}
          label={t("common.pincode")}
          required
          setError={setError}
          error={!!errors.pincode}
          helperText={errorMessages(errors.pincode?.message)}
        />
      </GridProvider>

      <GridProvider gap="20px" columns={4}>
        <CityAutocomplete
          name="city"
          loading={loading}
          disabled={!receiptNo}
          control={control}
          error={!!errors.city}
          helperText={errorMessages(errors.city?.message)}
        />

        <StateAutocomplete
          name="state"
          control={control}
          loading={loading}
          disabled={!receiptNo}
          error={!!errors.state}
          helperText={errorMessages(errors.state?.message)}
        />

        <PanCardTextField
          name="pan_no"
          control={control}
          placeholder={t("common.pan.no.placeholder")}
          disabled={!receiptNo}
          loading={loading}
          label={t("common.pan.no")}
          setError={setError}
          error={!!errors.pan_no}
          helperText={errorMessages(errors.pan_no?.message)}
        />

        <TextField
          name="aadhar_no"
          disabled={!receiptNo}
          control={control}
          loading={loading}
          label={t("aadhar.no.label")}
          maxLength={12}
          placeholder={t("aadhar.no.label.placeholder")}
          setError={setError}
          error={!!errors.aadhar_no}
          helperText={errorMessages(errors.aadhar_no?.message)}
        />
      </GridProvider>

      <Stack
        sx={{
          border: `1px solid ${lightBlue[100]}`,
          borderRadius: "5px",
          gap: "20px",
          padding: "15px",
        }}
      >
        <GridProvider gap="20px" columns={4}>
          <Stack direction="row" gap="10px" alignItems="center">
            <CheckboxWithLabel
              control={control}
              name="show_id_fields"
              sx={{ gridColumn: "span 3" }}
              label={t("common.show_id_fields")}
            />
          </Stack>

          {isShowIdFields && (
            <>
              <TextField
                name="driving_licence_no"
                control={control}
                disabled={!receiptNo}
                loading={loading}
                label={t("dl.no.label")}
                placeholder={t("dl.no.label.placeholder")}
                setError={setError}
                error={!!errors.driving_licence_no}
                helperText={errorMessages(errors.driving_licence_no?.message)}
              />

              <TextField
                name="electors_number"
                control={control}
                disabled={!receiptNo}
                label={t("common.elector.no")}
                placeholder={t("common.elector.no.placeholder")}
                loading={loading}
                isCapitalize
                error={!!errors.electors_number}
                helperText={errorMessages(errors.electors_number?.message)}
              />

              <TextField
                name="passport_no"
                control={control}
                disabled={!receiptNo}
                placeholder={t("common.passport.no.placeholder")}
                loading={loading}
                label={t("common.passport.no")}
                setError={setError}
                error={!!errors.passport_no}
                helperText={errorMessages(errors.passport_no?.message)}
              />
            </>
          )}
        </GridProvider>

        {!dirtyFields.show_id_fields &&
          isBankMode &&
          chequeLimit &&
          chequeLimit > 0 &&
          amount !== null &&
          amount > chequeLimit && (
            <AlertMessage severity="warning" message={t("proof.validation")} />
          )}
      </Stack>

      <GridProvider gap="20px" columns={3}>
        <Stack direction="row" gap="10px" alignItems="center">
          <Box flex="0 0 90%">
            <NumericTextField
              control={control}
              disabled={!receiptNo}
              loading={loading}
              label={t("amount.label")}
              required
              name="amount"
              error={!!errors.amount}
              thousandSeparator
              removeDecimalScale
              helperText={errorMessages(errors.amount?.message)}
            />
          </Box>

          {toggleDonationEntryList && (
            <Box flex="0 0 10%">
              <HistoryIconAction
                disabled={!contactNumber}
                onClick={() => {
                  onDialogOpen("history");
                  setToggleDonationEntryList(true);
                }}
              />
            </Box>
          )}
        </Stack>

        <TextField
          control={control}
          loading={loading}
          disabled={!receiptNo}
          label={t("ref.receipt.no.label")}
          name="ref_receipt_no"
          setError={setError}
          error={!!errors.ref_receipt_no}
          helperText={errorMessages(errors.ref_receipt_no?.message)}
        />

        <DonationAutocomplete
          loading={loading}
          disabled={!receiptNo}
          name="donation_type_id"
          label={t("common.donation.for")}
          required
          control={control}
          error={!!errors.donation_type_id}
          helperText={errorMessages(errors.donation_type_id?.message)}
        />

        <BranchWiseEventAutocomplete
          loading={loading}
          disabled={!receiptNo}
          name="event_type_id"
          label={t("eventType.label")}
          control={control}
          required
          error={!!errors.event_type_id}
          helperText={errorMessages(errors.event_type_id?.message)}
          branchIds={[branchIds]}
        />

        <TextField
          name="event_reminder_note"
          control={control}
          disabled={!isReminder}
          loading={loading}
          label={t("common.event.reminder", {
            label: t("common.note"),
          })}
          multiline
          letterCase="mixed"
          characterType="any-character"
          rows={4}
          error={!!errors.event_reminder_note}
          helperText={errorMessages(errors.event_reminder_note?.message)}
        />

        <DatePicker
          name="event_reminder_date"
          label={t("common.event.reminder", {
            label: t("date.label"),
          })}
          required
          disabled={!isReminder}
          control={control}
          loading={loading}
          clearable={false}
          error={!!errors.event_reminder_date}
          helperText={errorMessages(errors.event_reminder_date?.message)}
        />

        {isBankMode && (
          <TextField
            control={control}
            loading={loading}
            label={t("cheque.label", {
              label: t("common.no"),
            })}
            required
            name="cheque_no"
            setError={setError}
            error={!!errors.cheque_no}
            helperText={errorMessages(errors.cheque_no?.message)}
          />
        )}

        {isBankMode && (
          <BankAutocomplete
            loading={loading}
            name="bank_id"
            required
            label={t("bank.name.label")}
            control={control}
            error={!!errors.bank_id}
            helperText={errorMessages(errors.bank_id?.message)}
          />
        )}

        <TextField
          name="remarks"
          control={control}
          disabled={!receiptNo}
          loading={loading}
          label={t("remark.label")}
          multiline
          letterCase="mixed"
          characterType="any-character"
          rows={4}
          error={!!errors.remarks}
          helperText={errorMessages(errors.remarks?.message)}
        />

        <TextField
          name="organize_remark"
          control={control}
          disabled={!receiptNo}
          loading={loading}
          label={t("organize.remark.label")}
          multiline
          letterCase="mixed"
          characterType="any-character"
          rows={4}
          error={!!errors.organize_remark}
          helperText={errorMessages(errors.organize_remark?.message)}
        />
      </GridProvider>
    </Stack>
  );
};
