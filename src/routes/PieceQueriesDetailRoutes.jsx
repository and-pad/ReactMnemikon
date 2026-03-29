import { Navigate } from "react-router-dom";
import {
  Inventory,
  Research,
  Restoration,
  Movements,
} from "../components/PiecesQueries/details";
import { PieceDetail } from "../components/PiecesQueries/PieceDetail";
import { ProtectedRouteElement } from "./RouteElements";

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
