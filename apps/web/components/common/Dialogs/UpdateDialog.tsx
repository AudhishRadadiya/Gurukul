import type { OnAction } from "@codezee/sixtify-brahma";
import { Button, ButtonContainer, Dialog } from "@codezee/sixtify-brahma";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import { Stack, Typography } from "@mui/material";

export type UpdateDialogProps = {
  isUpdateLoading: boolean;
  onClose: OnAction;
  onUpdate: OnAction;
  open: boolean;
  title: string;
};

export const UpdateDialog = ({
  isUpdateLoading,
  onClose,
  onUpdate,
  open,
  title,
}: UpdateDialogProps) => {
  return (
    <Dialog
      maxWidth="xs"
      isHideCloseIcon={true}
      isHideDividers={true}
      open={open}
      actions={
        <ButtonContainer>
          <Button
            disabled={isUpdateLoading}
            onClick={onClose}
            variant="outlined"
          >
            Cancel
          </Button>

          <Button onClick={onUpdate} color="error" loading={isUpdateLoading}>
            Update
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
