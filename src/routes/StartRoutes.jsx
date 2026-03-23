import { Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRouteComponent";
import { Home } from "../components/Home/Start";

export function Start({ accessToken, refreshToken, handleCheckLoginCallback }) {
  return [
    <Route
      key="start"
      path="start"
      element={
        <PrivateRoute
          element={
            <Home
              accessToken={accessToken}
              refreshToken={refreshToken}
              handleCheckLoginCallback={handleCheckLoginCallback}
            />
          }
          checkLogin={handleCheckLoginCallback}
        />
      }
    />,
    // más rutas si quieres
  ];
}
