"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { ContentBox, PadBox, useDialogActions } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { BankMasterBreadcrumbs } from "@web/components/settings/BankMaster/BankMasterBreadcrumbs";
import { BankMasterList } from "@web/components/settings/BankMaster/BankMasterList/BankMasterList";
import { AddBankMasterDialog } from "@web/components/settings/BankMaster/Dialogs/AddBankMasterDialog";
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
              <ButtonLayoutProvider
                variant="outlined"
                onClick={() => {
                  onDialogOpen("add");
                }}
                label={t("common.button.add", {
                  label: t("common.master.label", {
                    label: t("bank.menu.label"),
                  }),
                })}
              />
            </Stack>
          </Stack>
        </PadBox>

        <BankMasterList />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
