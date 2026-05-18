export const MOVEMENT_PERMISSIONS = {
  view: "ver_movimientos",
  create: "agregar_movimientos",
  edit: "editar_movimientos",
  delete: "eliminar_movimientos",
  authorize: "autorizar_movimientos",
};

export const hasMovementPermission = (permissions = [], permission) =>
  Array.isArray(permissions) && permissions.includes(permission);

export const hasAnyMovementPermission = (permissions = [], requiredPermissions = []) =>
  requiredPermissions.some((permission) =>
    hasMovementPermission(permissions, permission),
  );

export const canViewMovements = (permissions = []) =>
  hasMovementPermission(permissions, MOVEMENT_PERMISSIONS.view);

export const canCreateMovements = (permissions = []) =>
  hasMovementPermission(permissions, MOVEMENT_PERMISSIONS.create);

export const canEditMovements = (permissions = []) =>
  hasMovementPermission(permissions, MOVEMENT_PERMISSIONS.edit);

export const canDeleteMovements = (permissions = []) =>
  hasMovementPermission(permissions, MOVEMENT_PERMISSIONS.delete);

export const canAuthorizeMovements = (permissions = []) =>
  hasMovementPermission(permissions, MOVEMENT_PERMISSIONS.authorize);

export const canAccessMovementsList = (permissions = []) =>
  hasAnyMovementPermission(permissions, [
    MOVEMENT_PERMISSIONS.view,
    MOVEMENT_PERMISSIONS.edit,
    MOVEMENT_PERMISSIONS.delete,
    MOVEMENT_PERMISSIONS.authorize,
  ]);

export const canAccessMovementCatalogs = (permissions = []) =>
  hasAnyMovementPermission(permissions, [
    MOVEMENT_PERMISSIONS.view,
    MOVEMENT_PERMISSIONS.create,
    MOVEMENT_PERMISSIONS.edit,
    MOVEMENT_PERMISSIONS.delete,
  ]);

export const canManageMovementDraft = (permissions = []) =>
  hasAnyMovementPermission(permissions, [
    MOVEMENT_PERMISSIONS.create,
    MOVEMENT_PERMISSIONS.edit,
  ]);

export function MovementPermissionFallback({
  title = "Sin permisos",
  message = "No tienes permisos para acceder a esta vista.",
}) {
  return (
    <div className="container py-4">
      <div className="alert alert-warning mb-0">
        <strong>{title}</strong>
        <div>{message}</div>
      </div>
    </div>
  );
}
