import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { ProtectedRouteElement } from "./RouteElements";

const ResearchEdit = lazy(() =>
  import("../components/PiecesResearchs/researchsActions").then((module) => ({
    default: module.ResearchEdit,
  })),
);

const EditResearch = lazy(() =>
  import("../components/PiecesResearchs/edit").then((module) => ({
    default: module.EditResearch,
  })),
);

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
