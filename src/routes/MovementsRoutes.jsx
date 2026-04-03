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

const EditMovement = lazy(() =>
  import("../components/Movements/edit").then((module) => ({
    default: module.EditMovement,
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
  {
    path: "movements/manage/edit/:id",
    element: <ProtectedRouteElement component={EditMovement} />,
  },
];
