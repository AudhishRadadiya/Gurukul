import { InputLabel, Stack, Typography, useTheme } from "@mui/material";
import { isFunction } from "lodash";
import { useRef, useState } from "react";
import type { DragEvent } from "react";
import type {
  FieldError,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { PadBox } from "../../PadBox";
import { SvgDrop } from "../../Svgs";
import {
  isFileSizeValid,
  isFileTypeValid,
  SUPPORTED_FILE_TYPES,
  type SupportedFileType,
} from "../../utils";
import { FileInput, FileUploadContainer } from "./FileUpload.styled";
import { Skeleton } from "./Skeleton";

export type FileUploadProps<P extends FieldValues> = UseControllerProps<P> & {
  multiple?: boolean;
  loading?: boolean;
  required?: boolean;
  isDisabled?: boolean;
  onChange: (file: File[]) => void;
  error?: boolean;
  helperText?: string;
  label?: string;
  size?: number; //Note:- Size in MB
  accept?: SupportedFileType[];
  fileNames: JSX.Element;
  acceptTitle?: string;
  setError: (
    name: keyof P,
    error: FieldError | { type: string; message?: string }
  ) => void;
};

export const error_with_transaltion = "error_with_transaltion";

export function FileUpload<P extends FieldValues>({
  loading = false,
  onChange,
  isDisabled,
  multiple = false,
  required = false,
  error,
  helperText,
  label,
  fileNames,
  size = 10,
  name,
  setError,
  accept = SUPPORTED_FILE_TYPES,
  acceptTitle = "Only JPG, PNG, PDF files are accepted.",
  ...restProps
}: FileUploadProps<P>) {
  const theme = useTheme();

  const { red, iron } = theme.palette.app.color;

  const { t } = useTranslation();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const processFiles = (files: File[]) => {
    const selectedFiles = multiple ? files : files.slice(0, 1);

    const uploadFiles: File[] = [];

    const inValidFiles: string[] = [];

    let isShowError = false;

    for (const element of selectedFiles) {
      if (!isFileSizeValid(element, size)) {
        isShowError = true;

        inValidFiles.push(
          t("fileUpload.fileSize.error.message", {
            fileName: element.name,
            fileSize: size,
          })
        );
      } else if (accept.length && !isFileTypeValid(element, accept)) {
        isShowError = true;

        inValidFiles.push(
          t("fileUpload.fileType.error.message", {
            fileName: element.name,
          })
        );
      } else {
        uploadFiles.push(element);
      }
    }

    if (isShowError) {
      if (isFunction(setError)) {
        setError(name, {
          type: error_with_transaltion,
          message: inValidFiles.join("\n"),
        });
      }

      return;
    }

    if (uploadFiles.length > 0) {
      onChange(uploadFiles);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      processFiles(Array.from(event.target.files));

      event.target.value = "";
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isDisabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.currentTarget === event.target) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);

    if (isDisabled || !event.dataTransfer.files.length) {
      return;
    }

    processFiles(Array.from(event.dataTransfer.files));
  };

  if (loading) {
    return <Skeleton />;
  }

  return (
    <Stack gap="5px">
      <InputLabel disabled={isDisabled} required={required}>
        {label}
      </InputLabel>

      <FileUploadContainer
        onClick={() => !isDisabled && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        error={error}
        disabled={isDisabled}
        isDragging={isDragging}
        {...restProps}
      >
        <PadBox padding={{ padding: "20px" }}>
          <Stack gap="4px" alignItems="center" justifyContent="center">
            <FileInput
              disabled={isDisabled}
              type="file"
              accept={accept.toString()}
              ref={inputRef}
              onChange={handleFileChange}
              multiple={multiple}
            />

            <SvgDrop disabled={isDisabled} />

            <Typography color={isDisabled ? iron[800] : "revert-layer"}>
              Drag & drop files or Browse
            </Typography>

            <Typography
              variant="caption"
              color={isDisabled ? iron[800] : "revert-layer"}
            >
              {acceptTitle}
            </Typography>
          </Stack>
        </PadBox>
      </FileUploadContainer>

      {error && (
        <Typography
          variant="caption"
          sx={{
            color: `${red[900]}`,
            whiteSpace: "pre",
            textWrap: "wrap",
          }}
        >
          {helperText}
        </Typography>
      )}
      {fileNames}
    </Stack>
  );
}
