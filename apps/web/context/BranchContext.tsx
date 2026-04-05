import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type BranchContextType = {
  branchIds: string;
  setBranchIds: (ids: string) => void;
};

const BranchContext = createContext<BranchContextType | undefined>(undefined);

const BRANCH_IDS_STORAGE_KEY = "selectedBranchIds";

type BranchProviderProps = {
  children: ReactNode;
};

const getInitialBranchIds = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(BRANCH_IDS_STORAGE_KEY) ?? "";
  }

  return "";
};

export const BranchProvider = ({ children }: BranchProviderProps) => {
  // Initialize from localStorage if available
  const [branchIds, setBranchIds] = useState<string>(getInitialBranchIds());

  // Update localStorage whenever branchIds changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (branchIds) {
        localStorage.setItem(BRANCH_IDS_STORAGE_KEY, branchIds);
      } else {
        localStorage.removeItem(BRANCH_IDS_STORAGE_KEY);
      }
    }
  }, [branchIds]);

  return (
    // eslint-disable-next-line sonarjs/jsx-no-constructed-context-values
    <BranchContext.Provider value={{ branchIds, setBranchIds }}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = (): BranchContextType => {
  const context = useContext(BranchContext);

  if (context === undefined) {
    throw new Error("useBranch must be used within a BranchProvider");
  }

  return context;
};
