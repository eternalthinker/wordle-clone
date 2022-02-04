import React from "react";
import { rootReducer } from "../reducer/root_reducer";
import { Action, createInitialState } from "../reducer/root_state";

export type DispatchType = React.Dispatch<Action>;


const initialState = createInitialState();

export const RootContext = React.createContext({
  state: initialState,
  dispatch: (() => initialState) as DispatchType,
});

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(rootReducer, initialState);

  const store = React.useMemo(() => ({ state, dispatch }), [state]);

  return <RootContext.Provider value={store}>{children}</RootContext.Provider>;
};
