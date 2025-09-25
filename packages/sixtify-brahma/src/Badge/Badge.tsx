import { Badge as MuiBadge, type BadgeProps } from "@mui/material";

export const Badge = ({
  children,
  sx,
  color = "error",
  ...rest
}: BadgeProps) => {
  return (
    <MuiBadge
      color={color}
      sx={{
        padding: "0px",
        zIndex: 1,
        "& .MuiBadge-badge": {
          right: 5,
        },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </MuiBadge>
  );
};
