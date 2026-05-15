import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";
import {
  RESEARCH_PERMISSIONS,
  ResearchPermissionFallback,
} from "../components/PiecesResearchs/researchPermissions";

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
        componentProps={{
          module: "Research",
          title: "Investigación",
          requiredPermissions: [RESEARCH_PERMISSIONS.view],
          fallbackElement: (
            <ResearchPermissionFallback title="No tienes permiso para ver Investigación." />
          ),
        }}
      />
    ),
  },
];
