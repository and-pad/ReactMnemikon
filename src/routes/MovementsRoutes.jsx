import { lazy } from "react";
import { ProtectedRouteElement } from "./RouteElements";
import {
  MOVEMENT_PERMISSIONS,
  MovementPermissionFallback,
} from "../components/Movements/movementPermissions";

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
    element: (
      <ProtectedRouteElement
        component={MovementsManage}
        componentProps={{
          requiredPermissions: [
            MOVEMENT_PERMISSIONS.view,
            MOVEMENT_PERMISSIONS.edit,
            MOVEMENT_PERMISSIONS.delete,
            MOVEMENT_PERMISSIONS.authorize,
          ],
          permissionMode: "some",
          fallbackElement: (
            <MovementPermissionFallback message="No tienes permisos para acceder al listado de movimientos." />
          ),
        }}
      />
    ),
  },
  {
    path: "movements/new",
    element: (
      <ProtectedRouteElement
        component={NewMovement}
        componentProps={{
          requiredPermissions: [MOVEMENT_PERMISSIONS.create],
          fallbackElement: (
            <MovementPermissionFallback message="No tienes permisos para crear movimientos." />
          ),
        }}
      />
    ),
  },
  {
    path: "movements/manage/edit/:id",
    element: (
      <ProtectedRouteElement
        component={EditMovement}
        componentProps={{
          requiredPermissions: [MOVEMENT_PERMISSIONS.edit],
          fallbackElement: (
            <MovementPermissionFallback message="No tienes permisos para editar movimientos." />
          ),
        }}
      />
    ),
  },
  {
    path: "movements/manage/select-pieces/:id",
    element: (
      <ProtectedRouteElement
        component={SelectMovementPieces}
        componentProps={{
          requiredPermissions: [
            MOVEMENT_PERMISSIONS.create,
            MOVEMENT_PERMISSIONS.edit,
          ],
          permissionMode: "some",
          fallbackElement: (
            <MovementPermissionFallback message="No tienes permisos para gestionar las piezas del movimiento." />
          ),
        }}
      />
    ),
  },
  {
    path: "movements/manage/info/:id",
    element: (
      <ProtectedRouteElement
        component={InfoMovement}
        componentProps={{
          requiredPermissions: [
            MOVEMENT_PERMISSIONS.view,
            MOVEMENT_PERMISSIONS.edit,
            MOVEMENT_PERMISSIONS.delete,
            MOVEMENT_PERMISSIONS.authorize,
          ],
          permissionMode: "some",
          fallbackElement: (
            <MovementPermissionFallback message="No tienes permisos para consultar la información del movimiento." />
          ),
        }}
      />
    ),
  },
  {
    path: "movements/manage/return-pieces/:id",
    element: (
      <ProtectedRouteElement
        component={ReturnMovementPieces}
        componentProps={{
          requiredPermissions: [MOVEMENT_PERMISSIONS.edit],
          fallbackElement: (
            <MovementPermissionFallback message="No tienes permisos para registrar el regreso de piezas." />
          ),
        }}
      />
    ),
  },
  {
    path: "movements/institutions",
    element: (
      <ProtectedRouteElement
        component={InstitutionsList}
        componentProps={{
          requiredPermissions: [
            MOVEMENT_PERMISSIONS.view,
            MOVEMENT_PERMISSIONS.create,
            MOVEMENT_PERMISSIONS.edit,
            MOVEMENT_PERMISSIONS.delete,
          ],
          permissionMode: "some",
          fallbackElement: (
            <MovementPermissionFallback message="No tienes permisos para consultar instituciones de movimientos." />
          ),
        }}
      />
    ),
  },
  {
    path: "movements/institutions/new",
    element: (
      <ProtectedRouteElement
        component={NewInstitution}
        componentProps={{
          requiredPermissions: [MOVEMENT_PERMISSIONS.create],
          fallbackElement: (
            <MovementPermissionFallback message="No tienes permisos para crear instituciones." />
          ),
        }}
      />
    ),
  },
  {
    path: "movements/institutions/edit/:id",
    element: (
      <ProtectedRouteElement
        component={EditInstitution}
        componentProps={{
          requiredPermissions: [MOVEMENT_PERMISSIONS.edit],
          fallbackElement: (
            <MovementPermissionFallback message="No tienes permisos para editar instituciones." />
          ),
        }}
      />
    ),
  },
  {
    path: "movements/contacts",
    element: (
      <ProtectedRouteElement
        component={ContactsList}
        componentProps={{
          requiredPermissions: [
            MOVEMENT_PERMISSIONS.view,
            MOVEMENT_PERMISSIONS.create,
            MOVEMENT_PERMISSIONS.edit,
            MOVEMENT_PERMISSIONS.delete,
          ],
          permissionMode: "some",
          fallbackElement: (
            <MovementPermissionFallback message="No tienes permisos para consultar contactos de movimientos." />
          ),
        }}
      />
    ),
  },
  {
    path: "movements/contacts/new",
    element: (
      <ProtectedRouteElement
        component={NewContact}
        componentProps={{
          requiredPermissions: [MOVEMENT_PERMISSIONS.create],
          fallbackElement: (
            <MovementPermissionFallback message="No tienes permisos para crear contactos." />
          ),
        }}
      />
    ),
  },
  {
    path: "movements/contacts/edit/:id",
    element: (
      <ProtectedRouteElement
        component={EditContact}
        componentProps={{
          requiredPermissions: [MOVEMENT_PERMISSIONS.edit],
          fallbackElement: (
            <MovementPermissionFallback message="No tienes permisos para editar contactos." />
          ),
        }}
      />
    ),
  },
  {
    path: "movements/venues",
    element: (
      <ProtectedRouteElement
        component={VenuesList}
        componentProps={{
          requiredPermissions: [
            MOVEMENT_PERMISSIONS.view,
            MOVEMENT_PERMISSIONS.create,
            MOVEMENT_PERMISSIONS.edit,
            MOVEMENT_PERMISSIONS.delete,
          ],
          permissionMode: "some",
          fallbackElement: (
            <MovementPermissionFallback message="No tienes permisos para consultar sedes de movimientos." />
          ),
        }}
      />
    ),
  },
  {
    path: "movements/venues/new",
    element: (
      <ProtectedRouteElement
        component={NewVenue}
        componentProps={{
          requiredPermissions: [MOVEMENT_PERMISSIONS.create],
          fallbackElement: (
            <MovementPermissionFallback message="No tienes permisos para crear sedes." />
          ),
        }}
      />
    ),
  },
  {
    path: "movements/venues/edit/:id",
    element: (
      <ProtectedRouteElement
        component={EditVenue}
        componentProps={{
          requiredPermissions: [MOVEMENT_PERMISSIONS.edit],
          fallbackElement: (
            <MovementPermissionFallback message="No tienes permisos para editar sedes." />
          ),
        }}
      />
    ),
  },
  {
    path: "movements/exhibitions",
    element: (
      <ProtectedRouteElement
        component={ExhibitionsList}
        componentProps={{
          requiredPermissions: [
            MOVEMENT_PERMISSIONS.view,
            MOVEMENT_PERMISSIONS.create,
            MOVEMENT_PERMISSIONS.edit,
            MOVEMENT_PERMISSIONS.delete,
          ],
          permissionMode: "some",
          fallbackElement: (
            <MovementPermissionFallback message="No tienes permisos para consultar exposiciones de movimientos." />
          ),
        }}
      />
    ),
  },
  {
    path: "movements/exhibitions/new",
    element: (
      <ProtectedRouteElement
        component={NewExhibition}
        componentProps={{
          requiredPermissions: [MOVEMENT_PERMISSIONS.create],
          fallbackElement: (
            <MovementPermissionFallback message="No tienes permisos para crear exposiciones." />
          ),
        }}
      />
    ),
  },
  {
    path: "movements/exhibitions/edit/:id",
    element: (
      <ProtectedRouteElement
        component={EditExhibition}
        componentProps={{
          requiredPermissions: [MOVEMENT_PERMISSIONS.edit],
          fallbackElement: (
            <MovementPermissionFallback message="No tienes permisos para editar exposiciones." />
          ),
        }}
      />
    ),
  },
];
