import { ImageUpload } from "@codezee/sixtify-brahma";
import type { FieldValues, UseControllerProps } from "react-hook-form";
import { useController } from "react-hook-form";

import { useUploadFile } from "@web/hooks/useUploadFile";
import { onError } from "@web/utils/errors";

export type ImageUploadFieldProps<P extends FieldValues> =
  UseControllerProps<P> & {
    isCapture?: boolean;
    label?: string;
    loading?: boolean;
    size?: number;
    subTitle?: string;
    variant?: "square" | "circle";
  };

export const ImageUploadField = <T extends FieldValues>({
  control,
  defaultValue,
  isCapture,
  label,
  loading = false,
  name,
  rules,
  size = 5,
  subTitle,
  variant, //Note:- Size in MB
}: ImageUploadFieldProps<T>) => {
  const {
    field: { onChange, value },
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

  return (
    <ImageUpload
      onDelete={() => onChange(null)}
      loading={loading}
      onChange={(file) => {
        mutate(file);
      }}
      size={size}
      variant={variant}
      isUploading={isPending}
      defaultValue={value}
      label={label}
      subTitle={subTitle}
      isCapture={isCapture}
    />
  );
};
