import _compact from "lodash/compact";
import _join from "lodash/join";
import { useFormContext } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import type { AddressDetail } from "@web/components/Event/eventDonationEntry/dialogs/addressDetailDialog/hooks/useGetAddressDetail";
import { useGetAddressDetail } from "@web/components/Event/eventDonationEntry/dialogs/addressDetailDialog/hooks/useGetAddressDetail";
import { useAddressDetailListColumns } from "@web/components/Event/eventDonationEntry/dialogs/addressDetailDialog/useAddressDetailListColumns";

type AddressDetailListProps = {
  idField: string;
  nameField: string;
  onClose: () => void;
};

const responseFields = [
  "contact_no",
  "city",
  "address",
  "contact_id",
  "first_name",
  "middle_name",
  "surname",
];

export const AddressDetailList = ({
  idField,
  nameField,
  onClose,
}: AddressDetailListProps) => {
  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const methods = useFormContext();

  const { clearErrors, setValue } = methods;

  const { data, isFetching } = useGetAddressDetail({
    endRow,
    responseFields,
    startRow,
  });

  const { addressBookDetails, totalCount } = data;

  const { column } = useAddressDetailListColumns({
    onAction: (donor) => {
      const { contact_id, first_name, middle_name, surname } = donor;

      const fullName = _join(_compact([first_name, middle_name, surname]), " ");

      setValue(idField, contact_id, {
        shouldDirty: true,
      });

      setValue(nameField, fullName, {
        shouldDirty: true,
      });

      onClose();

      clearErrors([idField, nameField]);
    },
  });

  return (
    <AgGridV2<AddressDetail>
      isLoading={isFetching}
      page={page}
      count={totalCount}
      columnDefs={column}
      rowData={addressBookDetails}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      height={315}
    />
  );
};
