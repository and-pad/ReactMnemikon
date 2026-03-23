import { Route } from "react-router-dom";
//import { PiecesQueries } from "../components/PiecesQueries/PiecesQueries";
import PrivateRoute from "../components/PrivateRouteComponent";
import { NewRestoration } from "../components/PiecesRestorations/new";
//import { ResearchsQueries } from "../components/PiecesResearchs/ResearchsQueries";

export function RestorationNew({
  handleCheckLoginCallback,
  accessToken,
  refreshToken,
  permissions,
}) {
  return [
    <>
      <Route
              path="piece_restorations/actions/:_id/new"
              element={
                <PrivateRoute
                  checkLogin={handleCheckLoginCallback}
                  element={
                   <NewRestoration 
                    accessToken={accessToken}
                    refreshToken={refreshToken}
                    permissions={permissions}
                    />

                   

                    
                  }
                />
              }
            />
    </>
  ];
}