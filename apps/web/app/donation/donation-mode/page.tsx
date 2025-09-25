"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  Button,
  ContentBox,
  PadBox,
  useDialogActions,
} from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { AddDonationModeDialog } from "@web/components/Donation/DonationMode/Dialogs/AddDonationModeDialog";
import { DonationModeBreadcrumbs } from "@web/components/Donation/DonationMode/DonationModeBreadcrumbs";
import { DonationModeList } from "@web/components/Donation/DonationMode/DonationModeList/DonationModeList";
import { donationModeKeys } from "@web/queryKeysFactories/donationMode";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddDonationModeDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: donationModeKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <DonationModeBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">
              {t("common.mode.label", {
                label: t("donation.menu.label"),
              })}
            </Typography>

            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => {
                onDialogOpen("add");
              }}
            >
              {t("common.button.add", {
                label: t("common.mode.label", {
                  label: t("donation.menu.label"),
                }),
              })}
            </Button>
          </Stack>
        </PadBox>

        <DonationModeList />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
