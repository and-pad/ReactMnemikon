import { Route } from "react-router-dom";
import { ApprovRejectNew } from "../components/PiecesQueries/approv_reject_New";
import  PrivateRoute  from "../components/PrivateRouteComponent";

export function PiecesPendingList({
    handleCheckLoginCallback,
              accessToken,
              refreshToken,
              permissions,
}) {
  return [
    <>
     <Route
              path="inventory_queries/actions/pending/list"
              element={
                <PrivateRoute
                  element={
                    <ApprovRejectNew
                      accessToken={accessToken}
                      refreshToken={refreshToken}
                      /*onDetailClick={handleDetailClick}*/
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