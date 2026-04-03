import SETTINGS from "../Config/settings";
import { fetchWithAuth } from "../LoginComponents/handleLogin";

const parseJsonResponse = async (response) => {
  try {
    return await response.json();
  } catch (e) {
    console.error("No fue posible interpretar la respuesta JSON", e);
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
      { accessToken, refreshToken }
    );

    return await parseJsonResponse(response);
  } catch (e) {
    console.log("in api call catch");
    console.error(e);
    return false;
  }
};

export const API_RequestMovements = async ({
  accessToken,
  refreshToken,
  page,
  rowsPerPage,
  filterText,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/movements/manage?page=${page}&per_page=${rowsPerPage}&search=${encodeURIComponent(filterText || "")}`;

  try {
    const response = await fetchWithAuth(
      url,
      {
        method: "GET",
      },
      { accessToken, refreshToken }
    );

    if (response.ok) {
      return await response.json();
    }

    return await response.json();
  } catch (e) {
    console.log("in api call catch");
    console.error(e);
    return false;
  }
};

export const API_RequestMovementNew = async ({
  accessToken,
  refreshToken,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands + "authenticated/movements/manage/new/";

  return requestWithAuth({ accessToken, refreshToken, url });
};

export const API_CreateMovement = async ({
  accessToken,
  refreshToken,
  payload,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands + "authenticated/movements/manage/new/";

  return requestWithAuth({
    accessToken,
    refreshToken,
    url,
    method: "POST",
    payload,
  });
};

export const API_RequestMovementEdit = async ({
  accessToken,
  refreshToken,
  movementId,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/movements/manage/edit/${movementId}/`;

  return requestWithAuth({ accessToken, refreshToken, url });
};

export const API_UpdateMovement = async ({
  accessToken,
  refreshToken,
  movementId,
  payload,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/movements/manage/edit/${movementId}/`;

  return requestWithAuth({
    accessToken,
    refreshToken,
    url,
    method: "PUT",
    payload,
  });
};

export const API_RequestMovementContacts = async ({
  accessToken,
  refreshToken,
  institutionIds,
}) => {
  const ids = (institutionIds || []).join(",");
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/movements/manage/contacts/${ids}/`;

  return requestWithAuth({ accessToken, refreshToken, url });
};

export const API_RequestMovementExhibitions = async ({
  accessToken,
  refreshToken,
  institutionIds,
}) => {
  const ids = (institutionIds || []).join(",");
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/movements/manage/exhibitions/${ids}/`;

  return requestWithAuth({ accessToken, refreshToken, url });
};

export const API_RequestMovementVenues = async ({
  accessToken,
  refreshToken,
  institutionIds,
}) => {
  const ids = (institutionIds || []).join(",");
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/movements/manage/venues/${ids}/`;

  return requestWithAuth({ accessToken, refreshToken, url });
};
