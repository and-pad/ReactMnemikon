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

const SelectMovementPieces = lazy(() =>
  import("../components/Movements/select-pieces").then((module) => ({
    default: module.SelectMovementPieces,
  })),
);

const InfoMovement = lazy(() =>
  import("../components/Movements/info").then((module) => ({
    default: module.InfoMovement,
  })),
);

const ReturnMovementPieces = lazy(() =>
  import("../components/Movements/pieces_return").then((module) => ({
    default: module.ReturnMovementPieces,
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
  {
    path: "movements/manage/select-pieces/:id",
    element: <ProtectedRouteElement component={SelectMovementPieces} />,
  },
  {
    path: "movements/manage/info/:id",
    element: <ProtectedRouteElement component={InfoMovement} />,
  },
  {
    path: "movements/manage/return-pieces/:id",
    element: <ProtectedRouteElement component={ReturnMovementPieces} />,
  },
];
