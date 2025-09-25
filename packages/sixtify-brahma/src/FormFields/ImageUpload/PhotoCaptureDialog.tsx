import { Stack } from "@mui/material";
import { base64ToFile } from "file64";
import { useCallback, useRef } from "react";
import Webcam from "react-webcam";
import { Button } from "../../Button";
import { Dialog } from "../../Dialog";
import { toasts } from "../../Toast";

type PhotoCaptureDialogProps = {
  open: boolean;
  isUploading: boolean;
  onClose: () => void;
  onChange: (file: File[]) => void;
};

export const PhotoCaptureDialog = ({
  open,
  isUploading,
  onClose,
  onChange,
}: PhotoCaptureDialogProps) => {
  const webcamRef = useRef<Webcam | null>(null);

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();

      if (imageSrc) {
        try {
          const file = await base64ToFile(imageSrc, "image/jpeg");

          onChange([file]);

          onClose();
        } catch (error) {
          toasts.error({ title: `Failed to convert base64 to file:${error}` });
        }
      }
    }
  }, [webcamRef]);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      title="Photo Capture"
      maxWidth="md"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={() => {
              capture();
            }}
            loading={isUploading}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <Webcam
        mirrored
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="835"
        height="600"
      />
    </Dialog>
  );
};
