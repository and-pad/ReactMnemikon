import { Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRouteComponent";
import { RestorationEditSelect } from "../components/PiecesRestorations/restorationsActions";
export function RestorationEdit_select({
  handleCheckLoginCallback,
  accessToken,
  refreshToken,
  
}) {
  return [
    <>
      <Route
        path="piece_restorations/actions/:_id/edit-select"
        element={
          <PrivateRoute
            element={
              <RestorationEditSelect
                accessToken={accessToken}
                refreshToken={refreshToken}
              />
            }
            checkLogin={handleCheckLoginCallback}
          />
        }
      />
    </>
  ];
}
