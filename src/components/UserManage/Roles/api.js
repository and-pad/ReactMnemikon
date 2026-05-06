import SETTINGS from "../../Config/settings";
import { fetchWithAuth } from "../../LoginComponents/handleLogin";

const parseJsonResponse = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    console.error("No fue posible interpretar la respuesta JSON", error);
    return false;
  }
};

const requestWithAuth = async ({
  accessToken,
  refreshToken,
  url,
  method = "GET",
  payload,
}) => {
  try {
    const response = await fetchWithAuth(
      url,
      {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        ...(payload ? { body: JSON.stringify(payload) } : {}),
      },
      { accessToken, refreshToken },
    );

    return await parseJsonResponse(response);
  } catch (error) {
    console.error(error);
    return false;
  }
};

const apiBase = SETTINGS.URL_ADDRESS.server_api_commands + "auth/role_manage/";

export const API_RequestRolesAdmin = async ({ accessToken, refreshToken }) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: apiBase,
  });

export const API_CreateRole = async ({ accessToken, refreshToken, payload }) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: apiBase,
    method: "POST",
    payload,
  });

export const API_UpdateRolePermissions = async ({
  accessToken,
  refreshToken,
  roleId,
  permissionIds,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}roles/${roleId}/permissions/`,
    method: "PUT",
    payload: { permission_ids: permissionIds },
  });

export const API_RequestUserRoleAccess = async ({
  accessToken,
  refreshToken,
  userId,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}users/${userId}/`,
  });

export const API_UpdateUserRoleAccess = async ({
  accessToken,
  refreshToken,
  userId,
  roleIds,
  permissionIds,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}users/${userId}/`,
    method: "PUT",
    payload: {
      role_ids: roleIds,
      permission_ids: permissionIds,
    },
  });
