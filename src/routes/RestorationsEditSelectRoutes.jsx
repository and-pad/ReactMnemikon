import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";
import {
  RESTORATION_PERMISSIONS,
  RestorationPermissionFallback,
} from "../components/PiecesRestorations/restorationPermissions";

const RestorationEditSelect = lazy(() =>
  import("../components/PiecesRestorations/restorationsActions").then((module) => ({
    default: module.RestorationEditSelect,
  })),
);

export const restorationEditSelectRoutes = [
  {
    path: "piece_restorations/actions/:_id/edit-select",
    element: (
      <ProtectedRouteElement
        component={RestorationEditSelect}
        componentProps={{
          requiredPermissions: [
            RESTORATION_PERMISSIONS.view,
            RESTORATION_PERMISSIONS.create,
            RESTORATION_PERMISSIONS.edit,
            RESTORATION_PERMISSIONS.delete,
          ],
          fallbackElement: (
            <RestorationPermissionFallback title="No tienes permiso para acceder al historial de restauraciones." />
          ),
        }}
      />
    ),
  },
];
