import _noop from "lodash/noop";
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useReducer,
} from "react";

import type { ButtonId } from "@web/app/context/DisabledButtonsCacheContext/buttonIds";

type DisabledButtonsCacheContextValue = {
  disable: (id: ButtonId) => void;
  enable: (id: ButtonId) => void;
  isDisabled: (id: ButtonId) => boolean;
};

type DisabledButtonsCacheProviderProps = {
  children: ReactNode;
};

type DisabledButtonsCacheReducerState = Record<ButtonId, boolean>;

type DisabledButtonsCacheReducerAction = {
  id: ButtonId;
  type: "enable" | "disable";
};

const DisabledButtonsCacheContext =
  createContext<DisabledButtonsCacheContextValue>({
    disable: _noop,
    enable: _noop,
    isDisabled: () => false,
  });

function disabledButtonsCacheReducer(
  state: DisabledButtonsCacheReducerState,
  action: DisabledButtonsCacheReducerAction
) {
  switch (action.type) {
    case "enable": {
      return { ...state, [action.id]: false };
    }

    case "disable": {
      return { ...state, [action.id]: true };
    }

    default:
      return state;
  }
}

export function DisabledButtonsCacheProvider({
  children,
}: Readonly<DisabledButtonsCacheProviderProps>) {
  const [state, dispatch] = useReducer<
    React.Reducer<
      DisabledButtonsCacheReducerState,
      DisabledButtonsCacheReducerAction
    >
  >(disabledButtonsCacheReducer, { onEdit: false, onSubmit: false });

  const enable = (id: ButtonId) => {
    dispatch({
      id,
      type: "enable",
    });
  };

  const disable = (id: ButtonId) => {
    dispatch({
      id,
      type: "disable",
    });
  };

  const isDisabled = (id: ButtonId) => {
    return state[id] || false;
  };

  const value = useMemo(() => {
    return { disable, enable, isDisabled };
  }, [state]);

  return (
    <DisabledButtonsCacheContext.Provider value={value}>
      {children}
    </DisabledButtonsCacheContext.Provider>
  );
}

export type UseDisabledButtonCacheReturn = {
  [K in keyof DisabledButtonsCacheContextValue]: () => ReturnType<
    DisabledButtonsCacheContextValue[K]
  >;
};

export function useDisabledButtonsCache(
  id: ButtonId
): UseDisabledButtonCacheReturn {
  const {
    disable: _disable,
    enable: _enable,
    isDisabled: _isDisabled,
  } = useContext<DisabledButtonsCacheContextValue>(DisabledButtonsCacheContext);

  return {
    disable: () => _disable(id),
    enable: () => _enable(id),
    isDisabled: () => _isDisabled(id),
  };
}
