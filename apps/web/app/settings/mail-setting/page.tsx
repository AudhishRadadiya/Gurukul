"use client";

import { Stack } from "@mui/material";

import { MailSetting } from "@web/components/settings/mailSetting/MailSetting";
import { MailSettingBreadcrumbs } from "@web/components/settings/mailSetting/MailSettingBreadcrumbs";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  return (
    <Stack gap="20px">
      <MailSettingBreadcrumbs />

      <MailSetting />
    </Stack>
  );
}
