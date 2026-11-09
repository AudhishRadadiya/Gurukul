import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { useCreateContact } from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useCreateContact";
import { AddressTypeAutocomplete } from "@web/components/common/Autocomplete/AddressTypeAutocomplete";
import { onError } from "@web/utils/errors";
import { errorMessages } from "@web/utils/helper";

const CreateContactFormSchema = z.object({
  address_type_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

type CreateContactFormValues = z.infer<typeof CreateContactFormSchema>;

type CreateContactDialogProps = {
  donorAddressIds: string[];
  onClose: () => void;
  onSaveSuccess: () => void;
  open: boolean;
};

export const CreateContactDialog = ({
  donorAddressIds,
  onClose,
  onSaveSuccess,
  open,
}: CreateContactDialogProps) => {
  const formMethods = useForm<CreateContactFormValues>({
    defaultValues: {
      address_type_id: null,
    },
    mode: "all",
    resolver: zodResolver(CreateContactFormSchema),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  const { address_type_id } = errors;

  const { isPending, mutate } = useCreateContact({
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        onSaveSuccess();
        onClose();
        toasts.success({ title: data.message });
      },
    },
  });

  const onSave = () => {
    handleSubmit((formValues) => {
      mutate({
        address_type_id: formValues.address_type_id!,
        donation_ids: donorAddressIds,
      });
    })();
  };

  return (
    <FormProvider {...formMethods}>
      <Dialog
        maxWidth="xs"
        title={`${t("common.create")} ${t("contact.label")}`}
        open={open}
        onClose={onClose}
        actions={
          <ButtonContainer>
            <Button onClick={onClose} variant="outlined">
              {t("common.cancel.button")}
            </Button>

            <Button loading={isPending} onClick={onSave}>
              {t("common.save.button")}
            </Button>
          </ButtonContainer>
        }
      >
        <AddressTypeAutocomplete
          label={t("common.address.type")}
          name="address_type_id"
          control={control}
          required
          error={!!address_type_id}
          helperText={errorMessages(address_type_id?.message)}
        />
      </Dialog>
    </FormProvider>
  );
};
