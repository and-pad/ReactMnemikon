import { RestorationEditSelect } from "../components/PiecesRestorations/restorationsActions";
import { ProtectedRouteElement } from "./RouteElements";

export const restorationEditSelectRoutes = [
  {
    path: "piece_restorations/actions/:_id/edit-select",
    element: <ProtectedRouteElement component={RestorationEditSelect} />,
  },
];
