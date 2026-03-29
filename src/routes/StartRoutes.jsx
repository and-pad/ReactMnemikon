import { Home } from "../components/Home/Start";
import { ProtectedRouteElement } from "./RouteElements";

export const startRoutes = [
  {
    path: "start",
    element: <ProtectedRouteElement component={Home} />,
  },
];
