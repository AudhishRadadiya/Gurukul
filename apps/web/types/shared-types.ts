import type { IGetRowsParams } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";

import type { QuickFilter } from "@web/types/agGrid";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

export type SetStateAction<T> = (value: T | ((prevState: T) => T)) => void;

export type AgGridActionItems = {
  onClick: () => void;
  title: string;
};

export type TabPermission = {
  permission: string;
  tab: string;
};

export type GetListArgsAg2 = Partial<
  IGetRowsParams & {
    endRow: number;
    externalFilter?: FieldValues & {
      branch_id?: string[];
    };
    is_active: boolean;
    responseFields: string[];
    startRow: number;
  }
>;

export type EmptyApiSuccessResponse = ApiSuccessResponse<null>;

export type SelectedRecords = Record<string, boolean> | null;

export type FilType = "pdf" | "excel";

export type GetListArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        externalFilter?: FieldValues;
        is_active: boolean;
        responseFields: string[];
      }>;
};

export type GetExportPayload = {
  url: string;
};

export type RemoveNull<T> = {
  [K in keyof T]: Exclude<T[K], null>;
};
