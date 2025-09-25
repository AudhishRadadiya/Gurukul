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

import { AddDonationMasterDialog } from "@web/components/Donation/DonationMaster/Dialogs/AddDonationMasterDialog";
import { DonationMasterBreadcrumbs } from "@web/components/Donation/DonationMaster/DonationMasterBreadcrumbs";
import { DonationMasterList } from "@web/components/Donation/DonationMaster/DonationMasterList/DonationMasterList";
import { donationMasterKeys } from "@web/queryKeysFactories/donationMaster";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const queryClient = useQueryClient();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddDonationMasterDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: donationMasterKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <DonationMasterBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">
              {t("common.master.label", {
                label: t("donation.menu.label"),
              })}
            </Typography>

            <Stack direction="row" gap="5px">
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => {
                  onDialogOpen("add");
                }}
              >
                {t("common.button.add", {
                  label: t("common.master.label", {
                    label: t("donation.menu.label"),
                  }),
                })}
              </Button>
            </Stack>
          </Stack>
        </PadBox>

        <DonationMasterList />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
