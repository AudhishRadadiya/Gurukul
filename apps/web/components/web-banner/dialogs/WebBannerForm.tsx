import {
  FormContainer,
  FormGridLayout,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { EventAutocomplete } from "@web/components/common/Autocomplete/EventAutocomplete";
import { WebBannerSlotFields } from "@web/components/web-banner/dialogs/WebBannerSlotFields";
import type { WebBannerSlot } from "@web/components/web-banner/WebBannerList/dialogs/hooks/useGetWebBannerDetails";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages } from "@web/utils/helper";

const MAX_SLOTS = 3;

const WebBannerImageSchema = z.object({
  image_height: z.number().nullable(),
  image_id: z.string().uuid().optional(),
  image_url: z
    .string()
    .url("common.url.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  image_width: z.number().nullable(),
  sequence_no: z.number().int().min(1).nullable().optional(),
  slot_id: z.string().uuid().optional(),
});

const WebBannerSlotSchema = z.object({
  images: z
    .array(WebBannerImageSchema)
    .min(1, "At least one image is required"),
  is_slider: z.boolean().default(false),
  position: z
    .number()
    .int()
    .min(1)
    .max(3)
    .nullable()
    .refine((value) => value !== null, {
      message: "common.required",
    }),
  slot_id: z.string().uuid().optional(),
});

const WebBannerFormSchema = z
  .object({
    event_master_id: z.array(z.string().uuid()).default([]),
    identity_name: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    is_active: z.boolean().default(true),
    is_deleted: z.boolean().default(false),
    is_home: z.boolean().default(false),
    slots: z
      .array(WebBannerSlotSchema)
      .min(MAX_SLOTS, `At least ${MAX_SLOTS} slots are required`)
      .max(MAX_SLOTS, `No more than ${MAX_SLOTS} slots are allowed`),
  })
  .superRefine((data, ctx) => {
    const positions = data.slots
      .map((slot) => slot.position)
      .filter((value): value is number => typeof value === "number");

    if (new Set(positions).size !== positions.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Duplicate slot positions are not allowed",
        path: ["slots"],
      });
    }

    const requiredPositions = Array.from(
      { length: MAX_SLOTS },
      (_, index) => index + 1
    );

    const hasAllPositions = requiredPositions.every((position) =>
      positions.includes(position)
    );

    if (!hasAllPositions) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Slots must include positions ${requiredPositions.join(", ")}`,
        path: ["slots"],
      });
    }

    data.slots.forEach((slot, index) => {
      if (slot.is_slider) {
        if (slot.images.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Slider slots must have at least 2 images",
            path: ["slots", index, "images"],
          });
        }

        slot.images.forEach((image, imageIndex) => {
          const seq = Number(image.sequence_no);

          slot.images.forEach((otherImage, otherImageIndex) => {
            if (imageIndex === otherImageIndex) {
              return;
            }

            const otherSeq = Number(otherImage.sequence_no);

            if (seq === otherSeq) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Sequence number must be unique.",
                path: ["slots", index, "images", imageIndex, "sequence_no"],
              });
            }
          });
        });
      } else if (slot.images.length !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Non-slider slots must have exactly 1 image",
          path: ["slots", index, "images"],
        });
      }
    });
  });

export type WebBannerFormFieldValues = z.infer<typeof WebBannerFormSchema>;

export type WebBannerPayload = {
  event_master_id?: string[];
  identity_name: string;
  is_active: boolean;
  is_deleted: boolean;
  is_home: boolean;
  slots: WebBannerSlot[];
};

type WebBannerFormProps = {
  defaultValues?: WebBannerFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<WebBannerFormFieldValues>;
  submitForm: (onSubmit: (formValues: WebBannerPayload) => void) => void;
};

const createImageDefaults = (
  count: number,
  image_width: number,
  image_height: number
) => {
  return Array.from({ length: count }, (_, index) => ({
    image_height,
    image_id: undefined,
    image_url: null,
    image_width,
    sequence_no: index + 1,
    slot_id: undefined,
  }));
};

const createSlotDefaults = (
  isSlider: boolean,
  imageCount: number,
  position: number,
  image_width: number,
  image_height: number
) => ({
  images: createImageDefaults(imageCount, image_width, image_height),
  is_slider: isSlider,
  position,
});

export const formDefaultValues: WebBannerFormFieldValues = {
  event_master_id: [],
  identity_name: null,
  is_active: true,
  is_deleted: false,
  is_home: false,
  slots: [
    createSlotDefaults(true, 3, 1, 684, 277),
    createSlotDefaults(false, 1, 2, 436, 222),
    createSlotDefaults(false, 1, 3, 235, 222),
  ],
};

export const buildWebBannerPayload = (
  formValues: WebBannerFormFieldValues
): WebBannerPayload => {
  const orderedSlots = formValues.slots.map((slot) => ({
    ...slot,
    images: slot.images?.map((image, index) => ({
      ...image,
      image_height: image.image_height ?? 0,
      image_url: image.image_url ?? "",
      image_width: image.image_width ?? 0,
      sequence_no: image.sequence_no ?? index + 1,
    })),
  }));

  return {
    ...formValues,
    identity_name: formValues.identity_name ?? "",
    slots: orderedSlots,
  };
};

export const WebBannerForm = forwardRef(
  (
    { defaultValues = formDefaultValues, loading = false }: WebBannerFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const {
      control,
      formState: { errors },
      getValues,
      handleSubmit,
      setError,
    } = useForm({
      mode: "all",
      resolver: zodResolver(WebBannerFormSchema),
      values: defaultValues,
    });

    const { fields } = useFieldArray({
      control,
      name: "slots",
    });

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      setError,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          onSubmit(buildWebBannerPayload(formValues));
        })();
      },
    }));

    const slotsErrorMessage = errors.slots?.message;

    return (
      <Stack gap="15px">
        <FormContainer>
          <FormGridLayout columns={2}>
            <TextField
              control={control}
              name="identity_name"
              label="Identity Name"
              required
              error={!!errors.identity_name}
              helperText={errorMessages(errors.identity_name?.message)}
              loading={loading}
            />

            <EventAutocomplete
              multiple
              isUserWise
              loading={loading}
              control={control}
              name="event_master_id"
            />

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
              loading={loading}
            />

            <RadioGroupField
              name="is_home"
              control={control}
              label={t("isHome.label")}
              disabled
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
              loading={loading}
            />
          </FormGridLayout>

          <Stack gap="15px">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight={600}>Slots</Typography>
            </Stack>

            {slotsErrorMessage && (
              <Typography color="error">
                {errorMessages(slotsErrorMessage) ?? slotsErrorMessage}
              </Typography>
            )}

            {fields.map((slot, index) => (
              <Accordion
                key={slot.id}
                defaultExpanded={index === 0}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "5px",
                  p: "10px",
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Stack>
                    <Typography fontWeight={600}>
                      {"Slot " + (index + 1)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {"Position: " +
                        (getValues(`slots.${index}.position`) ?? index + 1)}
                    </Typography>
                  </Stack>
                </AccordionSummary>

                <AccordionDetails>
                  <WebBannerSlotFields
                    index={index}
                    control={control}
                    loading={loading}
                    errors={errors.slots}
                  />
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </FormContainer>
      </Stack>
    );
  }
);

WebBannerForm.displayName = "WebBannerForm";
