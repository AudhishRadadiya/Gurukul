import {
  RotateLeft,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Stack, useTheme } from "@mui/material";
import { useRef, useState } from "react";
import { Dialog } from "../../../Dialog";
import { PadBox } from "../../../PadBox";
import { downloadFile } from "../../../utils/download";
import type { OnAction } from "../../../utils/types";
import { DownloadAction } from "../DownloadAction";
import {
  FilePreview,
  isFileType,
  SUPPORTED_IMAGE_FORMATS,
  type FilePreviewRef,
} from "./FilePreview";

type ViewFilePreviewDialogProps = {
  open: boolean;
  fileName: string;
  onClose: OnAction;
};

export const ViewFilePreviewDialog = ({
  open,
  onClose,
  fileName,
}: ViewFilePreviewDialogProps) => {
  const theme = useTheme();

  const [zoomLevel, setZoomLevel] = useState(0);

  const filePreviewRef = useRef<FilePreviewRef>(null);

  const { butterflyBlue, slate } = theme.palette.app.color;

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="View File Preview"
      actions={
        <Stack height={30} minHeight={30} maxHeight={30} direction="row">
          {isFileType(fileName, SUPPORTED_IMAGE_FORMATS) && (
            <Stack direction="row" alignContent="center" justifyContent="end">
              {zoomLevel !== 1 && (
                <IconButton onClick={() => filePreviewRef.current?.resetZoom()}>
                  <RotateLeft />
                </IconButton>
              )}

              <IconButton onClick={() => filePreviewRef.current?.zoomIn()}>
                <ZoomInOutlined />
              </IconButton>

              <IconButton onClick={() => filePreviewRef.current?.zoomOut()}>
                <ZoomOutOutlined />
              </IconButton>
            </Stack>
          )}

          <DownloadAction
            onClick={() => {
              downloadFile(fileName, fileName);
            }}
          />
        </Stack>
      }
    >
      <Stack
        bgcolor={butterflyBlue[700]}
        position="relative"
        borderRadius="5px"
      >
        <PadBox padding={{ padding: { sm: "20px 50px 20px 50px", xs: "0" } }}>
          <Box
            bgcolor={slate[600]}
            borderRadius={1}
            overflow="hidden"
            height="calc(100vh - 335px)"
            sx={{
              userSelect: "none",
            }}
          >
            <FilePreview
              ref={filePreviewRef}
              fileName={fileName}
              resetTrigger={1}
              showActions={false}
              onZoomChange={(zoomOffset) => {
                setZoomLevel(zoomOffset);
              }}
            />
          </Box>
        </PadBox>
      </Stack>
    </Dialog>
  );
};
