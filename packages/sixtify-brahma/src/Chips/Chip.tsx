import {
  Avatar,
  Chip as MuiChip,
  type ChipProps as MuiChipProps,
} from "@mui/material";

type ChipProps = {
  imgURL?: string;
} & MuiChipProps;

export const Chip = ({
  label,
  variant = "outlined",
  imgURL,
  avatar,
  ...rest
}: ChipProps) => {
  return (
    <MuiChip
      avatar={avatar && <Avatar alt="Natacha" src={imgURL} />}
      label={label}
      variant={variant}
      {...rest}
    />
  );
};
