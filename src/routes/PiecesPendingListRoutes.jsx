import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";
import {
  INVENTORY_PERMISSIONS,
  InventoryPermissionFallback,
} from "../components/PiecesQueries/inventoryPermissions";

const ApprovRejectNew = lazy(() =>
  import("../components/PiecesQueries/approv_reject_New").then((module) => ({
    default: module.ApprovRejectNew,
  })),
);

export const piecesPendingListRoutes = [
  {
    path: "inventory_queries/actions/pending/list",
    element: (
      <ProtectedRouteElement
        component={ApprovRejectNew}
        componentProps={{
          requiredPermissions: [INVENTORY_PERMISSIONS.authorize],
          fallbackElement: (
            <InventoryPermissionFallback title="No tienes permiso para autorizar piezas o cambios de inventario." />
          ),
        }}
      />
    ),
  },
];
