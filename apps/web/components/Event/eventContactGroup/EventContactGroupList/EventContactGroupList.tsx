import { useGetDeviceType } from "@codezee/sixtify-brahma";
import { Box } from "@mui/material";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DeleteEventContactGroupDialog } from "@web/components/Event/eventContactGroup/EventContactGroupList/Dialogs/DeleteEventContactGroupDialog";
import { EditEventContactGroupDialog } from "@web/components/Event/eventContactGroup/EventContactGroupList/Dialogs/EditEventContactGroupDialog";
import { useEventContactGroupColumns } from "@web/components/Event/eventContactGroup/EventContactGroupList/hooks/useEventContactGroupColumns";
import type { EventContactGroup } from "@web/components/Event/eventContactGroup/EventContactGroupList/hooks/useGetEventContactGroup";
import { useGetEventContactGroup } from "@web/components/Event/eventContactGroup/EventContactGroupList/hooks/useGetEventContactGroup";
import { EVENT_CONTACT_DETAIL_PERMISSION } from "@web/constants/permission/settings/eventContactDetail/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

export const EventContactGroupList = () => {
  const { isMobile } = useGetDeviceType();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { validateAccess } = useUserPermissions();

  const [currentEventContactGroup, setCurrentEventContactGroup] =
    useState<EventContactGroup>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetEventContactGroup({
    endRow,
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { contactDetails, totalCount } = data || {};

  const { column } = useEventContactGroupColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentEventContactGroup && (
      <DeleteEventContactGroupDialog
        open
        eventContactDetail={currentEventContactGroup}
        onDeleteSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),

    edit: currentEventContactGroup && (
      <EditEventContactGroupDialog
        open
        eventContactGroupId={currentEventContactGroup.event_contact_detail_id}
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <Box sx={{ overflow: "hidden", width: "100%" }}>
        <AgGridV2<EventContactGroup>
          isLoading={isFetching}
          page={page}
          columnDefs={column}
          rowsPerPage={rowsPerPage}
          rowData={contactDetails}
          onPageChange={onPageChange}
          count={totalCount}
          onRowsPerPageChange={onRowsPerPageChange}
          onGridStateChange={setAgGridState}
          height={isMobile ? 190 : 160}
          actions={[
            {
              isView: validateAccess(EVENT_CONTACT_DETAIL_PERMISSION.EDIT),
              onClick: (data) => {
                onDialogOpen("edit");
                setCurrentEventContactGroup(data);
              },
              title: t("common.edit"),
            },
            {
              isView: validateAccess(EVENT_CONTACT_DETAIL_PERMISSION.DELETE),
              onClick: (data) => {
                onDialogOpen("delete");
                setCurrentEventContactGroup(data);
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
