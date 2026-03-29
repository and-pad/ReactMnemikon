import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";

const NewRestoration = lazy(() =>
  import("../components/PiecesRestorations/new").then((module) => ({
    default: module.NewRestoration,
  })),
);

export const restorationNewRoutes = [
  {
    path: "piece_restorations/actions/:_id/new",
    element: <ProtectedRouteElement component={NewRestoration} />,
  },
];
