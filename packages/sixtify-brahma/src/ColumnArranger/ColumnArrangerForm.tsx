import { useMemo, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ColumnArranger } from "./ColumnArranger";
import type {
  ColumnArrangerFormProps,
  SimpleColDef,
} from "./ColumnArrangerDialog";

type FormValues = {
  columns: SimpleColDef[];
};

export function ColumnArrangerForm({
  columns,
  children,
}: ColumnArrangerFormProps) {
  const lockedColumns = useMemo(
    () => columns.filter((col) => !("hide" in col)),
    [columns]
  );

  const unlockedColumns = useMemo(
    () =>
      columns
        .filter((col) => "hide" in col)
        .map((col) => ({
          ...col,
          hide: !col.hide,
        })),
    [columns]
  );

  const initialUnlockedColumnsRef = useRef(unlockedColumns);

  const { control, reset, getValues, setValue } = useForm<FormValues>({
    defaultValues: {
      columns: initialUnlockedColumnsRef.current,
    },
  });

  const wrappedReset = (
    values?: SimpleColDef | SimpleColDef[] | Record<string, unknown>
  ) => {
    reset({
      columns: values
        ? // eslint-disable-next-line sonarjs/no-nested-conditional
          Array.isArray(values)
          ? values
          : [values as SimpleColDef]
        : initialUnlockedColumnsRef.current,
    });
  };

  const { fields } = useFieldArray({
    name: "columns",
    control,
  });

  useMemo(() => {
    setValue("columns", unlockedColumns);
  }, [columns]);

  return children({
    reset: wrappedReset,
    getValues,
    columnList: (
      <ColumnArranger
        fields={fields}
        lockedColumns={lockedColumns}
        control={control}
      />
    ),
  });
}
