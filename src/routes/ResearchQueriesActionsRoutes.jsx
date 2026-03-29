import { Navigate } from "react-router-dom";
import { ResearchEdit } from "../components/PiecesResearchs/researchsActions";
import { EditResearch } from "../components/PiecesResearchs/edit";
import { ProtectedRouteElement } from "./RouteElements";

export const researchQueriesActionsRoutes = [
  {
    path: "piece_researchs/actions/:_id/",
    element: <ProtectedRouteElement component={ResearchEdit} />,
    children: [
      {
        index: true,
        element: <Navigate to="edit" />,
      },
      {
        path: "edit",
        element: <ProtectedRouteElement component={EditResearch} />,
      },
    ],
  },
];
