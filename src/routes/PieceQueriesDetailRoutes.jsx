import { Route } from "react-router-dom";
//import { PiecesQueries } from "../components/PiecesQueries/PiecesQueries";
import PrivateRoute from "../components/PrivateRouteComponent";
import {
  Inventory,
  Research,
  Restoration,
  Movements,
} from "../components/PiecesQueries/details";
import { PieceDetail } from "../components/PiecesQueries/PieceDetail";
import { Navigate } from "react-router-dom";

export function PieceQueriesDetail({
  handleCheckLoginCallback,
  accessToken,
  refreshToken,  
}) {
  return [
    <>
      <Route
        path="piece_queries/detail/:_id/"
        element={
          <PrivateRoute
            element={
              <PieceDetail
                accessToken={accessToken}
                refreshToken={refreshToken}
              />
            }
            checkLogin={handleCheckLoginCallback}
          />
        }
      >
        <Route index element={<Navigate to="inventory" />} />

        <Route
          path="inventory"
          element={
            <PrivateRoute
              element={<Inventory />}
              checkLogin={handleCheckLoginCallback}
            />
          }
        />
        <Route
          path="research"
          element={
            <PrivateRoute
              element={<Research />}
              checkLogin={handleCheckLoginCallback}
            />
          }
        />
        <Route
          path="restoration"
          element={
            <PrivateRoute
              element={<Restoration />}
              checkLogin={handleCheckLoginCallback}
            />
          }
        />
        <Route
          path="movements"
          element={
            <PrivateRoute
              element={<Movements />}
              checkLogin={handleCheckLoginCallback}
            />
          }
        />
      </Route>
    </>
  ];
}
