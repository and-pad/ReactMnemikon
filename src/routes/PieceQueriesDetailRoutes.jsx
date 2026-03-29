import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { ProtectedRouteElement } from "./RouteElements";

const PieceDetail = lazy(() =>
  import("../components/PiecesQueries/PieceDetail").then((module) => ({
    default: module.PieceDetail,
  })),
);

const Inventory = lazy(() =>
  import("../components/PiecesQueries/details").then((module) => ({
    default: module.Inventory,
  })),
);

const Research = lazy(() =>
  import("../components/PiecesQueries/details").then((module) => ({
    default: module.Research,
  })),
);

const Restoration = lazy(() =>
  import("../components/PiecesQueries/details").then((module) => ({
    default: module.Restoration,
  })),
);

const Movements = lazy(() =>
  import("../components/PiecesQueries/details").then((module) => ({
    default: module.Movements,
  })),
);

export const pieceQueriesDetailRoutes = [
  {
    path: "piece_queries/detail/:_id/",
    element: <ProtectedRouteElement component={PieceDetail} />,
    children: [
      {
        index: true,
        element: <Navigate to="inventory" />,
      },
      {
        path: "inventory",
        element: <ProtectedRouteElement component={Inventory} />,
      },
      {
        path: "research",
        element: <ProtectedRouteElement component={Research} />,
      },
      {
        path: "restoration",
        element: <ProtectedRouteElement component={Restoration} />,
      },
      {
        path: "movements",
        element: <ProtectedRouteElement component={Movements} />,
      },
    ],
  },
];
