import type { AvatarOwnProps, SxProps, Theme } from "@mui/material";
import { Avatar, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { forwardRef } from "react";

type CardItemValueProps = {
  title?: string;
  subTitle?: string;
  loading?: boolean;
  avatar?: string;
  showAvatar?: boolean;
  sx?: SxProps<Theme>;
  isHideTitle?: boolean;
  variant?: AvatarOwnProps["variant"];
  containerSx?: SxProps;
};

export const CardItemValue = forwardRef<HTMLSpanElement, CardItemValueProps>(
  (
    {
      title,
      subTitle,
      avatar,
      loading = false,
      showAvatar = false,
      isHideTitle = false,
      variant = "circular",
      sx,
      containerSx,
    },
    ref
  ) => {
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
      <Stack width="50%" sx={containerSx} gap="10px" flex={1}>
        <Stack gap="10px" direction="row" alignItems="center" flex={1}>
          {showAvatar && <Avatar alt={title} src={avatar} variant={variant} />}

          {!isHideTitle && (
            <Typography
              ref={ref}
              variant="body1"
              sx={{
                width: "100%",
                fontWeight: 400,
                color: slate[900],
                ...sx,
              }}
              noWrap
            >
              {title ? title : "-"}
            </Typography>
          )}
        </Stack>

        {subTitle && (
          <Typography variant="body1" sx={{ color: iron[500] }} noWrap>
            {subTitle}
          </Typography>
        )}
      </Stack>
    );
  }
);

CardItemValue.displayName = "CardItemValue";
