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