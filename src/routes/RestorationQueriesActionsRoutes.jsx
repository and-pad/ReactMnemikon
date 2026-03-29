import { EditRestoration } from "../components/PiecesRestorations/edit";
import { ProtectedRouteElement } from "./RouteElements";

export const restorationQueriesActionsRoutes = [
  {
    path: "piece_restorations/actions/:_id/edit-select/restoration/:restoration_id/edit",
    element: <ProtectedRouteElement component={EditRestoration} />,
  },
];
