import type { SxProps, Theme } from "@mui/material";
import { Box, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import type { PropsWithChildren, ReactNode } from "react";
import { DeleteIconAction } from "../../../Actions";
import { Chip } from "../../../Chips";
import { CardItemValue } from "../../CardItem";

type ProfileCardHeaderProps = PropsWithChildren<{
  avatar: ReactNode;
  employeeName: string;
  designation: string;
  employeeCode: string;
  loading: boolean;
  isDraft?: boolean;
  sx?: SxProps<Theme>;
  onDeleteClick?: (e: React.MouseEvent) => void;
}>;

export function ProfileCardHeader({
  avatar,
  employeeName,
  designation,
  employeeCode,
  loading,
  isDraft = false,
  onDeleteClick,
}: ProfileCardHeaderProps) {
  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  return (
    <Box>
      <Stack
        gap="10px"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        {loading ? (
          <Skeleton
            variant="rounded"
            height={20}
            animation="wave"
            width="100px"
          />
        ) : // eslint-disable-next-line sonarjs/no-nested-conditional
        isDraft ? (
          <Chip label="Draft" size="small" color="error" variant="outlined" />
        ) : (
          <CardItemValue title={employeeCode} loading={loading} />
        )}

        {isDraft &&
          (loading ? (
            <Skeleton
              variant="rounded"
              height={20}
              animation="wave"
              width="50px"
            />
          ) : (
            <DeleteIconAction onClick={onDeleteClick} />
          ))}
      </Stack>

      <Stack alignItems="center" gap="8px">
        {avatar}
        {loading ? (
          <Skeleton
            variant="rounded"
            height={30}
            animation="wave"
            width="300px"
          />
        ) : (
          <Typography
            variant="h6"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
            maxWidth="330px"
            fontWeight="500"
            textAlign="center"
          >
            {employeeName ?? "-"}
          </Typography>
        )}

        {loading ? (
          <Skeleton
            variant="rounded"
            height={30}
            animation="wave"
            width="200px"
          />
        ) : (
          <Typography
            variant="body1"
            fontWeight={400}
            color={slate[900]}
            noWrap
          >
            {designation ? designation : "-"}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
