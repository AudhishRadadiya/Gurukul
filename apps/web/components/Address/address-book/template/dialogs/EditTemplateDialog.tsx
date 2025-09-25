import type { TabModel } from "@codezee/sixtify-brahma";
import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useMemo, useRef } from "react";

import type { EditLayoutRequest } from "@web/components/Address/address-book/template/dialogs/hooks/useEditLayout";
import { useEditLayout } from "@web/components/Address/address-book/template/dialogs/hooks/useEditLayout";
import {
  type FormRef,
  TemplateForm,
  type TemplateFormFieldValues,
} from "@web/components/Address/address-book/template/dialogs/TemplateForm";
import { EditAction } from "@web/components/common/EditAction";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";

export type EditTemplateDialogProps<T> = {
  columnHide: T;
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
  templateData: TabModel;
};

export const EditTemplateDialog = <T extends Record<string, boolean>>({
  columnHide,
  onClose,
  onEditSuccess,
  open,
  templateData,
}: EditTemplateDialogProps<T>) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useEditLayout({
    layoutId: templateData.value,
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
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onEditTemplate = () => {
    formRef.current?.submitForm((formValues) => {
      const payload: EditLayoutRequest = {
        fields: columnHide,
        is_default: false,
        layout_name: formValues.template_name,
      };

      mutate(payload);
    });
  };

  const defaultValues = useMemo(() => {
    const templateFormFieldValues: TemplateFormFieldValues = {
      template_name: templateData.label,
    };

    return templateFormFieldValues;
  }, [templateData]);

  return (
    <Dialog
      maxWidth="xs"
      open={open}
      title={t("common.template.edit.title")}
      onClose={() => onClose()}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            loading={isPending}
            onClick={onEditTemplate}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <TemplateForm ref={formRef} defaultValues={defaultValues} />
    </Dialog>
  );
};
