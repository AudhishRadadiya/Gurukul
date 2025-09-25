import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import { Stack, Typography } from "@mui/material";
import { Button } from "../Button";
import { ButtonContainer } from "../Layouts";
import { Dialog } from "./Dialog";

export type DeleteDialogProps = {
  title: string;
  open: boolean;
  isDeleteLoading: boolean;
  onDelete: () => void;
  onClose: () => void;
};

export const DeleteDialog = ({
  title,
  open,
  isDeleteLoading,
  onDelete,
  onClose,
}: DeleteDialogProps) => {
  return (
    <Dialog
      maxWidth="xs"
      isHideCloseIcon={true}
      isHideDividers={true}
      open={open}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button onClick={onDelete} color="error" loading={isDeleteLoading}>
            Delete
          </Button>
        </ButtonContainer>
      }
    >
      <Stack gap="10px" direction="row">
        <InfoTwoToneIcon color="error" sx={{ mt: "1px" }} />

        <Typography variant="subtitle1" fontWeight={700}>
          {title}
        </Typography>
      </Stack>
    </Dialog>
  );
};
