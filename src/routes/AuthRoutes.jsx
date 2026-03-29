import { Navigate } from "react-router-dom";
import { LoginRouteElement } from "./RouteElements";

export const authRoutes = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginRouteElement />,
  },
];
