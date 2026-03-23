import { Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRouteComponent";
import { EditRestoration } from "../components/PiecesRestorations/edit";

export function RestorationQueriesActions({
  handleCheckLoginCallback,
  accessToken,
  refreshToken,
  permissions,
}) {
  return [
    <>
      <Route
        path="piece_restorations/actions/:_id/edit-select/restoration/:restoration_id/edit"
        element={
          <PrivateRoute
            element={
              <EditRestoration
                accessToken={accessToken}
                refreshToken={refreshToken}
                permissions={permissions}
              />
            }
            checkLogin={handleCheckLoginCallback}
          />
        }
      />
    </>
  ];
}
