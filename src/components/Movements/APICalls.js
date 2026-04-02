import SETTINGS from "../Config/settings";
import { fetchWithAuth } from "../LoginComponents/handleLogin";

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
    SETTINGS.URL_ADDRESS.server_api_commands + "authenticated/movements/new/";

  try {
    const response = await fetchWithAuth(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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

export const API_CreateMovement = async ({
  accessToken,
  refreshToken,
  payload,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands + "authenticated/movements/insert/";

  try {
    const response = await fetchWithAuth(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
