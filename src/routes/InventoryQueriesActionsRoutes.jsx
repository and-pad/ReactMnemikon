import { Route } from "react-router-dom";
//import { PiecesQueries } from "../components/PiecesQueries/PiecesQueries";
import { EditInventory } from "../components/PiecesQueries/edit";
import { NewInventory } from "../components/PiecesQueries/new";
import { InventoryAction } from "../components/PiecesQueries/inventoryActions";
import PrivateRoute from "../components/PrivateRouteComponent";
import { Navigate } from "react-router-dom";

export function InventoryQueriesActions({
  handleCheckLoginCallback,
  accessToken,
  refreshToken,
  permissions,
}) {
  return [
    <>
      <Route
        path="inventory_queries/actions/:_id/"
        element={
          <PrivateRoute
            element={
              <InventoryAction
                accessToken={accessToken}
                refreshToken={refreshToken}
                permissions={permissions}
                action={"edit"}
              />
            }
            checkLogin={handleCheckLoginCallback}
          />
        }
      >
        {/*<Route index element={<Navigate to="edit" />} />*/}
        <Route
          path="edit"
          element={
            <PrivateRoute
              element={
                <EditInventory
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

      <Route
        path="inventory_queries/actions/add/"
        element={
          <PrivateRoute
            element={
              <InventoryAction
                accessToken={accessToken}
                refreshToken={refreshToken}
                permissions={permissions}
                action={"new"}
              />
            }
            checkLogin={handleCheckLoginCallback}
          />
        }
      > 
        {/*<Route index element={<Navigate to="new" />} />*/}
        <Route
          path="new"
          element={
            <PrivateRoute
              element={
                <NewInventory
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
