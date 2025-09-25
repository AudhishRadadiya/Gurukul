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

import { BankMasterBreadcrumbs } from "@web/components/Donation/BankMaster/BankMasterBreadcrumbs";
import { BankMasterList } from "@web/components/Donation/BankMaster/BankMasterList/BankMasterList";
import { AddBankMasterDialog } from "@web/components/Donation/BankMaster/Dialogs/AddBankMasterDialog";
import { bankMasterKeys } from "@web/queryKeysFactories/bankMaster";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const queryClient = useQueryClient();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddBankMasterDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: bankMasterKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <BankMasterBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">
              {t("common.master.label", {
                label: t("bank.menu.label"),
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
                    label: t("bank.menu.label"),
                  }),
                })}
              </Button>
            </Stack>
          </Stack>
        </PadBox>

        <BankMasterList />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
