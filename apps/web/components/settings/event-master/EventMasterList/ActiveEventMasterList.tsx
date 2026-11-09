"use client";

import { useTheme } from "@mui/material";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { CloneEventMasterDialog } from "@web/components/settings/event-master/EventMasterList/Dialogs/CloneEventMasterDialog";
import { DeleteEventMasterDialog } from "@web/components/settings/event-master/EventMasterList/Dialogs/DeleteEventMasterDialog";
import { useEventMasterColumns } from "@web/components/settings/event-master/EventMasterList/hooks/useEventMasterColumns";
import { useGetActiveEventMaster } from "@web/components/settings/event-master/EventMasterList/hooks/useGetActiveEventMaster";
import type { EventMasterDetail } from "@web/components/settings/event-master/EventMasterList/hooks/useGetActiveEventMaster";
import { EVENT_MASTER_PERMISSION } from "@web/constants/permission/settings/eventMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

export const ActiveEventMasterList = () => {
  const theme = useTheme();

  const router = useRouter();

  const { red } = theme.palette.app.color;

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const [currentEventMaster, setCurrentEventMaster] =
    useState<EventMasterDetail>();

  const { data, isFetching, refetch } = useGetActiveEventMaster({
    endRow,
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { eventMasterDetail: rowData, totalCount } = data || {};

  const { column } = useEventMasterColumns();

  const dialogRenderer: DialogRenderer = {
    clone: currentEventMaster && (
      <CloneEventMasterDialog
        open
        event={currentEventMaster}
        onCloneSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),

    delete: currentEventMaster && (
      <DeleteEventMasterDialog
        open
        event={currentEventMaster}
        onDeleteSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<EventMasterDetail>
        defaultColDef={{
          cellStyle: ({ data }) => {
            if (!data?.is_active) {
              return {
                color: red[500],
              };
            }
          },
        }}
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={rowData}
        onPageChange={onPageChange}
        count={totalCount}
        onGridStateChange={setAgGridState}
        onRowsPerPageChange={onRowsPerPageChange}
        height={220}
        actions={[
          {
            isView: validateAccess(EVENT_MASTER_PERMISSION.EDIT),
            onClick: (data) => {
              router.push(
                `/settings/event-master/${data.event_master_id}?page=edit-event-master`
              );
            },
            title: t("common.edit"),
          },

          {
            isView: validateAccess(EVENT_MASTER_PERMISSION.DELETE),
            onClick: (data) => {
              onDialogOpen("delete");
              setCurrentEventMaster(data);
            },
            title: t("common.delete"),
          },
          {
            isView: true,
            onClick: (data) => {
              onDialogOpen("clone");
              setCurrentEventMaster(data);
            },
            title: t("common.clone"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

ActiveEventMasterList.displayName = "ActiveEventMasterList";
