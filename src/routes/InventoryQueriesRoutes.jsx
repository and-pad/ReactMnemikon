import { PiecesQueries } from "../components/PiecesQueries/PiecesQueries";
import { ProtectedRouteElement } from "./RouteElements";

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
