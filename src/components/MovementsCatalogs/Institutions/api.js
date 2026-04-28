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

export const API_RequestInstitutions = async ({
  accessToken,
  refreshToken,
  search = "",
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/institutions/?search=${encodeURIComponent(search)}`;

  return requestWithAuth({ accessToken, refreshToken, url });
};

export const API_RequestInstitution = async ({
  accessToken,
  refreshToken,
  institutionId,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/institutions/${institutionId}/`;

  return requestWithAuth({ accessToken, refreshToken, url });
};

export const API_CreateInstitution = async ({
  accessToken,
  refreshToken,
  payload,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands + "authenticated/institutions/";

  return requestWithAuth({
    accessToken,
    refreshToken,
    url,
    method: "POST",
    payload,
  });
};

export const API_UpdateInstitution = async ({
  accessToken,
  refreshToken,
  institutionId,
  payload,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/institutions/${institutionId}/`;

  return requestWithAuth({
    accessToken,
    refreshToken,
    url,
    method: "PUT",
    payload,
  });
};

export const API_DeleteInstitution = async ({
  accessToken,
  refreshToken,
  institutionId,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/institutions/${institutionId}/`;

  return requestWithAuth({
    accessToken,
    refreshToken,
    url,
    method: "DELETE",
  });
};
