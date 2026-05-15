import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";
import {
  RESTORATION_PERMISSIONS,
  RestorationPermissionFallback,
} from "../components/PiecesRestorations/restorationPermissions";

const NewRestoration = lazy(() =>
  import("../components/PiecesRestorations/new").then((module) => ({
    default: module.NewRestoration,
  })),
);

export const restorationNewRoutes = [
  {
    path: "piece_restorations/actions/:_id/new",
    element: (
      <ProtectedRouteElement
        component={NewRestoration}
        componentProps={{
          requiredPermissions: [RESTORATION_PERMISSIONS.create],
          fallbackElement: (
            <RestorationPermissionFallback title="No tienes permiso para agregar restauraciones." />
          ),
        }}
      />
    ),
  },
];
