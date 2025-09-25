import { toasts } from "@codezee/sixtify-brahma";
import { useQueryClient } from "@tanstack/react-query";
import type { FilterModel } from "ag-grid-community";
import { useEffect, useState } from "react";

import { useDonorAddressColumns } from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useDonorAddressColumns";
import { useEditDonorAddress } from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useEditDonorAddress";
import {
  type DonorAddress,
  useGetDonorAddress,
} from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useGetDonorAddress";
import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import type { Status } from "@web/components/common/Autocomplete/hooks/useGetStatusOptions";
import { donorAddressKeys } from "@web/queryKeysFactories/donorAddress";
import { onError } from "@web/utils/errors";

export type DonorAddressListProps = {
  setSelectedRows: (pre: string[]) => void;
  status: Status;
};

export const DonorAddressList = ({
  setSelectedRows,
  status,
}: DonorAddressListProps) => {
  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const queryClient = useQueryClient();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetDonorAddress({
    endRow,
    filterModel: agGridFilterModel,
    startRow,
    status,
  });

  const { donorAddressList, totalCount } = data || {};

  const { mutate } = useEditDonorAddress({
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        refetch();
        toasts.success({ title: data.message });
      },
    },
  });

  const { column } = useDonorAddressColumns({
    onAction: (donorAddress) => {
      mutate({
        donationId: donorAddress.donation_id,
        formValues: { is_ignored: !donorAddress.is_ignored },
      });
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: donorAddressKeys.listing(),
    });
  }, [status]);

  return (
    <AgGridV2<DonorAddress>
      rowSelection="multiple"
      getRowId={(params) => params.data.contact_id}
      isLoading={isFetching}
      page={page}
      columnDefs={column}
      onSelectionChanged={setSelectedRows}
      rowsPerPage={rowsPerPage}
      rowData={donorAddressList}
      onPageChange={onPageChange}
      count={totalCount}
      onRowsPerPageChange={onRowsPerPageChange}
      onFilterChange={setAgGridFilterModel}
      height={200}
    />
  );
};
