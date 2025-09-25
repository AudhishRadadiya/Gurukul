import type { AvatarOwnProps, SxProps, Theme } from "@mui/material";
import { Avatar, Skeleton, Stack, Typography, useTheme } from "@mui/material";

type CardItemValueProps = {
  title?: string;
  subTitle?: string;
  loading?: boolean;
  avatar?: string;
  showAvatar?: boolean;
  sx?: SxProps<Theme>;
  isHideTitle?: boolean;
  variant?: AvatarOwnProps["variant"];
};

export const CardItemValue = ({
  title,
  subTitle,
  avatar,
  loading = false,
  showAvatar = false,
  isHideTitle = false,
  variant = "circular",
  sx,
}: CardItemValueProps) => {
  const theme = useTheme();

  const { slate, iron } = theme.palette.app.color;

  if (loading) {
    return (
      <Stack gap="10px " flex="1">
        <Stack direction="row" gap="10px" alignItems="center">
          {avatar && (
            <Skeleton
              variant="circular"
              height="30px"
              animation="wave"
              width="30px"
            />
          )}
          <Skeleton
            variant="rounded"
            height={20}
            animation="wave"
            width="150px"
          />
        </Stack>

        {subTitle && (
          <Skeleton
            variant="rounded"
            height={20}
            animation="wave"
            width="200px"
          />
        )}
      </Stack>
    );
  }

  return (
    <Stack gap="10px" flex="1">
      <Stack gap="10px" direction="row" alignItems="center">
        {showAvatar && <Avatar alt={title} src={avatar} variant={variant} />}

        {!isHideTitle && (
          <Typography
            variant="body1"
            sx={{
              fontWeight: 400,
              color: slate[900],
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              width: "min-contact",
              ...sx,
            }}
          >
            {title ? title : "-"}
          </Typography>
        )}
      </Stack>

      {subTitle && (
        <Typography
          variant="body1"
          sx={{
            color: iron[500],
          }}
        >
          {subTitle}
        </Typography>
      )}
    </Stack>
  );
};
