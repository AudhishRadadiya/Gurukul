import { TextField } from "@codezee/sixtify-brahma";
import CloseIcon from "@mui/icons-material/Close";
import { Popover, Box, IconButton } from "@mui/material";
import { useState } from "react";
import type {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";

import { errorMessages } from "@web/utils/helper";

type SocialLinkPopoverProps<T extends FieldValues> = {
  control: Control<T>;
  errors: FieldErrors<T>;
  icon: React.ReactNode;
  label: string;
  name: Path<T>;
  setValue: UseFormSetValue<T>;
};

export const SocialLinkPopover = <T extends FieldValues>({
  control,
  errors,
  icon,
  label,
  name,
  setValue,
  ...rest
}: SocialLinkPopoverProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setValue(name, null as PathValue<T, Path<T>>, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const message = errors[name]?.message;

  return (
    <>
      <IconButton onClick={handleOpen}>{icon}</IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
      >
        <Box {...rest} p={1} display="flex" alignItems="center">
          <TextField
            name={name}
            control={control}
            label={`${label} Link`}
            letterCase="mixed"
            error={!!errors[name]}
            helperText={
              typeof message === "string" ? errorMessages(message) : undefined
            }
          />

          <IconButton onClick={handleClose}>
            <CloseIcon sx={{ color: "red" }} />
          </IconButton>
        </Box>
      </Popover>
    </>
  );
};
