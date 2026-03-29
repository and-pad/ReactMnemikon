import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";

const RestorationsQueries = lazy(() =>
  import("../components/PiecesRestorations/restorationsQueries").then((module) => ({
    default: module.RestorationsQueries,
  })),
);

export const restorationQueriesRoutes = [
  {
    path: "piece_restorations",
    element: (
      <ProtectedRouteElement
        component={RestorationsQueries}
        componentProps={{ module: "Restoration", title: "Restauraciones" }}
      />
    ),
  },
];
