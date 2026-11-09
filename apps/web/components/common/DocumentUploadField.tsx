import { Button, PadBox } from "@codezee/sixtify-brahma";
import CloudUpload from "@mui/icons-material/CloudUpload";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useRef, useState, type ChangeEvent } from "react";
import type { FieldValues, UseControllerProps } from "react-hook-form";
import { useController } from "react-hook-form";
import z from "zod";

import { useUploadFile } from "@web/hooks/useUploadFile";
import { onError } from "@web/utils/errors";

const ACCEPT_TYPES = ".pdf,.jpg,.jpeg";

const lowercaseExtensionErrorMessage =
  "Only lowercase .pdf, .jpg, and .jpeg extensions are allowed";

const hasAllowedLowercaseExtension = (value: string) =>
  /\.(pdf|jpg|jpeg)(\?.*)?$/.test(value.split("/").pop() ?? "");

export const attachmentEntryFormSchema = z.object({
  action: z.enum(["add"]).optional(),
  documentUploadMasterId: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  documentUploadMasterName: z.string().nullable().optional(),
  fileName: z
    .string()
    .nullable()
    .refine((value) => !value || hasAllowedLowercaseExtension(value), {
      message: lowercaseExtensionErrorMessage,
    }),
  id: z.string().nullable().optional(),
  mediaPath: z.string().nullable().optional(),
  mediaUrl: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    })
    .refine((value) => !value || hasAllowedLowercaseExtension(value), {
      message: lowercaseExtensionErrorMessage,
    }),
});

export type AttachmentFormFieldValues = z.infer<
  typeof attachmentEntryFormSchema
>;

export const getAttachmentMediaUrl = (
  attachments: AttachmentFormFieldValues[] | null
) => attachments?.[0]?.mediaUrl ?? null;

export const createAttachmentFromMediaUrl = (
  mediaUrl: string
): AttachmentFormFieldValues => ({
  documentUploadMasterId: mediaUrl,
  fileName: mediaUrl.split("/").pop()?.split("?")[0] ?? "certificate.pdf",
  mediaPath: mediaUrl,
  mediaUrl,
});

export type DocumentUploadFieldProps<P extends FieldValues> =
  UseControllerProps<P> &
    Partial<{
      disabled: boolean;
      error: boolean;
      helperText: string;
      isUploadForCertificate: boolean;
      label: string;
      loading: boolean;
      required: boolean;
      size: number;
    }>;

export const DocumentUploadField = <T extends FieldValues>({
  control,
  defaultValue,
  disabled = false,
  error = false,
  helperText,
  isUploadForCertificate = false,
  label = "Browse Files",
  loading = false,
  name,
  required = false,
  rules,
  size = 10,
}: DocumentUploadFieldProps<T>) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileError, setFileError] = useState<string | null>(null);

  const theme = useTheme();

  const { iron, red } = theme.palette.app.color;

  const {
    field: { onChange, value },
  } = useController({ control, defaultValue, name, rules });

  const maxFileSizeBytes = size * 1024 * 1024;

  const sizeErrorMessage = `File size must be less than ${size} MB`;

  const getUploadKey = (item: AttachmentFormFieldValues) => {
    const { fileName, id, mediaUrl } = item;

    if (typeof id === "string" && id) {
      return id;
    }

    if (typeof fileName === "string" && fileName) {
      return fileName;
    }

    if (typeof mediaUrl === "string" && mediaUrl) {
      return mediaUrl;
    }

    return "";
  };

  const getUploadDisplayName = (item: AttachmentFormFieldValues) => {
    const { fileName, mediaUrl } = item;

    if (typeof fileName === "string" && fileName) {
      return fileName;
    }

    if (typeof mediaUrl === "string" && mediaUrl) {
      return mediaUrl.split("/").pop()?.split("?")[0] ?? mediaUrl;
    }

    return "";
  };

  const { isPending, mutate: mutateUpload } = useUploadFile({
    isUploadForCertificate,
    options: {
      onError: (error) => onError(error),
    },
    uploadFor: String(name),
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    const selectedFiles = Array.from(files);

    const invalidFileType = selectedFiles.find(
      ({ name }) => !hasAllowedLowercaseExtension(name)
    );

    if (invalidFileType) {
      setFileError(lowercaseExtensionErrorMessage);
      event.target.value = "";

      return;
    }

    const invalidFile = selectedFiles.find(
      ({ size }) => size > maxFileSizeBytes
    );

    if (invalidFile) {
      setFileError(sizeErrorMessage);
      event.target.value = "";

      return;
    }

    setFileError(null);

    mutateUpload(selectedFiles, {
      onSuccess: (data) => {
        const uploadedFiles = data.data?.files ?? [];

        if (!uploadedFiles.length) {
          return;
        }

        const nextUploads = selectedFiles.map((file, index) => {
          const mediaUrl = uploadedFiles[index] ?? uploadedFiles[0];

          return {
            action: "add" as const,
            documentUploadMasterId: mediaUrl,
            fileName: file.name,
            mediaPath: mediaUrl,
            mediaUrl,
          };
        });

        onChange([...(value ?? []), ...nextUploads]);
      },
    });

    event.target.value = "";
  };

  const handleBrowseClick = () => {
    if (!loading && !isPending) {
      fileInputRef.current?.click();
    }
  };

  const isDisabled = loading || isPending || disabled;

  const hasFileError = Boolean(fileError);

  const displayError = error || hasFileError;

  const displayHelperText = hasFileError ? fileError : helperText;

  const hasFile = value?.length > 0;

  const handleRemoveOne = (key: string) => {
    const nextUploads = value?.filter(
      (x: AttachmentFormFieldValues) => getUploadKey(x) !== key
    );

    if (nextUploads.length) {
      onChange(nextUploads);

      return;
    }

    onChange(null);
  };

  return (
    <Stack width="100%" gap={0.2}>
      <Stack
        direction="row"
        alignItems="center"
        gap={1}
        flexWrap="wrap"
        width="100%"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_TYPES}
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
          disabled={isDisabled}
        />

        {!hasFile && (
          <Button
            variant="outlined"
            sx={{
              height: "30px",
              maxWidth: "100%",
              minWidth: "150px",
              width: "auto",
            }}
            onClick={handleBrowseClick}
            disabled={isDisabled}
            size="small"
            startIcon={
              isPending ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <CloudUpload fontSize="small" />
              )
            }
          >
            <InputLabel
              component="span"
              required={required}
              shrink
              sx={{
                color: "inherit",
                fontSize: 13,
                transform: "none",
              }}
            >
              {label}
            </InputLabel>
          </Button>
        )}

        {hasFile && (
          <Box
            sx={{
              alignItems: "center",
              border: "1px solid",
              borderColor: iron[500],
              borderRadius: 1,
              display: "flex",
              gap: 0.5,
              maxWidth: "100%",
              minHeight: 28,
              width: "auto",
            }}
          >
            <PadBox padding={{ paddingLeft: "8px", paddingRight: "4px" }}>
              <Stack gap={0.25} sx={{ width: "100%" }}>
                {value?.map((item: AttachmentFormFieldValues) => {
                  const key = getUploadKey(item);

                  const displayName = getUploadDisplayName(item);

                  return (
                    <Stack
                      key={key}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={1}
                      width="100%"
                    >
                      <Typography
                        variant="body2"
                        noWrap
                        fontSize={13}
                        sx={{ flex: 1, minWidth: 0 }}
                        title={displayName}
                      >
                        {displayName}
                      </Typography>

                      <IconButton
                        onClick={() => handleRemoveOne(key)}
                        color="error"
                        disabled={isDisabled}
                        sx={{ padding: 0.25 }}
                        aria-label={`Remove ${displayName}`}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Stack>
                  );
                })}
              </Stack>
            </PadBox>
          </Box>
        )}
      </Stack>

      {displayError && (
        <Typography
          variant="caption"
          sx={{
            color: red[900],
            textWrap: "wrap",
            whiteSpace: "pre",
          }}
        >
          {displayHelperText}
        </Typography>
      )}
    </Stack>
  );
};
