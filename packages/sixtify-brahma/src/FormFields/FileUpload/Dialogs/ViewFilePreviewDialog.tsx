import { Box, useTheme } from "@mui/material";
import { DownloadIconAction } from "../../../Actions";
import { Dialog } from "../../../Dialog";
import { PadBox } from "../../../PadBox";
import { downloadFile } from "../../../utils/download";
import { FilePreview } from "./FilePreview";

type ViewFilePreviewDialogProps = {
  open: boolean;
  fileName: string;
  onClose: () => void;
};

export const ViewFilePreviewDialog = ({
  open,
  onClose,
  fileName,
}: ViewFilePreviewDialogProps) => {
  const theme = useTheme();

  const { butterflyBlue, iron } = theme.palette.app.color;

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="View File Preview"
    >
      <Box
        sx={{
          bgcolor: butterflyBlue[700],
          borderRadius: "5px",
        }}
      >
        <PadBox padding={{ padding: "20px" }}>
          <Box
            sx={{
              position: "relative",
              backgroundColor: iron[600],
              overflow: "hidden",
              maxHeight: "650px",
              boxShadow: "none",
            }}
          >
            <DownloadIconAction
              // eslint-disable-next-line sonarjs/no-misused-promises
              onClick={() => downloadFile(fileName, fileName)}
              sx={{
                position: "absolute",
                top: 5,
                right: 10,
                zIndex: 10,
              }}
            />

            <FilePreview fileName={fileName} />
          </Box>
        </PadBox>
      </Box>
    </Dialog>
  );
};
