import { createBrowserRouter } from "react-router-dom";
import { administrationUserManagerRoutes } from "./AdministrationUserManagerRoutes";
import { authRoutes } from "./AuthRoutes";
import { inventoryQueriesActionsRoutes } from "./InventoryQueriesActionsRoutes";
import { inventoryQueriesRoutes } from "./InventoryQueriesRoutes";
import { movementsRoutes } from "./MovementsRoutes";
import { pieceQueriesDetailRoutes } from "./PieceQueriesDetailRoutes";
import { pieceQueriesRoutes } from "./PieceQueriesRoutes";
import { piecesPendingListRoutes } from "./PiecesPendingListRoutes";
import { researchQueriesActionsRoutes } from "./ResearchQueriesActionsRoutes";
import { researchQueriesRoutes } from "./ResearchQueriesRoutes";
import { restorationNewRoutes } from "./RestorationNewRoutes";
import { restorationQueriesActionsRoutes } from "./RestorationQueriesActionsRoutes";
import { restorationQueriesRoutes } from "./RestorationQueriesRoutes";
import { restorationEditSelectRoutes } from "./RestorationsEditSelectRoutes";
import { startRoutes } from "./StartRoutes";
import { MainLayoutRoute } from "./MainLayoutRoute";

const SearchPage = () => <h6>Home Page :-0</h6>;

export const appRouter = createBrowserRouter([
  ...authRoutes,
  {
    path: "/mnemosine",
    element: <MainLayoutRoute />,
    children: [
      ...startRoutes,
      ...pieceQueriesRoutes,
      ...piecesPendingListRoutes,
      ...researchQueriesRoutes,
      ...pieceQueriesDetailRoutes,
      ...inventoryQueriesRoutes,
      ...inventoryQueriesActionsRoutes,
      ...researchQueriesActionsRoutes,
      ...restorationQueriesRoutes,
      ...restorationEditSelectRoutes,
      ...restorationNewRoutes,
      ...restorationQueriesActionsRoutes,
      ...movementsRoutes,
      ...administrationUserManagerRoutes,
    ],
  },
  {
    path: "/test/",
    element: <SearchPage />,
  },
]);
