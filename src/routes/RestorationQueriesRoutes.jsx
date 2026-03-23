import { Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRouteComponent";
import { RestorationsQueries } from "../components/PiecesRestorations/restorationsQueries";
export function RestorationQueries({
  handleCheckLoginCallback,
  accessToken,
  refreshToken,
  permissions,
}) {
  return [
    <>
      <Route
        path="piece_restorations"
        element={
          <PrivateRoute
            checkLogin={handleCheckLoginCallback}
            element={
              <RestorationsQueries
                accessToken={accessToken}
                refreshToken={refreshToken}
                permissions={permissions}
                module={"Restoration"}
                title={"Restauraciones"}
              />
            }
          />
        }
      />
    </>
  ];
}
