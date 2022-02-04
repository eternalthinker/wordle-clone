import React from "react";
import { rootReducer } from "../reducer/root_reducer";
import { Action, createInitialState, Theme } from "../reducer/root_state";
import { LocalStorage } from "../utils/local_storage";

export type DispatchType = React.Dispatch<Action>;

const preferDarkTheme = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;
const storedTheme: Theme | null = LocalStorage.getItem("theme") as Theme;
const setDarkTheme = storedTheme === "dark" || preferDarkTheme;
const currentTheme = setDarkTheme ? "dark" : "light";
LocalStorage.setItem("theme", currentTheme);
const initialState = createInitialState({ theme: currentTheme });

export const RootContext = React.createContext({
  state: initialState,
  dispatch: (() => initialState) as DispatchType,
});

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(rootReducer, initialState);

  const store = React.useMemo(() => ({ state, dispatch }), [state]);

  return <RootContext.Provider value={store}>{children}</RootContext.Provider>;
};
