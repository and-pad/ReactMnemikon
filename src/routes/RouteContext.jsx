import { createContext, useContext } from "react";

const RouteContext = createContext(null);

export const RouteContextProvider = RouteContext.Provider;

export function useRouteContext() {
  return useContext(RouteContext);
}
