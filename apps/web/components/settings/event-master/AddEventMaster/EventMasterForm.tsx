import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  Button,
  CheckBox,
  ContentBox,
  DateTimePicker,
  FormSection,
  GridProvider,
  PadBox,
  RadioGroupField,
  TextField,
  toasts,
  Tooltip,
  useDialogActions,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add, ContentCopy } from "@mui/icons-material";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import XIcon from "@mui/icons-material/X";
import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import _isArray from "lodash/isArray";
import _isEmpty from "lodash/isEmpty";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import { useQueryState } from "nuqs";
import type { ForwardedRef } from "react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { ADD_EVENT_MASTER } from "@web/app/settings/event-master/hooks/constant";
import { AllowedFieldsAutocomplete } from "@web/components/common/Autocomplete/AllowedFieldsAutocomplete";
import { BranchAutocomplete } from "@web/components/common/Autocomplete/BranchAutocomplete";
import { DonationAutocomplete } from "@web/components/common/Autocomplete/DonationAutocomplete";
import { EventContactDetailNameAutocomplete } from "@web/components/common/Autocomplete/EventContactDetailNameAutocomplete";
import { ALLOWED_FIELD_VALUES } from "@web/components/common/Autocomplete/hooks/useGetAllowedFieldsOptions";
import { TrustAutocompleteFromMultipleBranch } from "@web/components/common/Autocomplete/TrustAutocompleteFromMultipleBranch";
import { UserAutocomplete } from "@web/components/common/Autocomplete/UserAutocomplete";
import { ImageUploadField } from "@web/components/common/ImageUploadField";
import { SlugTextField } from "@web/components/common/PanCardTextField/SlugTextField";
import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { SocialLinkPopover } from "@web/components/common/SocialLinkPopover";
import { TextEditor } from "@web/components/common/TextEditor/TextEditor";
import { AddEventDropdownDialog } from "@web/components/settings/event-master/AddEventMaster/EventDropdown/Dialog/AddEventDropdownDialog";
import { EventDropdownFormSchema } from "@web/components/settings/event-master/AddEventMaster/EventDropdown/Dialog/EventDropdownForm";
import { EventDropdownList } from "@web/components/settings/event-master/AddEventMaster/EventDropdown/EventDropdownList/EventDropdownList";
import { AddEventItemDialog } from "@web/components/settings/event-master/AddEventMaster/EventItem/Dialog/AddEventItemDialog";
import { EventItemFormSchema } from "@web/components/settings/event-master/AddEventMaster/EventItem/Dialog/EventItemForm";
import { EventItemList } from "@web/components/settings/event-master/AddEventMaster/EventItem/EventItemList/EventItemList";
import type { LinksType } from "@web/components/settings/event-master/EventMasterList/hooks/useGetActiveEventMaster";
import { EVENT_MASTER_PERMISSION } from "@web/constants/permission/settings/eventMaster/permission";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import {
  errorMessages,
  filterNestedChangedFormFields,
  handleCopyToClipboard,
} from "@web/utils/helper";

const EventMasterFormSchema = z
  .object({
    allowed_fields: z.array(z.enum(ALLOWED_FIELD_VALUES)).default([]),
    alternative_branch_name: z.string().nullable().optional(),
    branch_id: z
      .array(z.string())
      .min(1, { message: "common.required" })
      .default([]),
    description: z.string().max(255, "common.maxLength").nullable().optional(),
    donation_master_id: z.string().nullable(),
    end_date: z.string().nullable(),
    event_contact_detail_id: z.string().nullable().optional(),
    event_dropdown: z.array(EventDropdownFormSchema).nullable().optional(),
    event_items: z.array(EventItemFormSchema).nullable().optional(),
    event_master_name: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    facebook_link: z
      .string()
      .trim()
      .optional()
      .nullable()
      .refine((value) => !value || z.string().url().safeParse(value).success, {
        message: "common.invalid_url",
      }),
    image: z.string().nullable().optional(),
    is_active: z.boolean(),
    is_lifetime: z.boolean(),
    is_multiple: z.boolean(),
    is_need_redirect: z.boolean(),
    is_need_reminder: z.boolean(),
    is_online: z.coerce.boolean(),
    is_quick_donation: z.boolean(),
    is_send_sms: z.boolean(),
    is_send_whatsapp: z.boolean(),
    is_visible_web: z.boolean(),
    location: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    meta_desc: z.string().max(255, "common.maxLength").nullable(),
    meta_keywords: z.string().nullable(),
    meta_title: z.string().nullable(),
    permitted_users: z.array(z.string().nullable()).default([]),
    reminder_message: z.string().nullable().optional(),
    slug_name: z.string().nullable(),
    start_date: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    terms_and_conditions: z.string().nullable().optional(),
    trust_id: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => {
        if (typeof val === "string") {
          return [val];
        }

        return val;
      })
      .refine((val) => Array.isArray(val) && val.length > 0, {
        message: "common.required",
      })
      .default([]),
    twitter_link: z
      .string()
      .trim()
      .optional()
      .nullable()
      .refine((value) => !value || z.string().url().safeParse(value).success, {
        message: "common.invalid_url",
      }),
    web_description: z.string().nullable().optional(),
    whatsapp_group_description: z.string().nullable().optional(),
    whatsapp_group_redirect_link: z
      .string()
      .trim()
      .optional()
      .nullable()
      .refine((value) => !value || z.string().url().safeParse(value).success, {
        message: "common.invalid_url",
      }),
    whatsapp_link: z
      .string()
      .trim()
      .optional()
      .nullable()
      .refine((value) => !value || z.string().url().safeParse(value).success, {
        message: "common.invalid_url",
      }),
  })
  // eslint-disable-next-line sonarjs/cognitive-complexity
  .superRefine((values, ctx) => {
    if (values.is_online) {
      if (!values.meta_title) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["meta_title"],
        });
      }

      if (!values.meta_desc) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["meta_desc"],
        });
      }

      if (!values.meta_keywords) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["meta_keywords"],
        });
      }

      if (!values.donation_master_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("common.required"),
          path: ["donation_master_id"],
        });
      }
    }

    if (!!values.is_online && !values.slug_name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("common.required"),
        path: ["slug_name"],
      });
    }

    if (!values.is_lifetime && !values.end_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("common.required"),
        path: ["end_date"],
      });
    }

    let trustIdArray: string[] = [];

    if (_isArray(values.trust_id)) {
      trustIdArray = values.trust_id;
    } else if (values.trust_id) {
      trustIdArray = [values.trust_id];
    }

    if (values.is_online && trustIdArray.length > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("event.master.trust.one"),
        path: ["trust_id"],
      });
    }

    if (
      values.is_online &&
      !!values.whatsapp_group_redirect_link &&
      !values.whatsapp_group_description
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["whatsapp_group_description"],
      });
    }
  });

export type EventMasterFormFieldValues = z.infer<typeof EventMasterFormSchema>;

type EventMasterFormProps = {
  defaultValues?: EventMasterFormFieldValues;
  isOnlineValue?: boolean;
  links?: LinksType[];
  loading?: boolean;
  trustValue?: string | string[];
};

export type FormRef = {
  setError: UseFormSetError<EventMasterFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<EventMasterFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: EventMasterFormFieldValues = {
  allowed_fields: [...ALLOWED_FIELD_VALUES],
  alternative_branch_name: null,
  branch_id: [],
  description: null,
  donation_master_id: null,
  end_date: null,
  event_contact_detail_id: null,
  event_dropdown: [],
  event_items: [],
  event_master_name: null,
  facebook_link: "",
  image: null,
  is_active: true,
  is_lifetime: false,
  is_multiple: true,
  is_need_redirect: false,
  is_need_reminder: true,
  is_online: false,
  is_quick_donation: true,
  is_send_sms: true,
  is_send_whatsapp: true,
  is_visible_web: true,
  location: null,
  meta_desc: null,
  meta_keywords: null,
  meta_title: null,
  permitted_users: [],
  reminder_message: null,
  slug_name: null,
  start_date: null,
  terms_and_conditions: null,
  trust_id: [],
  twitter_link: "",
  web_description: null,
  whatsapp_group_description: null,
  whatsapp_group_redirect_link: null,
  whatsapp_link: "",
};

const sanitizeItemsByActionKey = <
  T extends { is_old?: boolean },
  K extends keyof T,
>(
  items: T[] | null | undefined,
  idKey: K
): T[] => {
  if (!items || items.length === 0) {
    return [];
  }

  return items.map((item) => {
    if (item.is_old) {
      return item;
    }

    return { ...item, [idKey]: undefined };
  });
};

export const EventMasterForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      isOnlineValue,
      links = [],
      loading = false,
      trustValue = [],
    }: EventMasterFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { isMobile } = useGetDeviceType();

    const theme = useTheme();

    const { data: session } = useSession();

    const { butterflyBlue } = theme.palette.app.color;

    const { user_type } = session?.user ?? {};

    const [page] = useQueryState("page");

    const { validateAccess } = useUserPermissions();

    const canAccessEventMaster =
      user_type === "admin" ||
      Object.values(EVENT_MASTER_PERMISSION).every((permission) =>
        validateAccess(permission)
      );

    const isAddEventMaster = page === ADD_EVENT_MASTER;

    const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

    const [showSocialMediaIcon, setShowSocialMediaIcon] = useState(false);

    const methods = useForm({
      mode: "all",
      resolver: zodResolver(EventMasterFormSchema),
      values: defaultValues,
    });

    const {
      clearErrors,
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      resetField,
      setError,
      setValue,
      watch,
    } = methods;

    const startDate = watch("start_date") ?? "";

    const branchIds = watch("branch_id");

    const isLifetime = watch("is_lifetime");

    const isOnline = watch("is_online");

    const isNeedReminder = watch("is_need_reminder");

    const isQuickDonation = watch("is_quick_donation");

    const whatsappGroupRedirectLink = watch("whatsapp_group_redirect_link");

    const eventDropdowns = watch("event_dropdown") ?? [];

    const eventItems = watch("event_items") ?? [];

    const trustIdValue = watch("trust_id");

    useMemo(() => {
      if (isOnlineValue === isOnline) {
        setValue("trust_id", trustValue as string[], {
          shouldDirty: true,
        });
      }
    }, [isOnline, isOnlineValue, trustValue, setValue]);

    // Transform trust_id from array to string when is_online is true (for edit mode)
    useMemo(() => {
      if (
        !loading &&
        isOnline &&
        _isArray(trustIdValue) &&
        trustIdValue.length > 0 &&
        typeof trustIdValue[0] === "string" &&
        !dirtyFields.trust_id
      ) {
        // Convert array to string for single selection mode when editing
        // Type assertion needed because schema accepts union but transform returns array
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setValue("trust_id", trustIdValue[0] as any, {
          shouldDirty: false,
        });
      }
    }, [loading, isOnline, trustIdValue, dirtyFields.trust_id, setValue]);

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      setError,

      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          // Transform trust_id to always be an array
          let transformedTrustId: string[] = [];

          if (_isArray(formValues.trust_id)) {
            transformedTrustId = formValues.trust_id;
          } else if (formValues.trust_id) {
            transformedTrustId = [formValues.trust_id];
          }

          const transformedFormValues = {
            ...formValues,
            trust_id: transformedTrustId,
          };

          const filterFormValues = filterNestedChangedFormFields(
            transformedFormValues,
            {
              ...dirtyFields,
              event_dropdown: true,
              event_items: true,
              is_online: defaultValues.is_online ? dirtyFields.is_online : true,
              is_quick_donation: true,
              is_send_whatsapp: true,
            }
          );

          const sanitizeItemsByActionKeyFormValues = {
            ...filterFormValues,
            ...(isOnline &&
              isQuickDonation && {
                allowed_fields: formValues.allowed_fields,
              }),
            event_dropdown: sanitizeItemsByActionKey(
              formValues.event_dropdown,
              "event_dropdown_id"
            ),
            event_items: sanitizeItemsByActionKey(
              formValues.event_items,
              "event_item_id"
            ),
            trust_id: transformedTrustId,
          };

          onSubmit(sanitizeItemsByActionKeyFormValues);
        })();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      add: (
        <AddEventItemDialog
          open
          onClose={onDialogClose}
          onAdd={(formValues) => {
            const eventDropdownAndItems = [...eventDropdowns, ...eventItems];

            const isDuplicateSequence = eventDropdownAndItems.some(
              (event) => event.sequence === formValues.sequence
            );

            if (isDuplicateSequence) {
              toasts.warning({ title: t("common.unique.sequence.message") });

              return;
            }

            setValue("event_items", [...eventItems, formValues], {
              shouldDirty: true,
            });

            onDialogClose();
          }}
        />
      ),
      addEventDropdown: (
        <AddEventDropdownDialog
          open
          onClose={onDialogClose}
          onAdd={(formValues) => {
            const eventDropdownAndItems = [...eventItems, ...eventDropdowns];

            const isDuplicateSequence = eventDropdownAndItems.some(
              (event) => event.sequence === formValues.sequence
            );

            if (isDuplicateSequence) {
              toasts.warning({ title: t("common.unique.sequence.message") });

              return;
            }

            setValue("event_dropdown", [...eventDropdowns, formValues], {
              shouldDirty: true,
            });

            onDialogClose();
          }}
        />
      ),
    };

    const {
      branch_id,
      description,
      donation_master_id,
      end_date,
      event_master_name,
      location,
      slug_name,
      start_date,
      trust_id,
    } = errors;

    // Convert trust_id between string and array based on is_online
    useMemo(() => {
      if (dirtyFields.is_online || dirtyFields.trust_id) {
        const currentTrustId = trustIdValue;

        if (isOnline) {
          // When is_online is true, convert array to string if needed
          if (_isArray(currentTrustId) && currentTrustId.length > 0) {
            // Convert array to string for single selection mode
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setValue("trust_id", currentTrustId[0] as any, {
              shouldDirty: true,
            });
          }
        } else {
          // When is_online is false, ensure it's an array
          if (typeof currentTrustId === "string") {
            setValue("trust_id", [currentTrustId], { shouldDirty: true });

            return;
          }

          if (!_isArray(currentTrustId)) {
            setValue("trust_id", [], { shouldDirty: true });
          }
        }
      }
    }, [
      isOnline,
      trustIdValue,
      dirtyFields.is_online,
      dirtyFields.trust_id,
      setValue,
    ]);

    useMemo(() => {
      if (dirtyFields.is_lifetime) {
        resetField("end_date", {
          defaultValue: formDefaultValues.end_date,
        });
      }
    }, [isLifetime]);

    useMemo(() => {
      if (dirtyFields.branch_id) {
        resetField("trust_id", {
          defaultValue: formDefaultValues.trust_id,
        });
      }
    }, [branchIds]);

    useEffect(() => {
      if (isAddEventMaster) {
        setValue("trust_id", [], {
          shouldDirty: true,
        });
      }
    }, [isOnline]);

    useMemo(() => {
      if (!isOnline) {
        clearErrors([
          "meta_title",
          "meta_desc",
          "meta_keywords",
          "whatsapp_group_redirect_link",
          "whatsapp_group_description",
          "donation_master_id",
        ]);
      }
    }, [isOnline]);

    const onClickSocialMediaIcons = () => {
      setShowSocialMediaIcon(!showSocialMediaIcon);

      setValue("whatsapp_link", null, { shouldDirty: true });

      setValue("twitter_link", null, { shouldDirty: true });

      setValue("facebook_link", null, { shouldDirty: true });
    };

    const onLinkCopyAndRedirect = (link: string) => {
      handleCopyToClipboard(link);

      window.open(link, "_blank");
    };

    return (
      <Stack>
        <FormProvider {...methods}>
          <FormSection title={t("common.event.master")}>
            <GridProvider gap="15px" columns={7}>
              <RadioGroupField
                name="is_send_sms"
                control={control}
                loading={loading}
                label={t("isSendSMS.label")}
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
                name="is_send_whatsapp"
                control={control}
                loading={loading}
                label={t("common.isSendWhatsApp.label")}
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
                name="is_need_reminder"
                control={control}
                loading={loading}
                label={t("isNeedReminder.label")}
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
                name="is_active"
                control={control}
                loading={loading}
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
                name="is_online"
                control={control}
                loading={loading}
                label={t("isOnline.label")}
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
                name="is_multiple"
                control={control}
                loading={loading}
                label={t("isMultiple.label")}
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
                name="is_visible_web"
                control={control}
                loading={loading}
                label={t("isVisibleWeb.label")}
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
            </GridProvider>

            <GridProvider gap="15px" columns={4}>
              <TextField
                control={control}
                label={t("common.name.label", {
                  label: t("common.master.label", {
                    label: t("common.event.label"),
                  }),
                })}
                name="event_master_name"
                loading={loading}
                required
                error={!!event_master_name}
                helperText={errorMessages(event_master_name?.message)}
              />

              <TextField
                name="location"
                control={control}
                loading={loading}
                label={t("location.label")}
                required
                error={!!location}
                helperText={errorMessages(location?.message)}
              />

              <BranchAutocomplete
                isUserWise
                loading={loading}
                name="branch_id"
                control={control}
                multiple
                required
                error={!!branch_id}
                helperText={errorMessages(branch_id?.message)}
              />

              <TrustAutocompleteFromMultipleBranch
                branchIds={branchIds}
                loading={loading}
                name="trust_id"
                required
                label={t("trust.label")}
                control={control}
                multiple={!isOnline}
                disabled={!branchIds.length}
                error={!!trust_id}
                helperText={errorMessages(trust_id?.message)}
              />

              <DonationAutocomplete
                loading={loading}
                name="donation_master_id"
                control={control}
                required={isOnline ?? false}
                error={!!donation_master_id}
                helperText={errorMessages(donation_master_id?.message)}
              />

              <SlugTextField
                control={control}
                label={t("event.slug")}
                name="slug_name"
                required={isOnline}
                loading={loading}
                error={!!slug_name}
                helperText={errorMessages(slug_name?.message)}
              />

              <DateTimePicker
                control={control}
                label={t("startDate.label")}
                name="start_date"
                loading={loading}
                required
                ampm={true}
                format="dd-MM-yyyy hh:mm a"
                clearable={false}
                error={!!start_date}
                helperText={errorMessages(start_date?.message)}
              />

              <DateTimePicker
                name="end_date"
                label={t("endDate.label")}
                control={control}
                loading={loading}
                required={!isLifetime}
                minDate={
                  startDate ? DateTime.fromISO(startDate) : DateTime.now()
                }
                clearable={false}
                disabled={!startDate}
                error={!!end_date}
                ampm={true}
                format="dd-MM-yyyy hh:mm a"
                closeOnSelect={false}
                helperText={errorMessages(end_date?.message)}
              />
            </GridProvider>

            <Box display="flex" gap="10px">
              <CheckBox control={control} name="is_lifetime" size="small" />
              <Typography>{t("common.is.lifetime")}</Typography>
            </Box>

            <GridProvider gap="15px" columns={3}>
              <EventContactDetailNameAutocomplete
                control={control}
                loading={loading}
                name="event_contact_detail_id"
                error={!!errors.event_contact_detail_id}
                helperText={errorMessages(
                  errors.event_contact_detail_id?.message
                )}
              />

              <TextField
                name="alternative_branch_name"
                control={control}
                loading={loading}
                label={t("common.alternative.branch.name.label")}
                letterCase="mixed"
                characterType="any-character"
                error={!!errors.alternative_branch_name}
                helperText={errorMessages(
                  errors.alternative_branch_name?.message
                )}
              />

              {canAccessEventMaster && (
                <UserAutocomplete
                  multiple
                  control={control}
                  label="Permitted Users"
                  placeholder="Permitted Users"
                  name="permitted_users"
                  loading={loading}
                />
              )}
            </GridProvider>

            <GridProvider gap="15px" columns={3}>
              <TextField
                name="meta_title"
                control={control}
                loading={loading}
                label="Meta Title"
                letterCase="mixed"
                required={isOnline}
                error={!!errors.meta_title}
                helperText={errorMessages(errors.meta_title?.message)}
              />

              <TextField
                name="meta_desc"
                control={control}
                loading={loading}
                label="Meta Description"
                multiline
                required={isOnline}
                letterCase="mixed"
                rows={4}
                error={!!errors.meta_desc}
                helperText={errorMessages(errors.meta_desc?.message)}
              />

              <TextField
                name="meta_keywords"
                control={control}
                loading={loading}
                required={isOnline}
                label="Meta Keywords"
                letterCase="mixed"
                error={!!errors.meta_keywords}
                helperText={errorMessages(errors.meta_keywords?.message)}
              />

              {isOnline && (
                <>
                  <TextField
                    name="whatsapp_group_redirect_link"
                    control={control}
                    loading={loading}
                    label={t("common.whatsappGroupLink.label")}
                    letterCase="mixed"
                    error={!!errors.whatsapp_group_redirect_link}
                    helperText={errorMessages(
                      errors.whatsapp_group_redirect_link?.message
                    )}
                  />

                  <TextField
                    name="whatsapp_group_description"
                    control={control}
                    loading={loading}
                    label={t("common.whatsappLinkDescription.label")}
                    letterCase="mixed"
                    multiline
                    characterType="any-character"
                    required={!!whatsappGroupRedirectLink}
                    error={!!errors.whatsapp_group_description}
                    helperText={errorMessages(
                      errors.whatsapp_group_description?.message
                    )}
                  />

                  <RadioGroupField
                    name="is_need_redirect"
                    control={control}
                    loading={loading}
                    isHorizontal
                    label={t("common.needRedirect.label")}
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
                </>
              )}

              <TextField
                name="description"
                label={t("description.label")}
                loading={loading}
                control={control}
                multiline
                letterCase="mixed"
                characterType="any-character"
                error={!!description}
                helperText={errorMessages(description?.message)}
              />

              {isOnline && (
                <>
                  {isQuickDonation && (
                    <AllowedFieldsAutocomplete
                      name="allowed_fields"
                      control={control}
                      loading={loading}
                      multiple
                      limitTags={3}
                      label={t("common.allowed.fields.label")}
                    />
                  )}

                  <RadioGroupField
                    name="is_quick_donation"
                    control={control}
                    isHorizontal
                    loading={loading}
                    label={t("common.is.quick.donation")}
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
                </>
              )}

              {isNeedReminder && (
                <TextField
                  name="reminder_message"
                  label="Reminder Message"
                  loading={loading}
                  control={control}
                  multiline
                  letterCase="mixed"
                  characterType="any-character"
                />
              )}
            </GridProvider>

            {!_isEmpty(links) && !!isOnlineValue && (
              <>
                <Typography variant="h6" fontWeight={600}>
                  {t("common.website.links.label")}
                </Typography>

                <ContentBox>
                  <PadBox padding={{ padding: "15px" }}>
                    <GridProvider
                      columnGap="30px"
                      rowGap="10px"
                      columns={1}
                      columnsOnMobile={1}
                      columnsOnSmallDevice={1}
                      columnsOnTablet={1}
                    >
                      {links.map((item: LinksType) => {
                        const { branch_name, link, quick_link } = item;

                        const path = new URL(link).pathname.slice(1);

                        const quickLinkPath = quick_link
                          ? new URL(quick_link).pathname.slice(1)
                          : "";

                        return (
                          <Stack
                            direction="row"
                            gap={2}
                            key={`${branch_name}-${link}`}
                          >
                            <Typography variant="body2">
                              {branch_name}
                            </Typography>

                            <Tooltip toolTipLabel={link}>
                              <Typography
                                variant="body2"
                                onClick={() => {
                                  onLinkCopyAndRedirect(link);
                                }}
                                sx={{
                                  "&:hover": {
                                    textDecoration: "underline",
                                  },
                                  color: butterflyBlue[50],
                                  cursor: "pointer",
                                }}
                              >
                                {path}
                              </Typography>
                            </Tooltip>

                            <ContentCopy
                              fontSize="small"
                              sx={{
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                handleCopyToClipboard(link);

                                toasts.success({
                                  title: t(
                                    "common.copied.to.clipboard.message"
                                  ),
                                });
                              }}
                            />

                            {quick_link && (
                              <>
                                <Tooltip toolTipLabel={quick_link}>
                                  <Typography
                                    variant="body2"
                                    onClick={() => {
                                      onLinkCopyAndRedirect(quick_link);
                                    }}
                                    sx={{
                                      "&:hover": {
                                        textDecoration: "underline",
                                      },
                                      color: butterflyBlue[50],
                                      cursor: "pointer",
                                    }}
                                  >
                                    {quickLinkPath}
                                  </Typography>
                                </Tooltip>

                                <ContentCopy
                                  fontSize="small"
                                  sx={{
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    handleCopyToClipboard(quick_link);

                                    toasts.success({
                                      title: t(
                                        "common.copied.to.clipboard.quick.link.message"
                                      ),
                                    });
                                  }}
                                />
                              </>
                            )}
                          </Stack>
                        );
                      })}
                    </GridProvider>
                  </PadBox>
                </ContentBox>
              </>
            )}

            {isOnline && (
              <PadBox padding={{ padding: "10px 0px" }}>
                <Stack gap="10px">
                  <Typography
                    fontWeight={600}
                    variant="h6"
                    paddingBottom="10px"
                  >
                    {t("common.event.configuration")}
                  </Typography>

                  <GridProvider
                    gap="15px"
                    columns={2}
                    columnsOnMobile={1}
                    columnsOnSmallDevice={1}
                    columnsOnTablet={1}
                  >
                    <TextField
                      name="terms_and_conditions"
                      label="Terms & Conditions"
                      loading={loading}
                      control={control}
                      multiline
                      maxRows={2}
                      minRows={2}
                      letterCase="mixed"
                      characterType="any-character"
                    />

                    {!showSocialMediaIcon && (
                      <Box display="flex" gap="10px">
                        <Button
                          startIcon={<Add />}
                          variant="text"
                          onClick={() => {
                            setShowSocialMediaIcon(!showSocialMediaIcon);
                          }}
                        >
                          Add Social media share icons
                        </Button>
                      </Box>
                    )}

                    {showSocialMediaIcon && (
                      <Box
                        display="flex"
                        gap="10px"
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <Typography variant="subtitle2" fontWeight="bold">
                          Share this on:
                        </Typography>

                        <SocialLinkPopover
                          icon={<WhatsAppIcon sx={{ height: 25, width: 25 }} />}
                          label="WhatsApp"
                          name="whatsapp_link"
                          control={control}
                          setValue={setValue}
                          errors={errors}
                        />

                        <SocialLinkPopover
                          icon={<XIcon sx={{ height: 25, width: 25 }} />}
                          label="Twitter"
                          name="twitter_link"
                          control={control}
                          setValue={setValue}
                          errors={errors}
                        />

                        <SocialLinkPopover
                          icon={<FacebookIcon sx={{ height: 28, width: 28 }} />}
                          label="Facebook"
                          name="facebook_link"
                          control={control}
                          setValue={setValue}
                          errors={errors}
                        />

                        <Button
                          variant="text"
                          onClick={onClickSocialMediaIcons}
                        >
                          Remove
                        </Button>
                      </Box>
                    )}
                  </GridProvider>

                  <Stack
                    direction={{ md: "row", xs: "column" }}
                    gap={{ md: 0, xs: "16px" }}
                    width="100%"
                    sx={{
                      marginTop: { md: 0, xs: "12px" },
                      minWidth: 0,
                    }}
                  >
                    <Stack
                      gap="10px"
                      sx={{
                        flexShrink: 0,
                        maxWidth: { md: "120px", xs: "100%" },
                        minWidth: 0,
                        width: { md: "10%", xs: "100%" },
                      }}
                    >
                      <Typography variant="subtitle2">Upload Image</Typography>

                      <ImageUploadField
                        control={control}
                        name="image"
                        loading={loading}
                        label=""
                        subTitle=""
                      />
                    </Stack>

                    <Divider
                      orientation={isMobile ? "horizontal" : "vertical"}
                      flexItem
                      sx={{
                        marginBottom: { md: 0, xs: 0 },
                        marginRight: { md: "20px", xs: 0 },
                      }}
                    />

                    <Stack
                      sx={{
                        flex: 1,
                        maxWidth: { md: "90%", xs: "100%" },
                        minWidth: 0,
                        width: { md: "90%", xs: "100%" },
                      }}
                    >
                      <TextEditor
                        name="web_description"
                        control={control}
                        loading={loading}
                        label={t("web.description.label")}
                        height="auto"
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </PadBox>
            )}
          </FormSection>
        </FormProvider>

        <Stack gap={1} paddingTop="15px">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={1}
          >
            <Typography
              variant="subtitle1"
              fontSize={isMobile ? "16px" : "18px"}
              fontWeight={600}
            >
              {t("common.form.options.label")}
            </Typography>

            <ButtonLayoutProvider
              variant="outlined"
              disabled={loading}
              onClick={() => {
                onDialogOpen("addEventDropdown");
              }}
              label={t("common.button.add", {
                label: t("common.form.options.label"),
              })}
            />
          </Stack>

          {!_isEmpty(eventDropdowns) && (
            <EventDropdownList
              loading={loading}
              setValue={setValue}
              eventItemsFormValues={eventItems}
              eventDropdownFormValues={eventDropdowns}
            />
          )}
        </Stack>

        <Stack
          gap={1}
          marginTop={{ md: "24px", xs: "24px" }}
          paddingBottom={{ md: "24px", xs: "20px" }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={1}
          >
            <Typography
              variant="subtitle1"
              fontSize={isMobile ? "16px" : "18px"}
              fontWeight={600}
            >
              {t("common.item.amount.label")}
            </Typography>

            <ButtonLayoutProvider
              variant="outlined"
              disabled={loading}
              onClick={() => {
                onDialogOpen("add");
              }}
              label={t("common.button.add", {
                label: t("common.item.amount.label"),
              })}
            />
          </Stack>

          {!_isEmpty(eventItems) && (
            <EventItemList
              loading={loading}
              setValue={setValue}
              eventItemFormValues={eventItems}
              eventDropdownFormValues={eventDropdowns}
            />
          )}
        </Stack>

        {openedDialog && dialogRenderer[openedDialog]}
      </Stack>
    );
  }
);

EventMasterForm.displayName = "EventMasterForm";
