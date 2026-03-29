import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";

const ApprovRejectNew = lazy(() =>
  import("../components/PiecesQueries/approv_reject_New").then((module) => ({
    default: module.ApprovRejectNew,
  })),
);

export const piecesPendingListRoutes = [
  {
    path: "inventory_queries/actions/pending/list",
    element: <ProtectedRouteElement component={ApprovRejectNew} />,
  },
];
