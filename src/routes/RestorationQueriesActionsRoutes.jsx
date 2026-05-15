import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";
import {
  RESTORATION_PERMISSIONS,
  RestorationPermissionFallback,
} from "../components/PiecesRestorations/restorationPermissions";

const EditRestoration = lazy(() =>
  import("../components/PiecesRestorations/edit").then((module) => ({
    default: module.EditRestoration,
  })),
);

export const restorationQueriesActionsRoutes = [
  {
    path: "piece_restorations/actions/:_id/edit-select/restoration/:restoration_id/edit",
    element: (
      <ProtectedRouteElement
        component={EditRestoration}
        componentProps={{
          requiredPermissions: [RESTORATION_PERMISSIONS.edit],
          fallbackElement: (
            <RestorationPermissionFallback title="No tienes permiso para editar restauraciones." />
          ),
        }}
      />
    ),
  },
];
