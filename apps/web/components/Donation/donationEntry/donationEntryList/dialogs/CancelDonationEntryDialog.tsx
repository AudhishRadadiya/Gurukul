import { Button, ButtonContainer, Dialog } from "@codezee/sixtify-brahma";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";

type CancelDonationEntryDialogProps = {
  isLoading: boolean;
  onCancel: () => void;
  onClose: () => void;
  open: boolean;
};

export const CancelDonationEntryDialog = ({
  isLoading,
  onCancel,
  onClose,
  open,
}: CancelDonationEntryDialogProps) => {
  return (
    <Dialog
      maxWidth="xs"
      isHideCloseIcon={true}
      isHideDividers={true}
      open={open}
      actions={
        <ButtonContainer>
          <Button disabled={isLoading} onClick={onClose} variant="outlined">
            {t("common.no")}
          </Button>

          <Button onClick={onCancel} color="error" loading={isLoading}>
            {t("common.cancel.button")}
          </Button>
        </ButtonContainer>
      }
    >
      <Stack gap="10px" direction="row">
        <InfoTwoToneIcon color="error" sx={{ mt: "1px" }} />

        <Typography variant="subtitle1" fontWeight={700}>
          {t("dialog.cancel.message")}
        </Typography>
      </Stack>
    </Dialog>
  );
};
