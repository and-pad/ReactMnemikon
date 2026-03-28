import { Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRouteComponent";
import { MovementsManage }from "../components/Movements/MovementsManage";


export function Movements({ accessToken, refreshToken, permissions, handleCheckLoginCallback }) {
  return [
    <Route
      key="movements"
      path="movements/manage"
      element={
        <PrivateRoute
          element={<MovementsManage 
            accessToken={accessToken}
            refreshToken={refreshToken}
            permissions={permissions}

             />             
          }
          checkLogin={handleCheckLoginCallback}
        />
      }
    />,
    // más rutas si quieres
  ];
}
