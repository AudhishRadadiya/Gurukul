import {
  FormGridLayout,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { DeleteOutlined, ImageOutlined } from "@mui/icons-material";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import type { Control, FieldErrors } from "react-hook-form";
import { useFieldArray, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import type { WebBannerFormFieldValues } from "@web/components/web-banner/dialogs/WebBannerForm";
import { WebBannerImageUploadField } from "@web/components/web-banner/dialogs/WebBannerImageUploadField";
import { errorMessages } from "@web/utils/helper";

export type WebBannerSlotFieldsProps = {
  control: Control<WebBannerFormFieldValues>;
  errors: FieldErrors<WebBannerFormFieldValues>["slots"];
  index: number;
  loading: boolean;
};

export const WebBannerSlotFields = ({
  control,
  errors,
  index,
  loading,
}: WebBannerSlotFieldsProps) => {
  const { t } = useTranslation();

  const { append, fields, remove } = useFieldArray({
    control,
    name: `slots.${index}.images`,
  });

  const isSlider = useWatch({
    control,
    name: `slots.${index}.is_slider`,
  });

  const slotErrors = errors?.[index];

  const handleAddImage = () => {
    if (!isSlider) {
      return;
    }

    append({
      image_height: 0,
      image_url: null,
      image_width: 0,
      sequence_no: fields.length + 1,
    });
  };

  useEffect(() => {
    if (!isSlider && fields.length > 1) {
      const removeIndexes = Array.from(
        { length: fields.length - 1 },
        (_, removeIndex) => removeIndex + 1
      );

      remove(removeIndexes);
    }

    if (isSlider && fields.length < 2) {
      append({
        image_height: 0,
        image_url: null,
        image_width: 0,
        sequence_no: fields.length + 1,
      });
    }
  }, [append, fields.length, isSlider, remove]);

  return (
    <Stack gap="12px" sx={{ minWidth: 0, width: "100%" }}>
      <Typography fontWeight={600}>{`Slot ${index + 1}`}</Typography>

      <FormGridLayout columns={2}>
        <TextField
          control={control}
          name={`slots.${index}.position`}
          type="number"
          label="Position"
          required
          error={!!slotErrors?.position}
          helperText={errorMessages(slotErrors?.position?.message)}
          loading={loading}
        />

        <Stack
          direction={{ sm: "row", xs: "column" }}
          gap={1}
          alignItems={{ sm: "center", xs: "stretch" }}
        >
          <Typography fontWeight={600}>Is Slider</Typography>
          <RadioGroupField
            name={`slots.${index}.is_slider`}
            control={control}
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
        </Stack>
      </FormGridLayout>

      <Stack gap="10px" sx={{ minWidth: 0, width: "100%" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
        >
          <Typography fontWeight={600}>Images</Typography>

          <ButtonLayoutProvider
            variant="outlined"
            startIcon={<ImageOutlined />}
            onClick={handleAddImage}
            disabled={!isSlider}
            label="Image"
          />
        </Stack>

        {fields.map((image, imageIndex) => {
          const imageErrors = slotErrors?.images?.[imageIndex];

          return (
            <Stack
              key={image.id}
              gap="10px"
              sx={{ minWidth: 0, width: "100%" }}
            >
              <Stack
                direction={{ sm: "row", xs: "column" }}
                gap={1.5}
                alignItems={{ sm: "flex-start", xs: "stretch" }}
                sx={{ minWidth: 0, width: "100%" }}
              >
                <Box sx={{ minWidth: 0, width: { sm: "auto", xs: "100%" } }}>
                  <WebBannerImageUploadField
                    size={1}
                    control={control}
                    loading={loading}
                    rules={{ required: true }}
                    label={`Image ${imageIndex + 1}`}
                    maxWidth={image.image_width ?? 0}
                    maxHeight={image.image_height ?? 0}
                    name={`slots.${index}.images.${imageIndex}.image_url`}
                    subTitle={`PNG, JPEG under 1 MB, Max size ${image.image_width}x${image.image_height}`}
                  />
                </Box>

                <Stack
                  direction={{ sm: "column", xs: "row" }}
                  gap={1}
                  justifyContent={{ sm: "center", xs: "space-between" }}
                  alignItems={{ sm: "stretch", xs: "flex-end" }}
                  sx={{
                    flexShrink: 0,
                    minWidth: 0,
                    width: { sm: "150px", xs: "100%" },
                  }}
                >
                  <TextField
                    type="number"
                    control={control}
                    loading={loading}
                    label="Sequence No"
                    error={!!imageErrors?.sequence_no}
                    name={`slots.${index}.images.${imageIndex}.sequence_no`}
                    helperText={errorMessages(
                      imageErrors?.sequence_no?.message
                    )}
                    sx={{ width: "100%" }}
                    containerProps={{ sx: { minWidth: 0, width: "100%" } }}
                  />

                  <ButtonLayoutProvider
                    variant="outlined"
                    startIcon={<DeleteOutlined />}
                    onClick={() => remove(imageIndex)}
                    disabled={fields.length <= (isSlider ? 2 : 1)}
                    label="Delete"
                  />
                </Stack>
              </Stack>

              <Divider />
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};
