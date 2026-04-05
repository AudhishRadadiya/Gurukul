import {
  Button,
  ButtonContainer,
  Dialog,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";

import { errorMessages } from "@web/utils/helper";

const ExportOtpSchema = z.object({
  code: z
    .number()
    .nullable()
    .refine((value) => !!value, {
      message: "common.otp.required",
    }),
});

type ExportOtpFormFieldValues = z.infer<typeof ExportOtpSchema>;

type ExportDialogProps = {
  error?: string;
  isLoading: boolean;
  isPendingSendExportOtp?: boolean;
  onClose: () => void;
  onMaskSelect: () => void;
  onOriginalSelect: () => void;
  onSubmit: (otpValues: ExportOtpFormFieldValues) => void;
  open: boolean;
  showOtpForm: boolean;
};

export const ExportDialog = ({
  error,
  isLoading,
  isPendingSendExportOtp = false,
  onClose,
  onMaskSelect,
  onOriginalSelect,
  onSubmit,
  open,
  showOtpForm,
}: ExportDialogProps) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ExportOtpFormFieldValues>({
    defaultValues: { code: null },
    mode: "all",
    resolver: zodResolver(ExportOtpSchema),
  });

  const { code } = errors;

  if (showOtpForm) {
    return (
      <Dialog
        maxWidth="xs"
        title={t("common.verify.otp")}
        open={open}
        onClose={onClose}
        actions={
          <ButtonContainer>
            <Button onClick={onClose} variant="outlined">
              {t("common.cancel.button")}
            </Button>
            <Button
              loading={isLoading}
              onClick={() => {
                handleSubmit((values) => onSubmit(values))();
              }}
            >
              {t("common.verify.otp")}
            </Button>
          </ButtonContainer>
        }
      >
        <Form control={control}>
          <Stack gap="18px" padding="10px">
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              type="number"
              control={control}
              label={t("common.enter.otp.label")}
              placeholder={t("common.enter.otp.placeholder")}
              name="code"
              required
              error={!!code}
              helperText={errorMessages(code?.message)}
              autoFocus
            />
          </Stack>
        </Form>
      </Dialog>
    );
  }

  return (
    <Dialog
      maxWidth="xs"
      title={t("common.export.options")}
      open={open}
      onClose={onClose}
    >
      <Stack gap="10px" padding="10px">
        <Typography variant="body1" fontWeight={500}>
          {t("common.export.options.description")}
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Stack direction="row" gap="10px" justifyContent="end">
          <Button
            onClick={onOriginalSelect}
            disabled={isLoading}
            loading={isPendingSendExportOtp}
          >
            {t("common.original")}
          </Button>

          <Button
            onClick={onMaskSelect}
            disabled={isPendingSendExportOtp}
            loading={isLoading}
          >
            {t("common.mask")}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};
