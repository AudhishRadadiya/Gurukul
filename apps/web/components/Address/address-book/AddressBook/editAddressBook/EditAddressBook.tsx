import {
  Button,
  ContentBox,
  PadBox,
  toasts,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
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

  const { isMobile } = useGetDeviceType();

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
      <PadBox padding={{ padding: { md: "20px", xs: "12px 10px" } }}>
        <Stack gap={{ md: "10px", xs: "8px" }}>
          <AddressBookFrom
            ref={formRef}
            defaultValues={addressBookData}
            loading={isUserMasterLoading}
          />

          <PadBox padding={{ paddingRight: { md: "20px", xs: 0 } }}>
            <Stack
              direction="row"
              justifyContent={{ md: "flex-end", xs: "stretch" }}
              gap={1}
              flexWrap="wrap"
              sx={{ width: "100%" }}
            >
              <Button
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                onClick={() => {
                  router.push("/address/address-book?tab=address-list");
                }}
                sx={{ flex: { md: "0 0 auto", xs: "1 1 auto" } }}
              >
                {t("common.cancel.button")}
              </Button>

              <EditAction
                onClick={onEditAddressBook}
                loading={isPending}
                size={isMobile ? "small" : "medium"}
              />
            </Stack>
          </PadBox>
        </Stack>
      </PadBox>
    </ContentBox>
  );
};
