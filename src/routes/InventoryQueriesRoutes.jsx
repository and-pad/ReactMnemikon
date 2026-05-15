import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";
import {
  INVENTORY_PERMISSIONS,
  InventoryPermissionFallback,
} from "../components/PiecesQueries/inventoryPermissions";

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
        componentProps={{
          module: "Inventory",
          requiredPermissions: [INVENTORY_PERMISSIONS.view],
          fallbackElement: (
            <InventoryPermissionFallback title="No tienes permiso para ver Inventario." />
          ),
        }}
      />
    ),
  },
];
