import { RestorationsQueries } from "../components/PiecesRestorations/restorationsQueries";
import { ProtectedRouteElement } from "./RouteElements";

export const restorationQueriesRoutes = [
  {
    path: "piece_restorations",
    element: (
      <ProtectedRouteElement
        component={RestorationsQueries}
        componentProps={{ module: "Restoration", title: "Restauraciones" }}
      />
    ),
  },
];
