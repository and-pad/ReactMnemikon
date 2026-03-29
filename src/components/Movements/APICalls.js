import SETTINGS from "../Config/settings";

export const API_RequestMovements = async ({
  accessToken,
  refreshToken,
  page,
  rowsPerPage,
  filterText,

}) => {
  console.log("accessToken in APICalls", accessToken);
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/movements/manage?page=${page}&per_page=${rowsPerPage}&search=${encodeURIComponent(filterText || "")}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
          
          'Authorization': `Bearer ${accessToken}`
      },
    });
    if (response.ok) {
      return await response.json();
    }
    return response.json();
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
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      return await response.json();
    }
    return response.json();
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
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      return await response.json();
    }
    return response.json();
  } catch (e) {
    console.log("in api call catch");
    console.error(e);
    return false;
  }
};
