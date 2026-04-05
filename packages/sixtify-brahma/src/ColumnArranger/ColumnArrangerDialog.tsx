import type { ColDef } from "ag-grid-community";
import _fromPairs from "lodash/fromPairs";
import { Button } from "../Button";
import { Dialog } from "../Dialog";
import { ButtonContainer } from "../Layouts";
import { ColumnArrangerForm } from "./ColumnArrangerForm";
import { useRefinedColumns } from "./hooks/useRefinedColumns";
import type { OnAction } from "../utils/types";

export type SimpleColDef = Pick<
  ColDef,
  | "field"
  | "headerName"
  | "hide"
  | "minWidth"
  | "filter"
  | "sortable"
  | "pinned"
>;

export type ColumnArrangerDialogProps<T extends Record<string, boolean>> = {
  open: boolean;
  columns: SimpleColDef[];
  onClose: OnAction;
  title?: string;
  onSave: (args: T) => void;
};

export type ColumnArrangerFormProps = {
  columns: SimpleColDef[];
  children: (args: {
    columnList: React.ReactNode;
    reset: (values?: SimpleColDef | Record<string, unknown>) => void;
    getValues: () => { columns: SimpleColDef[] };
  }) => JSX.Element;
};

export function ColumnArrangerDialog<T extends Record<string, boolean>>({
  columns,
  open,
  onClose,
  onSave,
  title = "Column Chooser",
}: Readonly<ColumnArrangerDialogProps<T>>) {
  const reFinedColumn = useRefinedColumns(columns);

  return (
    <ColumnArrangerForm columns={reFinedColumn}>
      {({ columnList, reset, getValues }) => (
        <Dialog
          title={title}
          open={open}
          onClose={() => {
            onClose();
            reset();
          }}
          maxWidth="xs"
          actions={
            <ButtonContainer
              sx={{
                justifyContent: "space-between",
                flex: 1,
              }}
            >
              <Button variant="outlined" onClick={() => reset()}>
                Reset
              </Button>

              <Button
                data-ptag="submit"
                data-cy="submit"
                onClick={() => {
                  const values = getValues();

                  const result = _fromPairs(
                    values.columns.map((col) => [col.field, col.hide])
                  ) as T;

                  onSave(result);

                  onClose();
                }}
              >
                Save
              </Button>
            </ButtonContainer>
          }
        >
          {columnList}
        </Dialog>
      )}
    </ColumnArrangerForm>
  );
}
