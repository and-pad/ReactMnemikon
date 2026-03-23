import { Route } from "react-router-dom";
//import { PiecesQueries } from "../components/PiecesQueries/PiecesQueries";
import PrivateRoute from "../components/PrivateRouteComponent";
import { ResearchsQueries } from "../components/PiecesResearchs/ResearchsQueries";

export function ResearchQueries({
  handleCheckLoginCallback,
  accessToken,
  refreshToken,
  permissions,
}) {
  return [
    <>
      <Route
              path="piece_researchs"
              element={
                <PrivateRoute
                  checkLogin={handleCheckLoginCallback}
                  element={
                    <ResearchsQueries
                      accessToken={accessToken}
                      refreshToken={refreshToken}
                      module={"Research"}
                      title={"Investigación"}
                      permissions={permissions}
                    />
                  }
                />
              }
            />
    </>
  ];
}