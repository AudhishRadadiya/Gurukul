import { Button, ContentBox, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import {
  AddressBookFrom,
  type FormRef,
} from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFrom";
import { useAddAddressBook } from "@web/components/Address/address-book/AddressBook/addAddressBook/hooks/useAddAddressBook";
import { onError } from "@web/utils/errors";

export const AddAddressBook = () => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { isPending, mutate } = useAddAddressBook({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/address/address-book");
      },
    },
  });

  const onCreateAddressBook = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <ContentBox>
      <PadBox padding={{ padding: "20px" }}>
        <Stack gap="10px">
          <AddressBookFrom ref={formRef} loading={false} />

          <PadBox padding={{ paddingRight: "20px" }}>
            <Stack direction="row" justifyContent="end" gap="10px">
              <Button
                variant="outlined"
                onClick={() => {
                  router.push("/address/address-book");
                }}
              >
                {t("common.cancel.button")}
              </Button>

              <Button loading={isPending} onClick={onCreateAddressBook}>
                {t("common.save.button")}
              </Button>
            </Stack>
          </PadBox>
        </Stack>
      </PadBox>
    </ContentBox>
  );
};
