export const REPORT_PERMISSIONS = {
  view: "ver_reportes",
  create: "agregar_reportes",
  edit: "editar_reportes",
  delete: "eliminar_reportes",
};

export const hasReportPermission = (permissions = [], permission) =>
  Array.isArray(permissions) && permissions.includes(permission);

export const hasAnyReportPermission = (permissions = [], requiredPermissions = []) =>
  requiredPermissions.some((permission) =>
    hasReportPermission(permissions, permission),
  );

export const canViewReports = (permissions = []) =>
  hasReportPermission(permissions, REPORT_PERMISSIONS.view);

export const canCreateReports = (permissions = []) =>
  hasReportPermission(permissions, REPORT_PERMISSIONS.create);

export const canEditReports = (permissions = []) =>
  hasReportPermission(permissions, REPORT_PERMISSIONS.edit);

export const canDeleteReports = (permissions = []) =>
  hasReportPermission(permissions, REPORT_PERMISSIONS.delete);

export const canAccessReportsList = (permissions = []) =>
  hasAnyReportPermission(permissions, [
    REPORT_PERMISSIONS.view,
    REPORT_PERMISSIONS.edit,
    REPORT_PERMISSIONS.delete,
  ]);

export function ReportPermissionFallback({
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
