import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRef } from "react";

import {
  useAddLayout,
  type AddLayoutRequest,
} from "@web/components/Address/address-book/template/dialogs/hooks/useAddLayout";
import type { ModuleName } from "@web/components/Address/address-book/template/dialogs/hooks/useGetLayoutList";
import {
  TemplateForm,
  type FormRef,
} from "@web/components/Address/address-book/template/dialogs/TemplateForm";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";

export type AddTemplateProps<T> = {
  columnHide: T;
  moduleName: ModuleName;
  onAddSuccess: () => void;
  onClose: () => void;
  open: boolean;
};

export const AddTemplate = <T extends Record<string, boolean>>({
  columnHide,
  moduleName,
  onAddSuccess,
  onClose,
  open,
}: AddTemplateProps<T>) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useAddLayout({
    options: {
      onError: (error) => {
        toasts.error({
          title: error.response
            ? error.response.data.message
            : t("common.error.default"),
        });
      },
      onSuccess: (data) => {
        onClose();
        onAddSuccess();

        toasts.success({ title: data.message });
      },
    },
  });

  const onCreateLayout = () => {
    formRef.current?.submitForm((formValues) => {
      const payload: AddLayoutRequest = {
        fields: columnHide,
        is_default: false,
        layout_name: formValues.template_name,
        module_name: moduleName,
      };

      mutate(payload);
    });
  };

  return (
    <Dialog
      maxWidth="xs"
      open={open}
      onClose={() => onClose()}
      title={t("common.template.add.title")}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <Button
            loading={isPending}
            onClick={onCreateLayout}
            disabled={isDisabled()}
          >
            {t("common.save.button")}
          </Button>
        </Stack>
      }
    >
      <TemplateForm ref={formRef} />
    </Dialog>
  );
};
