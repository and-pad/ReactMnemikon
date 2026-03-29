import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";

const EditInventory = lazy(() =>
  import("../components/PiecesQueries/edit").then((module) => ({
    default: module.EditInventory,
  })),
);

const NewInventory = lazy(() =>
  import("../components/PiecesQueries/new").then((module) => ({
    default: module.NewInventory,
  })),
);

const InventoryAction = lazy(() =>
  import("../components/PiecesQueries/inventoryActions").then((module) => ({
    default: module.InventoryAction,
  })),
);

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
