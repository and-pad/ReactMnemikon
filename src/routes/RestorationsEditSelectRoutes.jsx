import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";

const RestorationEditSelect = lazy(() =>
  import("../components/PiecesRestorations/restorationsActions").then((module) => ({
    default: module.RestorationEditSelect,
  })),
);

export const restorationEditSelectRoutes = [
  {
    path: "piece_restorations/actions/:_id/edit-select",
    element: <ProtectedRouteElement component={RestorationEditSelect} />,
  },
];
