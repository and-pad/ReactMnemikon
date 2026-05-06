import SETTINGS from "../Config/settings";
import { fetchWithAuth } from "../LoginComponents/handleLogin";

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

const apiBase = SETTINGS.URL_ADDRESS.server_api_commands + "authenticated/";

export const API_RequestCatalogs = async ({
  accessToken,
  refreshToken,
  search = "",
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}catalogs/?search=${encodeURIComponent(search)}`,
  });

export const API_RequestCatalog = async ({
  accessToken,
  refreshToken,
  catalogId,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}catalogs/${catalogId}/`,
  });

export const API_CreateCatalog = async ({
  accessToken,
  refreshToken,
  payload,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}catalogs/`,
    method: "POST",
    payload,
  });

export const API_UpdateCatalog = async ({
  accessToken,
  refreshToken,
  catalogId,
  payload,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}catalogs/${catalogId}/`,
    method: "PUT",
    payload,
  });

export const API_DeleteCatalog = async ({
  accessToken,
  refreshToken,
  catalogId,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}catalogs/${catalogId}/`,
    method: "DELETE",
  });

export const API_RequestCatalogElements = async ({
  accessToken,
  refreshToken,
  catalogId,
  search = "",
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}catalogs/${catalogId}/elements/?search=${encodeURIComponent(search)}`,
  });

export const API_CreateCatalogElement = async ({
  accessToken,
  refreshToken,
  catalogId,
  payload,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}catalogs/${catalogId}/elements/`,
    method: "POST",
    payload,
  });

export const API_RequestCatalogElement = async ({
  accessToken,
  refreshToken,
  elementId,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}catalog-elements/${elementId}/`,
  });

export const API_UpdateCatalogElement = async ({
  accessToken,
  refreshToken,
  elementId,
  payload,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}catalog-elements/${elementId}/`,
    method: "PUT",
    payload,
  });

export const API_DeleteCatalogElement = async ({
  accessToken,
  refreshToken,
  elementId,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}catalog-elements/${elementId}/`,
    method: "DELETE",
  });

export const API_RequestGenders = async ({
  accessToken,
  refreshToken,
  search = "",
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}genders/?search=${encodeURIComponent(search)}`,
  });

export const API_RequestGender = async ({
  accessToken,
  refreshToken,
  genderId,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}genders/${genderId}/`,
  });

export const API_CreateGender = async ({
  accessToken,
  refreshToken,
  payload,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}genders/`,
    method: "POST",
    payload,
  });

export const API_UpdateGender = async ({
  accessToken,
  refreshToken,
  genderId,
  payload,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}genders/${genderId}/`,
    method: "PUT",
    payload,
  });

export const API_DeleteGender = async ({
  accessToken,
  refreshToken,
  genderId,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}genders/${genderId}/`,
    method: "DELETE",
  });

export const API_RequestSubgenders = async ({
  accessToken,
  refreshToken,
  genderId,
  search = "",
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}genders/${genderId}/subgenders/?search=${encodeURIComponent(search)}`,
  });

export const API_CreateSubgender = async ({
  accessToken,
  refreshToken,
  genderId,
  payload,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}genders/${genderId}/subgenders/`,
    method: "POST",
    payload,
  });

export const API_RequestSubgender = async ({
  accessToken,
  refreshToken,
  subgenderId,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}subgenders/${subgenderId}/`,
  });

export const API_UpdateSubgender = async ({
  accessToken,
  refreshToken,
  subgenderId,
  payload,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}subgenders/${subgenderId}/`,
    method: "PUT",
    payload,
  });

export const API_DeleteSubgender = async ({
  accessToken,
  refreshToken,
  subgenderId,
}) =>
  requestWithAuth({
    accessToken,
    refreshToken,
    url: `${apiBase}subgenders/${subgenderId}/`,
    method: "DELETE",
  });
