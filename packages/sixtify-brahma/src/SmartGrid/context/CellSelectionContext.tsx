import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { CellSelectionState } from "../types";
import type { OnAction } from "../../utils/types";

type CellSelectionContextType = {
  clearCellSelection: OnAction;
  enabled: boolean;
  endCellSelection: OnAction;
  getCellSelectionData: () => string[][];
  isCellSelected: (rowId: string, columnId: string) => boolean;
  isCopyFlashing: boolean;
  selectionState: CellSelectionState;
  startCellSelection: (
    rowId: string,
    columnId: string,
    isShiftClick?: boolean
  ) => void;
  triggerCopyFlash: OnAction;
  updateCellSelection: (rowId: string, columnId: string) => void;
};

const CellSelectionContext = createContext<
  CellSelectionContextType | undefined
>(undefined);

type CellSelectionProviderProps = {
  children: ReactNode;
  value: CellSelectionContextType;
};

export const CellSelectionProvider = ({
  children,
  value,
}: CellSelectionProviderProps) => {
  return (
    <CellSelectionContext.Provider value={value}>
      {children}
    </CellSelectionContext.Provider>
  );
};

export const useCellSelectionContext = (): CellSelectionContextType => {
  const context = useContext(CellSelectionContext);

  if (!context) {
    throw new Error(
      "useCellSelectionContext must be used within CellSelectionProvider"
    );
  }

  return context;
};
