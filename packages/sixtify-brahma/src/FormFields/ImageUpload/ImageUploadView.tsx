import { Avatar, Box, Stack, useTheme } from "@mui/material";
import { PadBox } from "../../PadBox";
import { useState } from "react";

export type ImageUploadViewProps = Readonly<{
  defaultValue?: string;
  variant: string;
}>;
export function ImageUploadView({
  defaultValue,
  variant,
}: ImageUploadViewProps) {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const [hasError, setHasError] = useState(false);

  return (
    <Box
      sx={{
        height: "120px",
        minWidth: "120px",
        maxWidth: "120px",
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
