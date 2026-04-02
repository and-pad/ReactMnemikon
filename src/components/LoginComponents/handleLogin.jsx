import Cookies from "js-cookie";
import SETTINGS from "../Config/settings";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "User";
const PERMISSIONS_KEY = "permissions";

const parseStoredValue = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const setStoredValue = (key, value) => {
  if (value === undefined) {
    return;
  }

  const serialized = JSON.stringify(value);
  Cookies.set(key, serialized);
  localStorage.setItem(key, serialized);
};

const getStoredValue = (key) => {
  const cookieValue = parseStoredValue(Cookies.get(key));
  if (cookieValue !== null) {
    return cookieValue;
  }

  return parseStoredValue(localStorage.getItem(key));
};

const removeStoredValue = (key) => {
  Cookies.remove(key);
  localStorage.removeItem(key);
};

const isBrowser = typeof window !== "undefined";

const redirectToLogin = () => {
  if (!isBrowser) {
    return;
  }

  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
};

const isTokenNotValidResponse = async (response) => {
  try {
    const data = await response.clone().json();
    return data?.code === "token_not_valid";
  } catch {
    return false;
  }
};

let refreshPromise = null;

export const getAccessToken = () => getStoredValue(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => getStoredValue(REFRESH_TOKEN_KEY);

export const setTokens = ({ access, refresh, user, permissions }) => {
  if (access !== undefined) {
    setStoredValue(ACCESS_TOKEN_KEY, access);
  }

  if (refresh !== undefined) {
    setStoredValue(REFRESH_TOKEN_KEY, refresh);
  }

  if (user !== undefined) {
    setStoredValue(USER_KEY, user);
  }

  if (permissions !== undefined) {
    setStoredValue(PERMISSIONS_KEY, permissions);
  }
};

export const clearTokens = () => {
  removeStoredValue(ACCESS_TOKEN_KEY);
  removeStoredValue(REFRESH_TOKEN_KEY);
  removeStoredValue(USER_KEY);
  removeStoredValue(PERMISSIONS_KEY);
};

export const refreshAccessToken = async (refreshToken) => {
  const activeRefreshToken = refreshToken || getRefreshToken();

  if (!activeRefreshToken) {
    clearTokens();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const url = SETTINGS.URL_ADDRESS.server_api_commands + "auth/signin/";
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: activeRefreshToken }),
      });

      if (!response.ok) {
        clearTokens();
        return null;
      }

      const data = await response.json();
      setTokens({
        access: data.access,
        refresh: activeRefreshToken,
        user: data.user,
        permissions: data.permissions,
      });

      return data;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

export const fetchWithAuth = async (
  url,
  options = {},
  { accessToken, refreshToken, retry = true } = {}
) => {
  const currentAccessToken = accessToken || getAccessToken();
  const headers = new Headers(options.headers || {});

  if (currentAccessToken) {
    headers.set("Authorization", `Bearer ${currentAccessToken}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!retry || response.ok ) {
    return response;
  }
    if (response.status === 403) {
    const refreshed = await refreshAccessToken(refreshToken);
    if (!refreshed?.access) {
        redirectToLogin();
        return response;
    }
}

  const retryHeaders = new Headers(options.headers || {});
  retryHeaders.set("Authorization", `Bearer ${refreshed.access}`);

  return fetch(url, {
    ...options,
    headers: retryHeaders,
  });
};

export var handleLogin = async ({ email, password }) => {
  try {
    const url = SETTINGS.URL_ADDRESS.server_api_commands + "auth/signin/";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      setTokens(data);
      return data;
    }

    return "not authenticated";
  } catch (error) {
    console.error("elerror", error);
    return "not network";
  }
};

export var handleLoggedTime = async (accessToken, refreshToken) => {
  try {
    const url = SETTINGS.URL_ADDRESS.server_api_commands + "auth/check/";
    const currentAccessToken = accessToken || getAccessToken();
    console.log("currentAccessToken", currentAccessToken);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentAccessToken}`,
      },
    });

    if (response.ok) {
      return await response.json();
    }

    if (response.status === 403 ) {
      try {
        const data = await refreshAccessToken(refreshToken);
        if (data?.access) {
          return data;
        }

        redirectToLogin();
        return "login_redirect";
      } catch (error) {
        console.log(error);
        return "not network1";
      }
    }

    console.error("Error en la solicitud:", response.status);
    return false;
  } catch (error) {
    console.error(error);
    return "not network2";
  }
};
