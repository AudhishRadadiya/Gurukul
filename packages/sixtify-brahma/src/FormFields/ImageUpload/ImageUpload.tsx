import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../Button";
import { PadBox } from "../../PadBox";
import { toasts } from "../../Toast";
import {
  isFileSizeValid,
  isFileTypeValid,
  type SupportedFileType,
} from "../../utils";
import { DarkBackgroundContainer } from "./ImageUpload.styled";
import { PhotoCaptureDialog } from "./PhotoCaptureDialog";
import { Skeleton } from "./Skeleton";

export type ImageUploadProps = Readonly<{
  onDelete: () => void;
  onChange: (file: File[]) => void;
  variant?: "square" | "circle";
  isUploading?: boolean;
  label?: string;
  subTitle?: string;
  defaultValue?: string;
  isCapture?: boolean;
  loading?: boolean;
  size?: number; //Note:- Size in MB
}>;

type ImageFileType = Extract<
  SupportedFileType,
  "image/png" | "image/jpeg" | "image/jpg"
>;

const imageFileType: ImageFileType[] = ["image/png", "image/jpeg", "image/jpg"];

export function ImageUpload({
  variant = "square",
  isUploading = false,
  defaultValue = "",
  onDelete,
  onChange,
  label,
  isCapture = false,
  loading = false,
  size = 5,
  subTitle = "PNG, JPEG under 5 MB",
}: ImageUploadProps) {
  const { t } = useTranslation();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [hover, setHover] = useState(false);

  const [isOpenCaptureModal, setIsOpenCaptureModal] = useState(false);

  const theme = useTheme();

  const { butterflyBlue, iron } = theme.palette.app.color;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);

      for (const element of files) {
        if (!isFileSizeValid(element, size)) {
          toasts.error({
            title: t("imageUpload.fileSize.error.message", {
              fileSize: size,
            }),
          });

          return;
        }

        if (!isFileTypeValid(element, imageFileType)) {
          toasts.error({
            title: t("fileUpload.fileType.error.message", {
              fileName: element.name,
            }),
          });

          return;
        }
      }

      onChange(files);
    }
  };

  const handleFileRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete();

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  if (loading) {
    return <Skeleton />;
  }

  return (
    <>
      <Stack gap="20px" direction="row" alignItems="center">
        <Box
          onClick={() => !defaultValue && inputRef.current?.click()}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          sx={{
            height: "120px",
            width: "120px",
            position: "relative",
            overflow: "hidden",
            border: defaultValue
              ? `2px solid ${butterflyBlue[900]}`
              : `2px dashed ${theme.palette.grey[400]}`,
            cursor: "pointer",
            borderRadius: "10px",
            "& img": {
              borderRadius: "10px",
            },
            ":hover": {
              border: `2px dashed ${butterflyBlue[900]}`,
            },
            ...(variant === "circle"
              ? {
                  borderRadius: "50%",
                  "& img": {
                    borderRadius: "50%",
                  },
                }
              : {}),
          }}
        >
          <input
            type="file"
            ref={inputRef}
            accept={imageFileType.join(",")}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {hover && !!defaultValue && (
            <DarkBackgroundContainer>
              <IconButton onClick={() => inputRef.current?.click()}>
                <EditIcon sx={{ color: "white" }} />
              </IconButton>
              <IconButton onClick={handleFileRemove}>
                <DeleteIcon sx={{ color: "white" }} />
              </IconButton>
            </DarkBackgroundContainer>
          )}

          {isUploading && (
            <DarkBackgroundContainer>
              <Typography color={iron[600]}>Processing...</Typography>
            </DarkBackgroundContainer>
          )}

          {defaultValue ? (
            <PadBox padding={{ padding: "2px" }}>
              <img
                alt=""
                src={defaultValue}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </PadBox>
          ) : (
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={{ height: "100%" }}
            >
              <PersonAddAltIcon />
            </Stack>
          )}
        </Box>

        <Stack>
          <Typography variant="subtitle1" fontWeight={500}>
            {label}
          </Typography>

          <Typography variant="caption" color={iron[800]}>
            {subTitle}
          </Typography>
        </Stack>

        {isCapture && (
          <Button
            onClick={() => setIsOpenCaptureModal(true)}
            variant="outlined"
          >
            <Stack gap="10px" direction="row">
              <CameraAltOutlinedIcon />

              <Typography variant="body1">Capture photo</Typography>
            </Stack>
          </Button>
        )}
      </Stack>

      {isOpenCaptureModal && (
        <PhotoCaptureDialog
          onChange={onChange}
          isUploading={isUploading}
          open={isOpenCaptureModal}
          onClose={() => setIsOpenCaptureModal(false)}
        />
      )}
    </>
  );
}
