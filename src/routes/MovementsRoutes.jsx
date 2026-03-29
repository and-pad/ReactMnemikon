import { MovementsManage } from "../components/Movements/MovementsManage";
import { ProtectedRouteElement } from "./RouteElements";

export const movementsRoutes = [
  {
    path: "movements/manage",
    element: <ProtectedRouteElement component={MovementsManage} />,
  },
];
