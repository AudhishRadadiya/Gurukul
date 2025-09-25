import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import { Stack, Typography, useTheme } from "@mui/material";
import { Button } from "../Button";
import { Dialog } from "./Dialog";

export type SaveDialogProps = {
  title: string;
  open: boolean;
  isSaveLoading?: boolean;
  onSave: () => void;
  onClose: () => void;
  cancelText?: string;
  saveText?: string;
};

export const SaveDialog = ({
  title,
  open,
  isSaveLoading = false,
  onSave,
  onClose,
  cancelText = "Cancel",
  saveText = "Save",
}: SaveDialogProps) => {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  return (
    <Dialog
      maxWidth="xs"
      isHideCloseIcon={true}
      isHideDividers={true}
      open={open}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            {cancelText}
          </Button>

          <Button onClick={onSave} loading={isSaveLoading}>
            {saveText}
          </Button>
        </Stack>
      }
    >
      <Stack gap="10px" direction="row">
        <InfoTwoToneIcon htmlColor={butterflyBlue[900]} sx={{ mt: "1px" }} />

        <Typography variant="subtitle1">{title}</Typography>
      </Stack>
    </Dialog>
  );
};
