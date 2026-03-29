import { EditInventory } from "../components/PiecesQueries/edit";
import { NewInventory } from "../components/PiecesQueries/new";
import { InventoryAction } from "../components/PiecesQueries/inventoryActions";
import { ProtectedRouteElement } from "./RouteElements";

export const inventoryQueriesActionsRoutes = [
  {
    path: "inventory_queries/actions/:_id/",
    element: (
      <ProtectedRouteElement
        component={InventoryAction}
        componentProps={{ action: "edit" }}
      />
    ),
    children: [
      {
        path: "edit",
        element: <ProtectedRouteElement component={EditInventory} />,
      },
    ],
  },
  {
    path: "inventory_queries/actions/add/",
    element: (
      <ProtectedRouteElement
        component={InventoryAction}
        componentProps={{ action: "new" }}
      />
    ),
    children: [
      {
        path: "new",
        element: <ProtectedRouteElement component={NewInventory} />,
      },
    ],
  },
];
