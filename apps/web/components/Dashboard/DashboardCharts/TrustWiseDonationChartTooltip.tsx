import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useAxesTooltip } from "@mui/x-charts/ChartsTooltip";

export const TrustWiseDonationChartTooltip = () => {
  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  const tooltipData = useAxesTooltip();

  if (tooltipData === null) {
    return null;
  }

  return (
    <Box
      bgcolor="background.paper"
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        minWidth: 220,
        px: 1.5,
        py: 1,
      }}
    >
      {tooltipData.map(({ axisFormattedValue, axisId, seriesItems }) => {
        return (
          <Box key={axisId}>
            {axisFormattedValue != null && (
              <Typography variant="subtitle2" sx={{ mb: 0.75 }}>
                {axisFormattedValue}
              </Typography>
            )}

            <Stack gap={0.75}>
              {seriesItems.map(
                ({ color, formattedLabel, formattedValue, seriesId }) => {
                  if (formattedValue == null) {
                    return null;
                  }

                  const [amountLine, ...modeLines] =
                    String(formattedValue).split("\n");

                  return (
                    <Stack
                      key={seriesId}
                      direction="row"
                      alignItems="flex-start"
                      justifyContent="space-between"
                      gap={2}
                    >
                      <Box minWidth={0}>
                        <Stack direction="row" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              bgcolor: color,
                              borderRadius: 0.5,
                              flexShrink: 0,
                              height: 12,
                              width: 12,
                            }}
                          />
                          <Typography variant="body2" noWrap>
                            {formattedLabel ?? ""}
                          </Typography>
                        </Stack>

                        {modeLines.length > 0 && (
                          <Box sx={{ ml: "20px" }}>
                            {modeLines.map((line) => {
                              const [mode, amount] = line.split(":") ?? [];

                              return (
                                <Stack
                                  key={mode}
                                  direction="row"
                                  gap={1}
                                  alignItems="center"
                                >
                                  <Typography
                                    key={mode}
                                    variant="caption"
                                    sx={{
                                      color: slate[500],
                                      fontSize: 12,
                                    }}
                                  >
                                    {mode}:
                                  </Typography>

                                  <Typography
                                    key={mode}
                                    variant="caption"
                                    sx={{
                                      display: "block",
                                      fontSize: 12,
                                    }}
                                  >
                                    {amount}
                                  </Typography>
                                </Stack>
                              );
                            })}
                          </Box>
                        )}
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, whiteSpace: "nowrap" }}
                      >
                        {amountLine}
                      </Typography>
                    </Stack>
                  );
                }
              )}
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
};
