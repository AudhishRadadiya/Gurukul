import {
  Button,
  ContentBox,
  PadBox,
  toasts,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  AddressBookFrom,
  type FormRef,
} from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFrom";
import { ADDRESS_BOOK_FIELD_MAPPINGS } from "@web/components/Address/address-book/AddressBook/addAddressBook/hooks/constants";
import { useAddAddressBook } from "@web/components/Address/address-book/AddressBook/addAddressBook/hooks/useAddAddressBook";
import { useGetPreviousAddressBookData } from "@web/components/Address/address-book/AddressBook/addAddressBook/hooks/useGetPreviousAddressBookData";
import { onError } from "@web/utils/errors";

export const AddAddressBook = () => {
  const router = useRouter();

  const { isMobile } = useGetDeviceType();

  const searchParams = useSearchParams();

  const donationId = searchParams.get("donation_id");

  const formRef = useRef<FormRef>(null);

  const { data: addressBookData, isLoading: isAddressBookLoading } =
    useGetPreviousAddressBookData({
      donationId: donationId ?? "",
    });

  useMemo(() => {
    if (addressBookData && formRef.current) {
      const { setValue } = formRef.current;

      const { business_detail: businessDetail, ...restAddressBookData } =
        addressBookData;

      const mappedAddressBookData = {
        ...restAddressBookData,
        ...(businessDetail && {
          business_detail: [
            {
              address: businessDetail.address,
              business_name: businessDetail.business_name,
              city: businessDetail.city,
              email: businessDetail.email,
              id: businessDetail.id ?? uuidv4(),
              pan: businessDetail.pan,
              pincode: businessDetail.pincode,
              state: businessDetail.state,
            },
          ],
        }),
      };

      ADDRESS_BOOK_FIELD_MAPPINGS.forEach(({ apiField, formField }) => {
        const value = mappedAddressBookData[apiField];

        if (value !== null) {
          setValue(formField, value, { shouldDirty: true });
        }
      });
    }
  }, [addressBookData]);

  const { isPending, mutate } = useAddAddressBook({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        toasts.success({ title: data.message });

        if (donationId) {
          router.push("/address/donor-address");

          return;
        }

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
      <PadBox padding={{ padding: { md: "20px", xs: "12px 10px" } }}>
        <Stack gap={{ md: "10px", xs: "8px" }}>
          <AddressBookFrom ref={formRef} loading={isAddressBookLoading} />

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
                  router.push("/address/address-book");
                }}
                sx={{ flex: { md: "0 0 auto", xs: "1 1 auto" } }}
              >
                {t("common.cancel.button")}
              </Button>

              <Button
                loading={isPending}
                size={isMobile ? "small" : "medium"}
                onClick={onCreateAddressBook}
                sx={{ flex: { md: "0 0 auto", xs: "1 1 auto" } }}
              >
                {t("common.save.button")}
              </Button>
            </Stack>
          </PadBox>
        </Stack>
      </PadBox>
    </ContentBox>
  );
};
