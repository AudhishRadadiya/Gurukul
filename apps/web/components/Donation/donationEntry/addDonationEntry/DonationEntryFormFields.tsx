import {
  DatePicker,
  EditIconAction,
  FormGridLayout,
  FormSection,
  HistoryIconAction,
  PadBox,
  TextField,
} from "@codezee/sixtify-brahma";
import { MailOutlineOutlined } from "@mui/icons-material";
import CachedIcon from "@mui/icons-material/Cached";
import { Box, IconButton, InputAdornment, Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { useFormContext } from "react-hook-form";

import { BankAutocomplete } from "@web/components/common/Autocomplete/BankAutocomplete";
import { BusinessNameAutocomplete } from "@web/components/common/Autocomplete/BusinessNameAutocomplete";
import { CommonAutocomplete } from "@web/components/common/Autocomplete/CommonAutocomplete";
import { DonationAutocomplete } from "@web/components/common/Autocomplete/DonationAutocomplete";
import { DonationModeAutocomplete } from "@web/components/common/Autocomplete/DonationModeAutocomplete";
import { DonationModeOfReceiptAutocomplete } from "@web/components/common/Autocomplete/DonationModeOfReceiptAutocomplete";
import { EventAutocomplete } from "@web/components/common/Autocomplete/EventAutocomplete";
import { TrustAutocomplete } from "@web/components/common/Autocomplete/TrustAutocomplete";
import { CheckboxWithLabel } from "@web/components/common/checkboxWithLabel/CheckboxWithLabel";
import {
  CITY,
  CONTACT_NO,
  FIRST_NAME,
  LAST_NAME,
  MIDDLE_NAME,
} from "@web/components/common/hooks/constant";
import type { DonationEntryFormNonNullFieldValues } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import { cancelReceiptKeys } from "@web/queryKeysFactories/cancelReceipt";
import type { DialogTypes } from "@web/types/dialogs";
import { errorMessages } from "@web/utils/helper";

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
  const queryClient = useQueryClient();

  const methods = useFormContext<DonationEntryFormNonNullFieldValues>();

  const {
    control,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = methods;

  const trustId = watch("trust_id");

  const isLastFiveDays = watch("last_five_entry");

  const contactNumber = watch("contact_no");

  const showBusinessName = watch("show_business_name");

  const donationModeId = watch("donation_mode_id");

  const isReminder = watch("is_reminder");

  const isBankMode = watch("is_bank_mode");

  const receiptNo = watch("receipt_no");

  const amount = watch("amount");

  const addressLimit = watch("trust_data.address_limit");

  const onRefreshReceiptNumber = () => {
    if (trustId && donationModeId) {
      queryClient.invalidateQueries({
        queryKey: cancelReceiptKeys.generateReceiptNumber(
          donationModeId,
          trustId
        ),
      });
    }
  };

  return (
    <FormSection title={t("donation.entry.label")}>
      <Stack direction="column" gap="30px">
        <FormGridLayout columns={5}>
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
            name="focus_on_trust"
            label={t("common.focus.on.trust")}
          />

          <CheckboxWithLabel
            control={control}
            name="last_five_entry"
            label={t("common.show.last.five.entries")}
          />

          <CheckboxWithLabel
            control={control}
            name="copy_to_address"
            label={t("common.copy.address.to.addressBook")}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
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

          <TrustAutocomplete
            loading={loading}
            name="trust_id"
            label={t("trust.label")}
            control={control}
            required
            error={!!errors.trust_id}
            helperText={errorMessages(errors.trust_id?.message)}
          />

          <DonationModeAutocomplete
            loading={loading}
            name="donation_mode_id"
            control={control}
            required
            error={!!errors.donation_mode_id}
            helperText={errorMessages(errors.donation_mode_id?.message)}
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

          <Stack direction="row" gap="10px" alignItems="center">
            <Box flex="0 0 90%">
              <CommonAutocomplete
                freeSolo
                name="contact_no"
                loading={loading}
                disabled={!receiptNo}
                optionsKey={CONTACT_NO}
                control={control}
                module="past-entry"
                required
                label={t("common.contact.label")}
                last_five_days={!!isLastFiveDays}
                error={!!errors.contact_no}
                helperText={errorMessages(errors.contact_no?.message)}
                onKeyDown={(e) => {
                  if (e.key === "Tab" && contactNumber) {
                    onDialogOpen("history");
                  }
                }}
              />
            </Box>

            <Box flex="0 0 10%">
              <PadBox padding={{ paddingTop: "28px" }}>
                <HistoryIconAction
                  disabled={!contactNumber}
                  onClick={() => {
                    onDialogOpen("history");
                    setToggleDonationEntryList(false);
                  }}
                />
              </PadBox>
            </Box>
          </Stack>

          <CommonAutocomplete
            name="first_name"
            loading={loading}
            disabled={!receiptNo}
            optionsKey={FIRST_NAME}
            control={control}
            module="past-entry"
            freeSolo
            required
            label={t("common.first.name")}
            last_five_days={!!isLastFiveDays}
            error={!!errors.first_name}
            helperText={errorMessages(errors.first_name?.message)}
          />

          <CommonAutocomplete
            name="middle_name"
            loading={loading}
            freeSolo
            disabled={!receiptNo}
            optionsKey={MIDDLE_NAME}
            control={control}
            module="past-entry"
            label={t("middleName.label")}
            last_five_days={!!isLastFiveDays}
            error={!!errors.middle_name}
            helperText={errorMessages(errors.middle_name?.message)}
          />

          <CommonAutocomplete
            name="last_name"
            loading={loading}
            optionsKey={LAST_NAME}
            disabled={!receiptNo}
            freeSolo
            control={control}
            module="past-entry"
            label={t("common.last.name")}
            last_five_days={!!isLastFiveDays}
            error={!!errors.last_name}
            helperText={errorMessages(errors.last_name?.message)}
          />

          <Stack direction="row" gap="10px" alignItems="center">
            <Box flex="0 0 10%">
              <PadBox padding={{ paddingTop: "33px" }}>
                <EditIconAction
                  onClick={() => {
                    setValue("show_business_name", !showBusinessName);
                  }}
                />
              </PadBox>
            </Box>

            <Box flex="0 0 90%">
              {showBusinessName && (
                <BusinessNameAutocomplete
                  loading={loading}
                  disabled={!receiptNo}
                  name="business_name"
                  freeSolo
                  control={control}
                  contactNumber={contactNumber}
                  error={!!errors.business_name}
                  helperText={errorMessages(errors.business_name?.message)}
                />
              )}
            </Box>
          </Stack>

          <TextField
            name="name_of_receipt"
            control={control}
            loading={loading}
            disabled={!receiptNo}
            label={t("common.name.of.receipt")}
            required
            setError={setError}
            error={!!errors.name_of_receipt}
            helperText={errorMessages(errors.name_of_receipt?.message)}
          />

          <CommonAutocomplete
            name="city"
            loading={loading}
            disabled={!receiptNo}
            optionsKey={CITY}
            freeSolo
            control={control}
            module="past-entry"
            label={t("common.city")}
            last_five_days={!!isLastFiveDays}
            error={!!errors.city}
            helperText={errorMessages(errors.city?.message)}
          />

          <TextField
            name="pincode"
            control={control}
            disabled={!receiptNo}
            loading={loading}
            label={t("common.pincode")}
            required
            setError={setError}
            error={!!errors.pincode}
            helperText={errorMessages(errors.pincode?.message)}
          />

          <TextField
            name="state"
            control={control}
            loading={loading}
            disabled={!receiptNo}
            label={t("state.label")}
            setError={setError}
            error={!!errors.state}
            helperText={errorMessages(errors.state?.message)}
          />

          <TextField
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
            placeholder={t("aadhar.no.label.placeholder")}
            setError={setError}
            error={!!errors.aadhar_no}
            helperText={errorMessages(errors.aadhar_no?.message)}
          />

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

          <TextField
            control={control}
            label={t("email.label")}
            disabled={!receiptNo}
            name="email_id"
            loading={loading}
            required
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

          <Stack direction="row" gap="10px" alignItems="center">
            <Box flex="0 0 90%">
              <TextField
                type="number"
                control={control}
                disabled={!receiptNo}
                loading={loading}
                label={t("amount.label")}
                required
                name="amount"
                setError={setError}
                error={!!errors.amount}
                helperText={errorMessages(errors.amount?.message)}
              />
            </Box>

            {toggleDonationEntryList && (
              <Box flex="0 0 10%">
                <PadBox padding={{ paddingTop: "28px" }}>
                  <HistoryIconAction
                    disabled={!contactNumber}
                    onClick={() => {
                      onDialogOpen("history");
                      setToggleDonationEntryList(true);
                    }}
                  />
                </PadBox>
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

          <EventAutocomplete
            loading={loading}
            disabled={!receiptNo}
            name="event_type_id"
            label={t("eventType.label")}
            control={control}
            required
            error={!!errors.event_type_id}
            helperText={errorMessages(errors.event_type_id?.message)}
          />

          <DonationModeOfReceiptAutocomplete
            loading={loading}
            disabled={!receiptNo}
            name="mode_of_receipt"
            control={control}
            error={!!errors.mode_of_receipt}
            helperText={errorMessages(errors.mode_of_receipt?.message)}
          />

          <TextField
            name="address"
            control={control}
            disabled={!receiptNo}
            loading={loading}
            label={t("address.label")}
            required={!!amount && !!addressLimit && amount > addressLimit}
            multiline
            rows={4}
            error={!!errors.address}
            helperText={errorMessages(errors.address?.message)}
          />

          <TextField
            name="remarks"
            control={control}
            disabled={!receiptNo}
            loading={loading}
            label={t("remark.label")}
            multiline
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
            rows={4}
            error={!!errors.organize_remark}
            helperText={errorMessages(errors.organize_remark?.message)}
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

          {isReminder && (
            <DatePicker
              name="event_reminder_date"
              label={t("common.event.reminder", {
                label: t("date.label"),
              })}
              required
              control={control}
              loading={loading}
              clearable={false}
              error={!!errors.event_reminder_date}
              helperText={errorMessages(errors.event_reminder_date?.message)}
            />
          )}

          {isReminder && (
            <TextField
              name="event_reminder_note"
              control={control}
              loading={loading}
              label={t("common.event.reminder", {
                label: t("common.note"),
              })}
              multiline
              rows={4}
              error={!!errors.event_reminder_note}
              helperText={errorMessages(errors.event_reminder_note?.message)}
            />
          )}
        </FormGridLayout>
      </Stack>
    </FormSection>
  );
};
