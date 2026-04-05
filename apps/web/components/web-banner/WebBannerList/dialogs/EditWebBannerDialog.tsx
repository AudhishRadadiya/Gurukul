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
  formDefaultValues,
  WebBannerForm,
  type FormRef
} from "@web/components/web-banner/dialogs/WebBannerForm";
import { useEditWebBanner } from "@web/components/web-banner/WebBannerList/dialogs/hooks/useEditWebBanner";
import { useGetWebBannerDetails } from "@web/components/web-banner/WebBannerList/dialogs/hooks/useGetWebBannerDetails";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditWebBannerDialogProps = {
  bannerId: string;
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
};

const getDefaultDimensions = (position: number) => {
  switch (position) {
    case 1:
      return { image_height: 277, image_width: 684 };

    case 2:
      return { image_height: 222, image_width: 436 };

    case 3:
      return { image_height: 222, image_width: 235 };

    default:
      return { image_height: null, image_width: null };
  }
};

export const EditWebBannerDialog = ({
  bannerId,
  onClose,
  onEditSuccess,
  open,
}: EditWebBannerDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: webBannerData, isPending: isPendingWebBannerData } =
    useGetWebBannerDetails({
      bannerId,
    });

  const { isPending, mutate } = useEditWebBanner({
    bannerId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onEditWebBanner = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (webBannerData) {
      const orderedSlots = webBannerData?.slots && webBannerData.slots.length > 0 ? webBannerData.slots.map((slot, slotIndex) => {
        const position = slot.position ?? slotIndex + 1;

        const dimensions = getDefaultDimensions(position);

        return {
          ...slot,
          images: slot.images.map((image) => ({
            ...image,
            image_height: dimensions.image_height,
            image_url: image.image_url,
            image_width: dimensions.image_width,
            sequence_no: image.sequence_no,
          }))
        }
      }) : formDefaultValues.slots;

      return {
        ...formDefaultValues,
        ...webBannerData,
        slots: orderedSlots,
      };
    }
  }, [webBannerData]);

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title={t("common.edit.label", {
        label: t("web.banner.label"),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEditWebBanner}
            loading={isPending}
            disabled={isDisabled()}
          />
        </ButtonContainer>
      }
    >
      <WebBannerForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingWebBannerData}
      />
    </Dialog>
  );
};
