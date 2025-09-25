"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { MasterPageLayout } from "@web/components/common/responsive/MasterPageLayout";
import { AddSuvicharMasterDialog } from "@web/components/Donation/suvicharMaster/dialogs/AddSuvicharMasterDialog";
import { SuvicharMasterBreadcrumbs } from "@web/components/Donation/suvicharMaster/SuvicharMasterBreadcrumbs";
import { SuvicharMasterList } from "@web/components/Donation/suvicharMaster/suvicharMasterList/SuvicharMasterList";
import { suvicharMasterKeys } from "@web/queryKeysFactories/suvicharMaster";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddSuvicharMasterDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: suvicharMasterKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <MasterPageLayout
      onDialogOpen={onDialogOpen}
      openedDialog={openedDialog}
      dialogKey="add"
      btnLabel={t("common.button.add", {
        label: t("suvichar.menu.label"),
      })}
      breadcrumbs={<SuvicharMasterBreadcrumbs />}
      dialogRenderer={dialogRenderer}
      list={<SuvicharMasterList />}
      title={t("common.master.label", {
        label: t("suvichar.menu.label"),
      })}
    />
  );
}
