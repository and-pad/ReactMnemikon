import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";

const MovementsManage = lazy(() =>
  import("../components/Movements/MovementsManage").then((module) => ({
    default: module.MovementsManage,
  })),
);

const NewMovement = lazy(() =>
  import("../components/Movements/new").then((module) => ({
    default: module.NewMovement,
  })),
);

export const movementsRoutes = [
  {
    path: "movements/manage",
    element: <ProtectedRouteElement component={MovementsManage} />,
  },
  {
    path: "movements/new",
    element: <ProtectedRouteElement component={NewMovement} />,
  },
];
