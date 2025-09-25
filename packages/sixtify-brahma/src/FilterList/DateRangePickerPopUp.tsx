import type { PopoverProps } from "@mui/material";
import {
  Box,
  Divider,
  IconButton,
  Popover,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers";
import { isFunction } from "lodash";
import { type PropsWithChildren } from "react";
import { Button } from "../Button";
import { PadBox } from "../PadBox";

type DateRangePickerPopUpProps = Partial<
  PropsWithChildren<PopoverProps> & {
    onApply: () => void;
    showFooter: boolean;
    showDivider: boolean;
    title: string;
    required: boolean;
    background: boolean;
    open: boolean;
  }
>;

export const DateRangePickerPopUp = ({
  open = false,
  anchorEl,
  onClose,
  children,
  onApply,
  showDivider = false,
  showFooter = true,
  title,
  required,
  background = false,
}: DateRangePickerPopUpProps) => {
  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  const handleApply = () => {
    if (isFunction(onApply)) {
      onApply();
    }
  };

  const handleClose = () => {
    if (isFunction(onClose)) {
      onClose({}, "backdropClick");
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      onClose={(_event, reason) => {
        if (reason === "backdropClick") {
          return;
        }
        handleClose();
      }}
      sx={{ "& .MuiPaper-root": { minWidth: "300px" } }}
    >
      {showDivider && (
        <Stack alignItems="flex-end">
          <PadBox padding={{ padding: "8px" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              width="100%"
              alignItems="center"
            >
              <Stack direction="row" alignItems="center" gap="5px">
                <Typography variant="h6">{title} </Typography>

                {required && (
                  <Typography variant="h6" color="error">
                    *
                  </Typography>
                )}
              </Stack>

              <IconButton onClick={handleClose}>
                <ClearIcon />
              </IconButton>
            </Stack>
          </PadBox>

          <Divider sx={{ width: "100%" }} />
        </Stack>
      )}

      <Box
        sx={{
          background: background ? slate[600] : "transparent",
          borderRadius: "5px",
        }}
      >
        {children}
      </Box>

      {showFooter && (
        <PadBox padding={{ padding: "10px" }}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              onClick={handleApply}
              variant="text"
              sx={{ maxWidth: "40px" }}
            >
              Submit
            </Button>
          </Box>
        </PadBox>
      )}
    </Popover>
  );
};
