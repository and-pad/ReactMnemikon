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

export const API_RequestContacts = async ({
  accessToken,
  refreshToken,
  search = "",
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/contacts/?search=${encodeURIComponent(search)}`;

  return requestWithAuth({ accessToken, refreshToken, url });
};

export const API_RequestContact = async ({
  accessToken,
  refreshToken,
  contactId,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/contacts/${contactId}/`;

  return requestWithAuth({ accessToken, refreshToken, url });
};

export const API_CreateContact = async ({
  accessToken,
  refreshToken,
  payload,
}) => {
  const url = SETTINGS.URL_ADDRESS.server_api_commands + "authenticated/contacts/";

  return requestWithAuth({
    accessToken,
    refreshToken,
    url,
    method: "POST",
    payload,
  });
};

export const API_UpdateContact = async ({
  accessToken,
  refreshToken,
  contactId,
  payload,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/contacts/${contactId}/`;

  return requestWithAuth({
    accessToken,
    refreshToken,
    url,
    method: "PUT",
    payload,
  });
};

export const API_DeleteContact = async ({
  accessToken,
  refreshToken,
  contactId,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/contacts/${contactId}/`;

  return requestWithAuth({
    accessToken,
    refreshToken,
    url,
    method: "DELETE",
  });
};
