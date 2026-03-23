import { Route } from "react-router-dom";
import { PiecesQueries } from "../components/PiecesQueries/PiecesQueries";
import PrivateRoute from "../components/PrivateRouteComponent";

export function InventoryQueries({
  handleCheckLoginCallback,
  accessToken,
  refreshToken,
  permissions,
}) {
  return [
    <>
      <Route
        path="inventory_queries"
        element={
          <PrivateRoute
            element={
              <PiecesQueries
                accessToken={accessToken}
                refreshToken={refreshToken}
                //onDetailClick={handleDetailClick}
                module={"Inventory"}
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
