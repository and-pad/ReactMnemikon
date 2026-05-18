import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";
import {
  REPORT_PERMISSIONS,
  ReportPermissionFallback,
} from "../components/Reports/reportPermissions";

const ReportsList = lazy(() =>
  import("../components/Reports/list").then((module) => ({
    default: module.ReportsList,
  })),
);

const NewReport = lazy(() =>
  import("../components/Reports/new").then((module) => ({
    default: module.NewReport,
  })),
);

const EditReport = lazy(() =>
  import("../components/Reports/edit").then((module) => ({
    default: module.EditReport,
  })),
);

const ViewReport = lazy(() =>
  import("../components/Reports/view").then((module) => ({
    default: module.ViewReport,
  })),
);

const ReportPdfPreview = lazy(() =>
  import("../components/Reports/pdf-preview").then((module) => ({
    default: module.ReportPdfPreview,
  })),
);

export const reportsRoutes = [
  {
    path: "reports",
    element: (
      <ProtectedRouteElement
        component={ReportsList}
        componentProps={{
          requiredPermissions: [
            REPORT_PERMISSIONS.view,
            REPORT_PERMISSIONS.edit,
            REPORT_PERMISSIONS.delete,
          ],
          permissionMode: "some",
          fallbackElement: (
            <ReportPermissionFallback message="No tienes permisos para acceder al listado de reportes." />
          ),
        }}
      />
    ),
  },
  {
    path: "reports/new",
    element: (
      <ProtectedRouteElement
        component={NewReport}
        componentProps={{
          requiredPermissions: [REPORT_PERMISSIONS.create],
          fallbackElement: (
            <ReportPermissionFallback message="No tienes permisos para crear reportes." />
          ),
        }}
      />
    ),
  },
  {
    path: "reports/edit/:id",
    element: (
      <ProtectedRouteElement
        component={EditReport}
        componentProps={{
          requiredPermissions: [REPORT_PERMISSIONS.edit],
          fallbackElement: (
            <ReportPermissionFallback message="No tienes permisos para editar reportes." />
          ),
        }}
      />
    ),
  },
  {
    path: "reports/view/:id",
    element: (
      <ProtectedRouteElement
        component={ViewReport}
        componentProps={{
          requiredPermissions: [REPORT_PERMISSIONS.view],
          fallbackElement: (
            <ReportPermissionFallback message="No tienes permisos para ver reportes." />
          ),
        }}
      />
    ),
  },
  {
    path: "reports/view/:id/pdf-preview",
    element: (
      <ProtectedRouteElement
        component={ReportPdfPreview}
        componentProps={{
          requiredPermissions: [REPORT_PERMISSIONS.view],
          fallbackElement: (
            <ReportPermissionFallback message="No tienes permisos para previsualizar reportes." />
          ),
        }}
      />
    ),
  },
];
