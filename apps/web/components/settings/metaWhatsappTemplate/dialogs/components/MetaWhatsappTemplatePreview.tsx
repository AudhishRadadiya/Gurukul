import { ContentBox, PadBox } from "@codezee/sixtify-brahma";
import {
  Skeleton,
  Stack,
  Typography,
  useTheme,
  type Color,
} from "@mui/material";
import type { ReactNode } from "react";

const TEMPLATE_PLACEHOLDER_SPLIT_REGEX = /(\{\{\d+\}\})/g;

const TEMPLATE_PLACEHOLDER_TEST_REGEX = /^\{\{\d+\}\}$/;

const renderTemplateText = (text: string, textColor: Color): ReactNode => {
  const parts = text.split(TEMPLATE_PLACEHOLDER_SPLIT_REGEX);

  let cursor = 0;

  return parts.map((part) => {
    const isPlaceholder = TEMPLATE_PLACEHOLDER_TEST_REGEX.test(part);

    const key = `${cursor}-${part}`;

    cursor += part.length;

    if (!isPlaceholder) {
      return <span key={key}>{part}</span>;
    }

    return (
      <Typography
        key={key}
        component="span"
        sx={{
          color: textColor[800],
          fontWeight: 700,
          px: 0.75,
          py: 0.15,
          whiteSpace: "nowrap",
        }}
      >
        {part}
      </Typography>
    );
  });
};

type MetaWhatsappTemplatePreviewProps = {
  loading: boolean;
  text: string | null;
};

export const MetaWhatsappTemplatePreview = ({
  loading = false,
  text,
}: MetaWhatsappTemplatePreviewProps) => {
  const theme = useTheme();

  const { claude } = theme.palette.app.color;

  return (
    <ContentBox>
      <PadBox padding={{ padding: "10px" }}>
        <Stack gap="10px" alignItems="start" justifyContent="center">
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 800,
              letterSpacing: 0.9,
              textTransform: "uppercase",
            }}
          >
            Template Preview
          </Typography>

          <Stack
            alignItems="start"
            justifyContent="start"
            minHeight={260}
            width="100%"
            sx={{
              backgroundColor: claude[700],
              borderRadius: "6px",
            }}
          >
            <PadBox padding={{ padding: "10px" }}>
              {loading ? (
                <Stack width="100%">
                  <Skeleton variant="rounded" height={180} />
                </Stack>
              ) : (
                <ContentBox>
                  <PadBox padding={{ padding: "10px" }}>
                    {text ? (
                      <Typography
                        variant="body2"
                        sx={{
                          lineHeight: 1.45,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {renderTemplateText(text, claude)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Select a template to preview its content.
                      </Typography>
                    )}
                  </PadBox>
                </ContentBox>
              )}
            </PadBox>
          </Stack>
        </Stack>
      </PadBox>
    </ContentBox>
  );
};
