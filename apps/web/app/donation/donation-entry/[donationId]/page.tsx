"use client";

import { Breadcrumbs, Card, PadBox, SvgHome } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";

import { EditDonationEntry } from "@web/components/Donation/donationEntry/editDonationEntry/EditDonationEntry";

export type PageProps = Readonly<{
  params: {
    donationId: string;
  };
}>;

// eslint-disable-next-line import/no-default-export
export default function Page({ params }: PageProps) {
  const { donationId } = params;

  const router = useRouter();

  return (
    <Stack gap="10px">
      <Breadcrumbs
        items={[
          {
            icon: <SvgHome />,
            onClick: () => {
              router.push("/");
            },
          },
          {
            text: t("donation.menu.label"),
          },
          {
            onClick: () => {
              router.push("/donation/donation-entry");
            },
            text: t("donation.entry.label"),
          },
          {
            text: t("common.edit.label", {
              label: t("donation.entry.label"),
            }),
          },
        ]}
      />

      <Card heading={t("donation.entry.label")}>
        <PadBox padding={{ padding: "15px" }}>
          <EditDonationEntry donationId={donationId} />
        </PadBox>
      </Card>
    </Stack>
  );
}
