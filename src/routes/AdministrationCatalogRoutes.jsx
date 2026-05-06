import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";

const CatalogsList = lazy(() =>
  import("../components/AdministrationCatalogs/catalogs").then((module) => ({
    default: module.CatalogsList,
  })),
);

const NewCatalog = lazy(() =>
  import("../components/AdministrationCatalogs/catalogs").then((module) => ({
    default: module.NewCatalog,
  })),
);

const EditCatalog = lazy(() =>
  import("../components/AdministrationCatalogs/catalogs").then((module) => ({
    default: module.EditCatalog,
  })),
);

const CatalogElementsList = lazy(() =>
  import("../components/AdministrationCatalogs/catalogs").then((module) => ({
    default: module.CatalogElementsList,
  })),
);

const NewCatalogElement = lazy(() =>
  import("../components/AdministrationCatalogs/catalogs").then((module) => ({
    default: module.NewCatalogElement,
  })),
);

const EditCatalogElement = lazy(() =>
  import("../components/AdministrationCatalogs/catalogs").then((module) => ({
    default: module.EditCatalogElement,
  })),
);

const GendersList = lazy(() =>
  import("../components/AdministrationCatalogs/genders").then((module) => ({
    default: module.GendersList,
  })),
);

const NewGender = lazy(() =>
  import("../components/AdministrationCatalogs/genders").then((module) => ({
    default: module.NewGender,
  })),
);

const EditGender = lazy(() =>
  import("../components/AdministrationCatalogs/genders").then((module) => ({
    default: module.EditGender,
  })),
);

const SubgendersList = lazy(() =>
  import("../components/AdministrationCatalogs/genders").then((module) => ({
    default: module.SubgendersList,
  })),
);

const NewSubgender = lazy(() =>
  import("../components/AdministrationCatalogs/genders").then((module) => ({
    default: module.NewSubgender,
  })),
);

const EditSubgender = lazy(() =>
  import("../components/AdministrationCatalogs/genders").then((module) => ({
    default: module.EditSubgender,
  })),
);

export const administrationCatalogRoutes = [
  {
    path: "administration/catalogs_manage",
    element: <ProtectedRouteElement component={CatalogsList} />,
  },
  {
    path: "administration/catalogs_manage/new",
    element: <ProtectedRouteElement component={NewCatalog} />,
  },
  {
    path: "administration/catalogs_manage/:id/edit",
    element: <ProtectedRouteElement component={EditCatalog} />,
  },
  {
    path: "administration/catalogs_manage/:id/elements",
    element: <ProtectedRouteElement component={CatalogElementsList} />,
  },
  {
    path: "administration/catalogs_manage/:id/elements/new",
    element: <ProtectedRouteElement component={NewCatalogElement} />,
  },
  {
    path: "administration/catalogs_manage/elements/:elementId/edit",
    element: <ProtectedRouteElement component={EditCatalogElement} />,
  },
  {
    path: "administration/catalog_genders",
    element: <ProtectedRouteElement component={GendersList} />,
  },
  {
    path: "administration/catalog_genders/new",
    element: <ProtectedRouteElement component={NewGender} />,
  },
  {
    path: "administration/catalog_genders/:id/edit",
    element: <ProtectedRouteElement component={EditGender} />,
  },
  {
    path: "administration/catalog_genders/:id/subgenders",
    element: <ProtectedRouteElement component={SubgendersList} />,
  },
  {
    path: "administration/catalog_genders/:id/subgenders/new",
    element: <ProtectedRouteElement component={NewSubgender} />,
  },
  {
    path: "administration/catalog_genders/subgenders/:subgenderId/edit",
    element: <ProtectedRouteElement component={EditSubgender} />,
  },
];
