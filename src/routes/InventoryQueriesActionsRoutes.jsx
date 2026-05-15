import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";
import {
  INVENTORY_PERMISSIONS,
  InventoryPermissionFallback,
} from "../components/PiecesQueries/inventoryPermissions";

const EditInventory = lazy(() =>
  import("../components/PiecesQueries/edit").then((module) => ({
    default: module.EditInventory,
  })),
);

const InventoryHistory = lazy(() =>
  import("../components/PiecesQueries/history").then((module) => ({
    default: module.InventoryHistory,
  })),
);

const NewInventory = lazy(() =>
  import("../components/PiecesQueries/new").then((module) => ({
    default: module.NewInventory,
  })),
);

const InventoryAction = lazy(() =>
  import("../components/PiecesQueries/inventoryActions").then((module) => ({
    default: module.InventoryAction,
  })),
);

export const inventoryQueriesActionsRoutes = [
  {
    path: "inventory_queries/actions/:_id/",
    element: (
      <ProtectedRouteElement
        component={InventoryAction}
        componentProps={{
          action: "edit",
          requiredPermissions: [INVENTORY_PERMISSIONS.edit],
          fallbackElement: (
            <InventoryPermissionFallback title="No tienes permiso para editar piezas de inventario." />
          ),
        }}
      />
    ),
    children: [
      {
        path: "edit",
        element: <ProtectedRouteElement component={EditInventory} />,
      },
    ],
  },
  {
    path: "inventory_queries/actions/add/",
    element: (
      <ProtectedRouteElement
        component={InventoryAction}
        componentProps={{
          action: "new",
          requiredPermissions: [INVENTORY_PERMISSIONS.create],
          fallbackElement: (
            <InventoryPermissionFallback title="No tienes permiso para agregar piezas de inventario." />
          ),
        }}
      />
    ),
    children: [
      {
        path: "new",
        element: <ProtectedRouteElement component={NewInventory} />,
      },
    ],
  },
  {
    path: "inventory_queries/actions/:_id/history",
    element: (
      <ProtectedRouteElement
        component={InventoryHistory}
        componentProps={{
          requiredPermissions: [INVENTORY_PERMISSIONS.view],
          fallbackElement: (
            <InventoryPermissionFallback title="No tienes permiso para ver el historial de inventario." />
          ),
        }}
      />
    ),
  },
];
