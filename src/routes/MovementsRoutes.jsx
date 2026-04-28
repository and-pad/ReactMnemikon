import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";

const MovementsManage = lazy(() =>
  import("../components/Movements/MovementsManage").then((module) => ({
    default: module.MovementsManage,
  })),
);

const NewMovement = lazy(() =>
  import("../components/Movements/new").then((module) => ({
    default: module.NewMovement,
  })),
);

const EditMovement = lazy(() =>
  import("../components/Movements/edit").then((module) => ({
    default: module.EditMovement,
  })),
);

const SelectMovementPieces = lazy(() =>
  import("../components/Movements/select-pieces").then((module) => ({
    default: module.SelectMovementPieces,
  })),
);

const InfoMovement = lazy(() =>
  import("../components/Movements/info").then((module) => ({
    default: module.InfoMovement,
  })),
);

const ReturnMovementPieces = lazy(() =>
  import("../components/Movements/pieces_return").then((module) => ({
    default: module.ReturnMovementPieces,
  })),
);

const InstitutionsList = lazy(() =>
  import("../components/MovementsCatalogs/Institutions/list").then((module) => ({
    default: module.InstitutionsList,
  })),
);

const NewInstitution = lazy(() =>
  import("../components/MovementsCatalogs/Institutions/new").then((module) => ({
    default: module.NewInstitution,
  })),
);

const EditInstitution = lazy(() =>
  import("../components/MovementsCatalogs/Institutions/edit").then((module) => ({
    default: module.EditInstitution,
  })),
);

const ContactsList = lazy(() =>
  import("../components/MovementsCatalogs/Contacts/list").then((module) => ({
    default: module.ContactsList,
  })),
);

const NewContact = lazy(() =>
  import("../components/MovementsCatalogs/Contacts/new").then((module) => ({
    default: module.NewContact,
  })),
);

const EditContact = lazy(() =>
  import("../components/MovementsCatalogs/Contacts/edit").then((module) => ({
    default: module.EditContact,
  })),
);

const VenuesList = lazy(() =>
  import("../components/MovementsCatalogs/Venues/list").then((module) => ({
    default: module.VenuesList,
  })),
);

const NewVenue = lazy(() =>
  import("../components/MovementsCatalogs/Venues/new").then((module) => ({
    default: module.NewVenue,
  })),
);

const EditVenue = lazy(() =>
  import("../components/MovementsCatalogs/Venues/edit").then((module) => ({
    default: module.EditVenue,
  })),
);

const ExhibitionsList = lazy(() =>
  import("../components/MovementsCatalogs/Exhibitions/list").then((module) => ({
    default: module.ExhibitionsList,
  })),
);

const NewExhibition = lazy(() =>
  import("../components/MovementsCatalogs/Exhibitions/new").then((module) => ({
    default: module.NewExhibition,
  })),
);

const EditExhibition = lazy(() =>
  import("../components/MovementsCatalogs/Exhibitions/edit").then((module) => ({
    default: module.EditExhibition,
  })),
);

export const movementsRoutes = [
  {
    path: "movements/manage",
    element: <ProtectedRouteElement component={MovementsManage} />,
  },
  {
    path: "movements/new",
    element: <ProtectedRouteElement component={NewMovement} />,
  },
  {
    path: "movements/manage/edit/:id",
    element: <ProtectedRouteElement component={EditMovement} />,
  },
  {
    path: "movements/manage/select-pieces/:id",
    element: <ProtectedRouteElement component={SelectMovementPieces} />,
  },
  {
    path: "movements/manage/info/:id",
    element: <ProtectedRouteElement component={InfoMovement} />,
  },
  {
    path: "movements/manage/return-pieces/:id",
    element: <ProtectedRouteElement component={ReturnMovementPieces} />,
  },
  {
    path: "movements/institutions",
    element: <ProtectedRouteElement component={InstitutionsList} />,
  },
  {
    path: "movements/institutions/new",
    element: <ProtectedRouteElement component={NewInstitution} />,
  },
  {
    path: "movements/institutions/edit/:id",
    element: <ProtectedRouteElement component={EditInstitution} />,
  },
  {
    path: "movements/contacts",
    element: <ProtectedRouteElement component={ContactsList} />,
  },
  {
    path: "movements/contacts/new",
    element: <ProtectedRouteElement component={NewContact} />,
  },
  {
    path: "movements/contacts/edit/:id",
    element: <ProtectedRouteElement component={EditContact} />,
  },
  {
    path: "movements/venues",
    element: <ProtectedRouteElement component={VenuesList} />,
  },
  {
    path: "movements/venues/new",
    element: <ProtectedRouteElement component={NewVenue} />,
  },
  {
    path: "movements/venues/edit/:id",
    element: <ProtectedRouteElement component={EditVenue} />,
  },
  {
    path: "movements/exhibitions",
    element: <ProtectedRouteElement component={ExhibitionsList} />,
  },
  {
    path: "movements/exhibitions/new",
    element: <ProtectedRouteElement component={NewExhibition} />,
  },
  {
    path: "movements/exhibitions/edit/:id",
    element: <ProtectedRouteElement component={EditExhibition} />,
  },
];
