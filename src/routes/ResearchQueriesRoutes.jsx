import { ResearchsQueries } from "../components/PiecesResearchs/ResearchsQueries";
import { ProtectedRouteElement } from "./RouteElements";

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
