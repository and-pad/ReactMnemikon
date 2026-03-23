import { Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRouteComponent";
import { MovementsManage }from "../components/Movements/MovementsManage";


export function Movements({ accessToken, refreshToken, handleCheckLoginCallback }) {
  return [
    <Route
      key="movements"
      path="movements/manage"
      element={
        <PrivateRoute
          element={<MovementsManage 
            accessToken={accessToken}
            refreshToken={refreshToken}

             />             
          }
          checkLogin={handleCheckLoginCallback}
        />
      }
    />,
    // más rutas si quieres
  ];
}
