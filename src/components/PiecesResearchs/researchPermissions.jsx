import {
  PermissionFallback,
  hasAnyPermission,
  hasPermission,
} from "../PiecesQueries/inventoryPermissions";

export const RESEARCH_PERMISSIONS = {
  view: "ver_investigacion",
  create: "agregar_investigacion",
  edit: "editar_investigacion",
  delete: "eliminar_investigacion",
  authorize: "autorizar_investigaciones",
};

export const canViewResearch = (permissions = []) =>
  hasPermission(permissions, RESEARCH_PERMISSIONS.view);

export const canCreateResearch = (permissions = []) =>
  hasPermission(permissions, RESEARCH_PERMISSIONS.create);

export const canEditResearch = (permissions = []) =>
  hasPermission(permissions, RESEARCH_PERMISSIONS.edit);

export const canDeleteResearch = (permissions = []) =>
  hasPermission(permissions, RESEARCH_PERMISSIONS.delete);

export const canAuthorizeResearch = (permissions = []) =>
  hasPermission(permissions, RESEARCH_PERMISSIONS.authorize);

export const canOpenResearchEditor = (permissions = []) =>
  hasAnyPermission(permissions, [
    RESEARCH_PERMISSIONS.create,
    RESEARCH_PERMISSIONS.edit,
  ]);

export function ResearchPermissionFallback(props) {
  return <PermissionFallback {...props} />;
}
