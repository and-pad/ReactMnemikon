import { NewRestoration } from "../components/PiecesRestorations/new";
import { ProtectedRouteElement } from "./RouteElements";

export const restorationNewRoutes = [
  {
    path: "piece_restorations/actions/:_id/new",
    element: <ProtectedRouteElement component={NewRestoration} />,
  },
];
