import { Route } from "react-router-dom";
import { PiecesQueries } from "../components/PiecesQueries/PiecesQueries";
import  PrivateRoute  from "../components/PrivateRouteComponent";

export function PieceQueries({
    handleCheckLoginCallback,
    accessToken,
    refreshToken,
    permissions,
}) {
  return [
      <>
     <Route
              path="piece_queries"
              element={
                <PrivateRoute
                  element={
                    <PiecesQueries
                      accessToken={accessToken}
                      refreshToken={refreshToken}
                      /*onDetailClick={handleDetailClick}*/
                      module={"Query"}
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