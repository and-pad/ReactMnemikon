import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";

const ResearchsQueries = lazy(() =>
  import("../components/PiecesResearchs/ResearchsQueries").then((module) => ({
    default: module.ResearchsQueries,
  })),
);

export const researchQueriesRoutes = [
  {
    path: "piece_researchs",
    element: (
      <ProtectedRouteElement
        component={ResearchsQueries}
        componentProps={{ module: "Research", title: "Investigación" }}
      />
    ),
  },
];
