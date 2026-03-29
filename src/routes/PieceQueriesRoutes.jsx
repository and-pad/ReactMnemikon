import { PiecesQueries } from "../components/PiecesQueries/PiecesQueries";
import { ProtectedRouteElement } from "./RouteElements";

export const pieceQueriesRoutes = [
  {
    path: "piece_queries",
    element: (
      <ProtectedRouteElement
        component={PiecesQueries}
        componentProps={{ module: "Query" }}
      />
    ),
  },
];
