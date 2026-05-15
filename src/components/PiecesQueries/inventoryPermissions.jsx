export const INVENTORY_PERMISSIONS = {
  view: "ver_inventario",
  create: "agregar_inventario",
  edit: "editar_inventario",
  delete: "eliminar_inventario",
  authorize: "autorizar_colecciones",
};

export const hasPermission = (permissions = [], permission) =>
  Array.isArray(permissions) && permissions.includes(permission);

export const hasAnyPermission = (permissions = [], requiredPermissions = []) =>
  requiredPermissions.some((permission) => hasPermission(permissions, permission));

export const canViewInventory = (permissions = []) =>
  hasPermission(permissions, INVENTORY_PERMISSIONS.view);

export const canCreateInventory = (permissions = []) =>
  hasPermission(permissions, INVENTORY_PERMISSIONS.create);

export const canEditInventory = (permissions = []) =>
  hasPermission(permissions, INVENTORY_PERMISSIONS.edit);

export const canDeleteInventory = (permissions = []) =>
  hasPermission(permissions, INVENTORY_PERMISSIONS.delete);

export const canAuthorizeInventory = (permissions = []) =>
  hasPermission(permissions, INVENTORY_PERMISSIONS.authorize);

export function PermissionFallback({
  title = "No tienes permiso para acceder a esta vista.",
  description = "",
}) {
  return (
    <div className="container py-4">
      <div className="alert alert-warning mb-0">
        <strong>{title}</strong>
        {description ? <div className="mt-2">{description}</div> : null}
      </div>
    </div>
  );
}

export function InventoryPermissionFallback(props) {
  return <PermissionFallback {...props} />;
}
