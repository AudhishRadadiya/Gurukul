import type { DialogRenderer, TabModel } from "@codezee/sixtify-brahma";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { FieldValues } from "react-hook-form";

import { AddTemplate } from "@web/components/Address/address-book/template/dialogs/AddTemplate";
import { DeleteTemplateDialog } from "@web/components/Address/address-book/template/dialogs/DeleteTemplateDialog";
import { EditTemplateDialog } from "@web/components/Address/address-book/template/dialogs/EditTemplateDialog";
import type {
  LayoutTemplate,
  ModuleName,
} from "@web/components/Address/address-book/template/dialogs/hooks/useGetLayoutList";
import { SaveTemplateDialog } from "@web/components/Address/address-book/template/dialogs/SaveTemplateDialog";

export type StoredTemplateType<T> = {
  columns: T;
  filterData?: FieldValues;
  id: string;
  template_name: string;
};

type UseGetDialogRendererArgs<T> = {
  columnHide: T;
  filterListData?: FieldValues;
  moduleName: ModuleName;
  onDialogClose: () => void;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<LayoutTemplate[], Error>>;
  selectedTemplate?: TabModel;
  setActiveTab: (value: number) => void;
  setSelectedTemplate: (data: TabModel) => void;
  setStoredTemplate?: React.Dispatch<
    React.SetStateAction<StoredTemplateType<T>[]>
  >;
  storedTemplate?: StoredTemplateType<T>[];
};

export const useGetDialogRenderer = <T extends Record<string, boolean>>({
  columnHide,
  moduleName,
  onDialogClose,
  refetch,
  selectedTemplate,
}: UseGetDialogRendererArgs<T>): DialogRenderer => ({
  addTemplate: (
    <AddTemplate
      moduleName={moduleName}
      columnHide={columnHide}
      open
      onClose={onDialogClose}
      onAddSuccess={() => {
        refetch();
        onDialogClose();
      }}
    />
  ),
  deleteTemplate: selectedTemplate && (
    <DeleteTemplateDialog
      open
      onClose={onDialogClose}
      onDeleteSuccess={() => {
        refetch();
        onDialogClose();
      }}
      templateData={selectedTemplate}
    />
  ),
  editTemplate: selectedTemplate && (
    <EditTemplateDialog
      open
      columnHide={columnHide}
      onClose={onDialogClose}
      onEditSuccess={() => {
        refetch();
        onDialogClose();
      }}
      templateData={selectedTemplate}
    />
  ),
  saveTemplate: selectedTemplate && (
    <SaveTemplateDialog
      open
      templateData={selectedTemplate}
      onSaveSuccess={() => {
        refetch();
        onDialogClose();
      }}
      onClose={onDialogClose}
      columnHide={columnHide}
    />
  ),
});
