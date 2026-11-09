import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useMemo, useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import {
  MetaWhatsappTemplateForm,
  type FormRef,
} from "@web/components/settings/metaWhatsappTemplate/dialogs/MetaWhatsappTemplateForm";
import { useEditMetaWhatsappTemplate } from "@web/components/settings/metaWhatsappTemplate/MetaWhatsappTemplateList/dialogs/hooks/useEditMetaWhatsappTemplate";
import { useGetMetaWhatsappTemplateDetails } from "@web/components/settings/metaWhatsappTemplate/MetaWhatsappTemplateList/dialogs/hooks/useGetMetaWhatsappTemplateDetails";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditMetaWhatsappTemplateDialogProps = {
  metaWhatsappTemplateId: string;
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
};

export const EditMetaWhatsappTemplateDialog = ({
  metaWhatsappTemplateId,
  onClose,
  onEditSuccess,
  open,
}: EditMetaWhatsappTemplateDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: metaWhatsappTemplateData, isPending: isLoadingDetails } =
    useGetMetaWhatsappTemplateDetails({
      metaWhatsappTemplateId,
    });

  const editFormDefaultValues = useMemo(() => {
    if (metaWhatsappTemplateData) {
      if (metaWhatsappTemplateData.variable_mapping) {
        const variableTemplates = Object.values(
          metaWhatsappTemplateData.variable_mapping
        ).map((value) => ({
          temp_variable_parameter: value,
          variable_mapping: value,
        }));

        return {
          ...metaWhatsappTemplateData,
          variable_templates: variableTemplates,
        };
      }

      return metaWhatsappTemplateData;
    }
  }, [metaWhatsappTemplateData]);

  const { isPending, mutate } = useEditMetaWhatsappTemplate({
    metaWhatsappTemplateId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onEdit = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title={t("common.edit.label", {
        label: t("metaWhatsappTemplate.label"),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEdit}
            loading={isPending}
            disabled={isDisabled()}
          />
        </ButtonContainer>
      }
    >
      <MetaWhatsappTemplateForm
        ref={formRef}
        defaultValues={editFormDefaultValues}
        loading={isLoadingDetails}
      />
    </Dialog>
  );
};
