import { Box, Stack, useTheme } from "@mui/material";
import type { PropsWithChildren, ReactNode } from "react";
import { PadBox } from "../../PadBox";

type ProfileCardProps = PropsWithChildren<{
  header: ReactNode;
  body: ReactNode;
  onClick: (e: React.MouseEvent) => void;
}>;

export function ProfileCard({
  onClick,
  header,
  body,
}: Readonly<ProfileCardProps>) {
  const theme = useTheme();

  const { lightBlue, butterflyBlue } = theme.palette.app.color;

  return (
    <Box
      bgcolor={lightBlue[50]}
      flex={1}
      sx={{
        borderRadius: "10px",
        cursor: "pointer",
        ":hover": { background: butterflyBlue[600] },
      }}
      height="400px"
      onClick={onClick}
    >
      <PadBox padding={{ padding: "10px" }}>
        <Stack height="100%" justifyContent="space-between">
          {header}
          {body}
        </Stack>
      </PadBox>
    </Box>
  );
}
