import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions, useGetDeviceType } from "@codezee/sixtify-brahma";
import { Box } from "@mui/material";
import { t } from "i18next";
import { useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import type { AddressBookFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFrom";
import { DeleteBusinessDetailDialog } from "@web/components/Address/address-book/AddressBook/addAddressBook/businessDetail/businessDetailList/Dialog/DeleteBusinessDetailDialog";
import { EditBusinessDetailDialog } from "@web/components/Address/address-book/AddressBook/addAddressBook/businessDetail/businessDetailList/Dialog/EditBusinessDetailDialog";
import { useBusinessDetailListColumns } from "@web/components/Address/address-book/AddressBook/addAddressBook/businessDetail/businessDetailList/hooks/useBusinessDetailListColumns";
import type { BusinessDetailFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/businessDetail/Dialog/BusinessDetailForm";
import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";

type BusinessDetailListProps = {
  businessDetailFormValues: BusinessDetailFormFieldValues[];
  isFetching?: boolean;
  setValue: UseFormSetValue<AddressBookFormFieldValues>;
};

export const BusinessDetailList = ({
  businessDetailFormValues,
  isFetching = false,
  setValue,
}: BusinessDetailListProps) => {
  const { isMobile } = useGetDeviceType();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentBusinessDetail, setCurrentBusinessDetail] =
    useState<BusinessDetailFormFieldValues>();

  const { column } = useBusinessDetailListColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentBusinessDetail && (
      <DeleteBusinessDetailDialog
        open
        setValue={setValue}
        onClose={onDialogClose}
        businessDetail={currentBusinessDetail}
        businessDetailFormValues={businessDetailFormValues}
      />
    ),

    edit: currentBusinessDetail && (
      <EditBusinessDetailDialog
        open
        onClose={onDialogClose}
        businessDetail={currentBusinessDetail}
        onEdit={(formValues) => {
          const businessDetailData = businessDetailFormValues.map(
            (businessDetail) => {
              if (
                businessDetail.business_detail_id ===
                currentBusinessDetail.business_detail_id
              ) {
                return { ...businessDetail, ...formValues };
              }

              return businessDetail;
            }
          );

          setValue("business_detail", businessDetailData);
          onDialogClose();
        }}
      />
    ),
  };

  return (
    <>
      <Box sx={{ overflow: "hidden", width: "100%" }}>
        <AgGridV2<BusinessDetailFormFieldValues>
          isLoading={isFetching}
          rowData={businessDetailFormValues}
          columnDefs={column}
          height={isMobile ? 500 : 300}
          actions={[
            {
              onClick: (data) => {
                onDialogOpen("edit");
                setCurrentBusinessDetail(data);
              },
              title: t("common.edit"),
            },
            {
              onClick: (data) => {
                onDialogOpen("delete");
                setCurrentBusinessDetail(data);
              },
              title: t("common.delete"),
            },
          ]}
        />
      </Box>
      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
