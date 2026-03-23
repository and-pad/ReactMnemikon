import { Route } from "react-router-dom";

import { ResearchEdit } from "../components/PiecesResearchs/researchsActions";
import { EditResearch } from "../components/PiecesResearchs/edit";
import PrivateRoute from "../components/PrivateRouteComponent";
import { Navigate } from "react-router-dom";
export function ResearchQueriesActions({
  handleCheckLoginCallback,
  accessToken,
  refreshToken,
  permissions,
}) {
  return [
    <>
           <Route
              path="piece_researchs/actions/:_id/"
              element={
                <PrivateRoute
                  element={
                    <ResearchEdit
                      accessToken={accessToken}
                      refreshToken={refreshToken}
                    />
                  }
                  checkLogin={handleCheckLoginCallback}
                />
              }
            >
              <Route index element={<Navigate to="edit" />} />
              <Route
                path="edit"
                element={
                  <PrivateRoute
                    element={
                      <EditResearch
                        accessToken={accessToken}
                        refreshToken={refreshToken}
                        permissions={permissions}
                      />
                    }
                    checkLogin={handleCheckLoginCallback}
                  />
                }
              />
            </Route>
    </>
  ];
}