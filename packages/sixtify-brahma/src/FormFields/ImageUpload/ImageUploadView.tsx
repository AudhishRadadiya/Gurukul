import { Avatar, Box, Stack, type SxProps, useTheme } from "@mui/material";
import { useState } from "react";
import { PadBox } from "../../PadBox";

export type ImageUploadViewProps = Readonly<{
  defaultValue?: string;
  variant: string;
  sx?: SxProps;
}>;
export function ImageUploadView({
  defaultValue,
  variant,
  sx,
}: ImageUploadViewProps) {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const [hasError, setHasError] = useState(false);

  const imageSize = { xs: "100px", md: "120px" };

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: imageSize,
        maxWidth: imageSize,
        height: imageSize,
        overflow: "hidden",
        border: `2px solid ${butterflyBlue[900]}`,
        borderRadius: "10px",
        "& img": {
          borderRadius: "10px",
        },
        ...(variant === "circle"
          ? {
              borderRadius: "50%",
              "& img": {
                borderRadius: "50%",
              },
            }
          : {}),
        ...sx,
      }}
    >
      {defaultValue && !hasError ? (
        <PadBox padding={{ padding: "2px" }}>
          <img
            alt=""
            src={defaultValue}
            onError={() => setHasError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </PadBox>
      ) : (
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%" }}
        >
          <Avatar sx={{ width: "93%", height: "93%" }} />
        </Stack>
      )}
    </Box>
  );
}
