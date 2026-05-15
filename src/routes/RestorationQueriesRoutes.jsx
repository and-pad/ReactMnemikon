import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";
import {
  RESTORATION_PERMISSIONS,
  RestorationPermissionFallback,
} from "../components/PiecesRestorations/restorationPermissions";

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
        componentProps={{
          module: "Restoration",
          title: "Restauraciones",
          requiredPermissions: [RESTORATION_PERMISSIONS.view],
          fallbackElement: (
            <RestorationPermissionFallback title="No tienes permiso para ver Restauración." />
          ),
        }}
      />
    ),
  },
];
