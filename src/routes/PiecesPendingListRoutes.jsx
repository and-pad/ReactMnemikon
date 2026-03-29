import { ApprovRejectNew } from "../components/PiecesQueries/approv_reject_New";
import { ProtectedRouteElement } from "./RouteElements";

export const piecesPendingListRoutes = [
  {
    path: "inventory_queries/actions/pending/list",
    element: <ProtectedRouteElement component={ApprovRejectNew} />,
  },
];
