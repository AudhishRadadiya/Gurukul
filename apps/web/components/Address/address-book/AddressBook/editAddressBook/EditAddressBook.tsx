import { Button, ContentBox, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import {
  AddressBookFrom,
  type FormRef,
} from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFrom";
import { useEditAddressBook } from "@web/components/Address/address-book/AddressBook/editAddressBook/hooks/useEditAddressBook";
import { useGetAddressBookDetails } from "@web/components/Address/address-book/AddressBook/editAddressBook/hooks/useGetAddressBookDetails";
import { EditAction } from "@web/components/common/EditAction";
import { onError } from "@web/utils/errors";

type EditAddressBookProps = {
  addressBookId: string;
};

export const EditAddressBook = ({ addressBookId }: EditAddressBookProps) => {
  const formRef = useRef<FormRef>(null);

  const router = useRouter();

  const { data: addressBookData, isLoading: isUserMasterLoading } =
    useGetAddressBookDetails({
      addressBookId,
    });

  const { isPending, mutate } = useEditAddressBook({
    addressBookId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: async (data) => {
        toasts.success({ title: data.message });
        router.push("/address/address-book?tab=address-list");
      },
    },
  });

  const onEditAddressBook = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <ContentBox>
      <PadBox padding={{ padding: "20px" }}>
        <Stack gap="10px">
          <AddressBookFrom
            ref={formRef}
            defaultValues={addressBookData}
            loading={isUserMasterLoading}
          />

          <PadBox padding={{ paddingRight: "20px" }}>
            <Stack direction="row" justifyContent="end" gap="10px">
              <Button
                variant="outlined"
                onClick={() => {
                  router.push("/address/address-book?tab=address-list");
                }}
              >
                {t("common.cancel.button")}
              </Button>

              <EditAction onClick={onEditAddressBook} loading={isPending} />
            </Stack>
          </PadBox>
        </Stack>
      </PadBox>
    </ContentBox>
  );
};
