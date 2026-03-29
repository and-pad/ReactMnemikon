import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";

const PiecesQueries = lazy(() =>
  import("../components/PiecesQueries/PiecesQueries").then((module) => ({
    default: module.PiecesQueries,
  })),
);

export const inventoryQueriesRoutes = [
  {
    path: "inventory_queries",
    element: (
      <ProtectedRouteElement
        component={PiecesQueries}
        componentProps={{ module: "Inventory" }}
      />
    ),
  },
];
