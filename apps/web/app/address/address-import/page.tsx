"use client";

import { Stack } from "@mui/material";

import { AddressImport } from "@web/components/Address/addressImport/AddressImport";
import { AddressImportBreadcrumbs } from "@web/components/Address/addressImport/AddressImportBreadcrumbs";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  return (
    <Stack gap="20px">
      <AddressImportBreadcrumbs />

      <AddressImport />
    </Stack>
  );
}
