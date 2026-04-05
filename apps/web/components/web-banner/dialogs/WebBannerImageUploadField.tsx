import { ImageUpload, toasts } from "@codezee/sixtify-brahma";
import type { FieldValues, UseControllerProps } from "react-hook-form";
import { useController } from "react-hook-form";

import { useUploadFile } from "@web/hooks/useUploadFile";
import { onError } from "@web/utils/errors";
import { errorMessages } from "@web/utils/helper";

import { validateImageDimensions } from "./utils/validateImageDimensions";

export type WebBannerImageUploadFieldProps<P extends FieldValues> =
  UseControllerProps<P> & {
    isCapture?: boolean;
    label?: string;
    loading?: boolean;
    maxHeight?: number;
    maxWidth?: number;
    size?: number;
    subTitle?: string;
    variant?: "square" | "circle";
  };

export const WebBannerImageUploadField = <T extends FieldValues>({
  control,
  defaultValue,
  isCapture,
  label,
  loading = false,
  maxHeight = 1000,
  maxWidth = 1000,
  name,
  rules,
  size = 1,
  subTitle,
  variant,
}: WebBannerImageUploadFieldProps<T>) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ control, defaultValue, name, rules });

  const { isPending, mutate } = useUploadFile({
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        onChange(data.data.files[0]);
      },
    },
    uploadFor: name,
  });

  const handleFileChange = (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    const file = files[0];

    if (!file) {
      return;
    }

    // Validate dimensions before upload
    validateImageDimensions(file, maxWidth, maxHeight)
      .then((isValidDimensions) => {
        if (!isValidDimensions) {
          toasts.error({
            title: `Image dimensions must be maximum ${maxWidth}x${maxHeight} pixels`,
          });

          return;
        }

        // If dimensions are valid, proceed with upload
        mutate([file]);
      })
      .catch(() => {
        toasts.error({
          title: "Failed to validate image dimensions",
        });
      });
  };

  return (
    <ImageUpload
      onDelete={() => onChange(null)}
      loading={loading}
      onChange={handleFileChange}
      size={size}
      variant={variant}
      isUploading={isPending}
      defaultValue={value}
      label={label}
      subTitle={subTitle}
      isCapture={isCapture}
      error={!!error}
      helperText={errorMessages(error?.message)}
    />
  );
};
