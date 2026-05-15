import {
  PermissionFallback,
  hasAnyPermission,
  hasPermission,
} from "../PiecesQueries/inventoryPermissions";

export const RESTORATION_PERMISSIONS = {
  view: "ver_restauracion",
  create: "agregar_restauracion",
  edit: "editar_restauracion",
  delete: "eliminar_restauracion",
};

export const canViewRestoration = (permissions = []) =>
  hasPermission(permissions, RESTORATION_PERMISSIONS.view);

export const canCreateRestoration = (permissions = []) =>
  hasPermission(permissions, RESTORATION_PERMISSIONS.create);

export const canEditRestoration = (permissions = []) =>
  hasPermission(permissions, RESTORATION_PERMISSIONS.edit);

export const canDeleteRestoration = (permissions = []) =>
  hasPermission(permissions, RESTORATION_PERMISSIONS.delete);

export const canAccessRestorationRecords = (permissions = []) =>
  hasAnyPermission(permissions, [
    RESTORATION_PERMISSIONS.view,
    RESTORATION_PERMISSIONS.create,
    RESTORATION_PERMISSIONS.edit,
    RESTORATION_PERMISSIONS.delete,
  ]);

export function RestorationPermissionFallback(props) {
  return <PermissionFallback {...props} />;
}
