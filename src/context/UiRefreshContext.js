import { createContext, useContext, useState } from "react";

const UiRefreshContext = createContext();

export function UiRefreshProvider({ children }) {
  const [taskSymbolChanged, setTaskSymbolChanged] = useState(false);
  const [taskMarkChanged, setTaskMarkChanged] = useState(false);

  return (
    <UiRefreshContext.Provider
      value={{
        taskSymbolChanged,
        setTaskSymbolChanged,
        taskMarkChanged,
        setTaskMarkChanged,
      }}
    >
      {children}
    </UiRefreshContext.Provider>
  );
}

export function useUiRefresh() {
  return useContext(UiRefreshContext);
}
