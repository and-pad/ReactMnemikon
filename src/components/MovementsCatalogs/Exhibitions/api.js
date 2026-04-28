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

export const API_RequestExhibitions = async ({
  accessToken,
  refreshToken,
  search = "",
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/exhibitions/?search=${encodeURIComponent(search)}`;

  return requestWithAuth({ accessToken, refreshToken, url });
};

export const API_RequestExhibition = async ({
  accessToken,
  refreshToken,
  exhibitionId,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/exhibitions/${exhibitionId}/`;

  return requestWithAuth({ accessToken, refreshToken, url });
};

export const API_CreateExhibition = async ({
  accessToken,
  refreshToken,
  payload,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands + "authenticated/exhibitions/";

  return requestWithAuth({
    accessToken,
    refreshToken,
    url,
    method: "POST",
    payload,
  });
};

export const API_UpdateExhibition = async ({
  accessToken,
  refreshToken,
  exhibitionId,
  payload,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/exhibitions/${exhibitionId}/`;

  return requestWithAuth({
    accessToken,
    refreshToken,
    url,
    method: "PUT",
    payload,
  });
};

export const API_DeleteExhibition = async ({
  accessToken,
  refreshToken,
  exhibitionId,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/exhibitions/${exhibitionId}/`;

  return requestWithAuth({
    accessToken,
    refreshToken,
    url,
    method: "DELETE",
  });
};

export const API_RequestContactsByInstitution = async ({
  accessToken,
  refreshToken,
  institutionId,
}) => {
  const ids = institutionId ? [institutionId].join(",") : "";
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/movements/manage/contacts/${ids}/`;

  return requestWithAuth({ accessToken, refreshToken, url });
};
