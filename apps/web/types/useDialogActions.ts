import { useState } from "react";

import type { DialogTypes } from "@web/types/dialogs";

export type UseDialogActionsFns = {
  onDialogClose: () => void;
  onDialogOpen: (config: DialogTypes) => void;
};

export function useDialogActions() {
  const [openedDialog, setOpenedDialog] = useState<DialogTypes>();

  const onDialogOpen = (dialogTypes: DialogTypes) =>
    setOpenedDialog(dialogTypes);

  const onDialogClose = () => setOpenedDialog(undefined);

  return {
    onDialogClose,
    onDialogOpen,
    openedDialog,
  };
}
