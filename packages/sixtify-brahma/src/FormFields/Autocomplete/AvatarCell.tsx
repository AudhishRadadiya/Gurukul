import { Avatar } from "@mui/material";
import type { Option } from "./Autocomplete";

type AvatarCellProps = {
  isShowAvatar: boolean;
  option: Option;
  label: string;
};

export const AvatarCell = ({
  isShowAvatar,
  option,
  label,
}: AvatarCellProps) => {
  const { avatar } = option;

  if (!isShowAvatar) {
    return undefined;
  }

  if (avatar) {
    return <Avatar sx={{ width: 25, height: 25 }} src={avatar} alt={label} />;
  }

  const initials = label
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return <Avatar sx={{ width: 25, height: 25 }}>{initials}</Avatar>;
};
