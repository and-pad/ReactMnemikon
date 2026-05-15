import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { ProtectedRouteElement } from "./RouteElements";
import {
  RESEARCH_PERMISSIONS,
  ResearchPermissionFallback,
} from "../components/PiecesResearchs/researchPermissions";

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
    element: (
      <ProtectedRouteElement
        component={ResearchEdit}
        componentProps={{
          requiredPermissions: [
            RESEARCH_PERMISSIONS.create,
            RESEARCH_PERMISSIONS.edit,
          ],
          fallbackElement: (
            <ResearchPermissionFallback title="No tienes permiso para abrir el editor de investigación." />
          ),
        }}
      />
    ),
    children: [
      {
        index: true,
        element: <Navigate to="edit" />,
      },
      {
        path: "edit",
        element: (
          <ProtectedRouteElement
            component={EditResearch}
            componentProps={{
              requiredPermissions: [
                RESEARCH_PERMISSIONS.create,
                RESEARCH_PERMISSIONS.edit,
              ],
              fallbackElement: (
                <ResearchPermissionFallback title="No tienes permiso para editar o crear investigaciones." />
              ),
            }}
          />
        ),
      },
    ],
  },
];
