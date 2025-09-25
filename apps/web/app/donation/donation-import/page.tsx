"use client";

import { Stack } from "@mui/material";

import { DonationImport } from "@web/components/Donation/donationImport/DonationImport";
import { DonationImportBreadcrumbs } from "@web/components/Donation/donationImport/DonationImportBreadcrumbs";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  return (
    <Stack gap="20px">
      <DonationImportBreadcrumbs />

      <DonationImport />
    </Stack>
  );
}
