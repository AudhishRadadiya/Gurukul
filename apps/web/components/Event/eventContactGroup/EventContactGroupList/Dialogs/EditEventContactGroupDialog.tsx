import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useMemo, useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import {
  EventContactGroupForm,
  type FormRef,
} from "@web/components/Event/eventContactGroup/Dialogs/EventContactGroupForm";
import { contactDetailItemDefaultValues } from "@web/components/Event/eventContactGroup/EventContactDetailFields/hooks/constant";
import { useEditEventContactGroup } from "@web/components/Event/eventContactGroup/EventContactGroupList/Dialogs/hooks/useEditEventContactGroup";
import { useGetEventContactGroupDetails } from "@web/components/Event/eventContactGroup/EventContactGroupList/Dialogs/hooks/useGetEventContactGroupDetails";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditEventContactGroupDialogProps = {
  eventContactGroupId: string;
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
};

export const EditEventContactGroupDialog = ({
  eventContactGroupId,
  onClose,
  onEditSuccess,
  open,
}: EditEventContactGroupDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isMobile } = useGetDeviceType();

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const {
    data: eventContactGroupData,
    isPending: isPendingEventContactGroupData,
  } = useGetEventContactGroupDetails({
    eventContactGroupId,
  });

  const { isPending, mutate } = useEditEventContactGroup({
    eventContactGroupId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onEditEventContactGroup = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const eventContactGroupFormValues = useMemo(() => {
    if (eventContactGroupData) {
      return {
        contact_detail: eventContactGroupData.contact_detail.length
          ? eventContactGroupData.contact_detail.map((item) => ({
              mobile_no: item.mobile_no,
              selected: false,
            }))
          : [contactDetailItemDefaultValues],
        excel_file: null,
        group_name: eventContactGroupData.group_name,
      };
    }
  }, [eventContactGroupData]);

  return (
    <Dialog
      maxWidth={isMobile ? "sm" : "lg"}
      onClose={onClose}
      open={open}
      title="Edit Event Contact Group"
      actions={
        <ButtonContainer>
          <Button
            onClick={onClose}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
          >
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEditEventContactGroup}
            loading={isPending}
            disabled={isDisabled()}
            size={isMobile ? "small" : "medium"}
          />
        </ButtonContainer>
      }
    >
      <EventContactGroupForm
        ref={formRef}
        defaultValues={eventContactGroupFormValues}
        loading={isPendingEventContactGroupData}
      />
    </Dialog>
  );
};
