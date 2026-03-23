import SETTINGS from "../Config/settings";

export const fetchDashboard = async ({accessToken, refreshToken} ) => {
    console.log(accessToken);
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/dashboard/`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return true;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};
