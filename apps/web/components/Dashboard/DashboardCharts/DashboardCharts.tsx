import { ContentBox, PadBox, TextField } from "@codezee/sixtify-brahma";
import { Divider, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { useForm } from "react-hook-form";

import { DonationModeAutocomplete } from "@web/components/common/Autocomplete/DonationModeAutocomplete";
import { TrustAutocompleteFromMultipleBranch } from "@web/components/common/Autocomplete/TrustAutocompleteFromMultipleBranch";
import { useGetTrustWiseDonationChartData } from "@web/components/Dashboard/DashboardCharts/hooks/useGetTrustWiseDonationChartData";
import { TrustWiseDonationChart } from "@web/components/Dashboard/DashboardCharts/TrustWiseDonationChart";

type DashboardChartsFilterValues = {
  days: number;
  donation_mode_ids: string[];
  trust_ids: string[];
};

type DashboardChartsArgs = {
  branchIds: string;
};

const formDefaultValues: DashboardChartsFilterValues = {
  days: 7,
  donation_mode_ids: [],
  trust_ids: [],
};

export const DashboardCharts = ({ branchIds }: DashboardChartsArgs) => {
  const theme = useTheme();

  const { black } = theme.palette.app.color;

  const { control, watch } = useForm<DashboardChartsFilterValues>({
    defaultValues: formDefaultValues,
  });

  const days = watch("days");

  const trustId = watch("trust_ids");

  const donationModeId = watch("donation_mode_ids");

  const { data, isLoading } = useGetTrustWiseDonationChartData({
    branch_id: [branchIds],
    ...(days && { days }),
    donation_mode_ids: donationModeId,
    trust_ids: trustId,
  });

  return (
    <ContentBox>
      <PadBox padding={{ padding: "10px" }}>
        <Stack
          direction={{ sm: "row", xs: "column" }}
          gap="10px"
          alignItems={{ sm: "center", xs: "stretch" }}
          justifyContent="space-between"
        >
          <Typography
            variant="body1"
            fontWeight={500}
            sx={{ flexShrink: 0, whiteSpace: { sm: "normal", xs: "nowrap" } }}
          >
            {t("trust.wise.donation.label")}
          </Typography>

          <Stack
            direction={{ md: "row", xs: "column" }}
            gap="10px"
            alignItems={{ md: "center", xs: "stretch" }}
            width={{ sm: "auto", xs: "100%" }}
            minWidth={0}
          >
            <TextField
              control={control}
              type="number"
              name="days"
              label={t("days")}
              containerProps={{
                width: { md: "100px", xs: "100%" },
              }}
            />

            <TrustAutocompleteFromMultipleBranch
              label={t("trust.label")}
              name="trust_ids"
              control={control}
              multiple
              limitTags={1}
              branchIds={[branchIds]}
              sx={{
                minWidth: { md: "220px", xs: 0 },
                width: { md: "220px", xs: "100%" },
              }}
            />

            <DonationModeAutocomplete
              name="donation_mode_ids"
              control={control}
              limitTags={1}
              multiple
              sx={{
                minWidth: { md: "220px", xs: 0 },
                width: { md: "220px", xs: "100%" },
              }}
            />
          </Stack>
        </Stack>
      </PadBox>

      <Divider color={black[900]} />

      <TrustWiseDonationChart
        loading={isLoading}
        trustWiseDonationData={data}
      />
    </ContentBox>
  );
};
