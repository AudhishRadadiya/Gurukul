import { FormGridLayout, RadioGroupField, TextField } from "@codezee/sixtify-brahma";
import { DeleteOutlined, ImageOutlined } from "@mui/icons-material";
import { Button, Divider, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import type { Control, FieldErrors } from "react-hook-form";
import { useFieldArray, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
        <Stack gap="12px">
            <Stack direction="row" justifyContent="space-between" alignItems="center" >
                <Typography fontWeight={600}>{`Slot ${index + 1}`}</Typography>
            </Stack>

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

                <Stack direction="row" gap="10px" alignItems="center">
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

            <Stack gap="10px">
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight={600}>Images</Typography>
                    <Button
                        variant="outlined"
                        sx={{ width: "150px" }}
                        onClick={handleAddImage}
                        disabled={!isSlider}
                    >
                        <ImageOutlined />  Image
                    </Button>
                </Stack>

                {fields.map((image, imageIndex) => {
                    const imageErrors = slotErrors?.images?.[imageIndex];

                    return (
                        <Stack key={image.id} gap="10px">
                            <Stack direction="row" gap="10px">
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

                                <Stack gap="10px" justifyContent="center">
                                    <TextField
                                        type="number"
                                        control={control}
                                        loading={loading}
                                        label="Sequence No"
                                        sx={{ width: "150px" }}
                                        error={!!imageErrors?.sequence_no}
                                        containerProps={{ sx: { width: "150px" } }}
                                        name={`slots.${index}.images.${imageIndex}.sequence_no`}
                                        helperText={errorMessages(imageErrors?.sequence_no?.message)}
                                    />

                                    <Button
                                        onClick={() => remove(imageIndex)}
                                        variant="outlined"
                                        disabled={fields.length <= (isSlider ? 2 : 1)}
                                    >
                                        <DeleteOutlined />  Delete
                                    </Button>
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