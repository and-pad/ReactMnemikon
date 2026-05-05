import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";

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

export const reportsRoutes = [
  {
    path: "reports",
    element: <ProtectedRouteElement component={ReportsList} />,
  },
  {
    path: "reports/new",
    element: <ProtectedRouteElement component={NewReport} />,
  },
  {
    path: "reports/edit/:id",
    element: <ProtectedRouteElement component={EditReport} />,
  },
  {
    path: "reports/view/:id",
    element: <ProtectedRouteElement component={ViewReport} />,
  },
];
