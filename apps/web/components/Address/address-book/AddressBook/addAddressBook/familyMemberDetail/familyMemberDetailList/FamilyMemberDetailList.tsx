import { useDialogActions, type DialogRenderer } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import type { AddressBookFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFrom";
import type { FamilyMemberFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/familyMemberDetail/Dialog/FamilyMemberForm";
import { DeleteFamilyMemberDetailDialog } from "@web/components/Address/address-book/AddressBook/addAddressBook/familyMemberDetail/familyMemberDetailList/Dialog/DeleteFamilyMemberDetailDialog";
import { EditFamilyMemberDetailDialog } from "@web/components/Address/address-book/AddressBook/addAddressBook/familyMemberDetail/familyMemberDetailList/Dialog/EditFamilyMemberDetailDialog";
import { useFamilyMemberColumns } from "@web/components/Address/address-book/AddressBook/addAddressBook/familyMemberDetail/familyMemberDetailList/hooks/useFamilyMemberColumns";
import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";

type FamilyMemberDetailListProps = {
  familyMemberFormValues: FamilyMemberFormFieldValues[];
  isFetching?: boolean;
  setValue: UseFormSetValue<AddressBookFormFieldValues>;
};

export const FamilyMemberDetailList = ({
  familyMemberFormValues,
  isFetching = false,
  setValue,
}: FamilyMemberDetailListProps) => {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentFamilyMemberDetail, setCurrentFamilyMemberDetail] =
    useState<FamilyMemberFormFieldValues>();

  const { column } = useFamilyMemberColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentFamilyMemberDetail && (
      <DeleteFamilyMemberDetailDialog
        open
        setValue={setValue}
        onClose={onDialogClose}
        familyMemberDetail={currentFamilyMemberDetail}
        familyMemberFormValues={familyMemberFormValues}
      />
    ),

    edit: currentFamilyMemberDetail && (
      <EditFamilyMemberDetailDialog
        open
        onClose={onDialogClose}
        familyMemberDetail={currentFamilyMemberDetail}
        onEdit={(formValues) => {
          const familyMemberData = familyMemberFormValues.map(
            (familyMemberDetailDetail) => {
              if (
                familyMemberDetailDetail.id === currentFamilyMemberDetail.id
              ) {
                return { ...familyMemberDetailDetail, ...formValues };
              }

              return familyMemberDetailDetail;
            }
          );

          setValue("family_detail", familyMemberData);
          onDialogClose();
        }}
      />
    ),
  };

  return (
    <>
      <AgGridV2<FamilyMemberFormFieldValues>
        isLoading={isFetching}
        rowData={familyMemberFormValues}
        columnDefs={column}
        height={300}
        actions={[
          {
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentFamilyMemberDetail(data);
            },
            title: t("common.edit"),
          },
          {
            onClick: (data) => {
              onDialogOpen("delete");
              setCurrentFamilyMemberDetail(data);
            },
            title: t("common.delete"),
          },
        ]}
      />
      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
