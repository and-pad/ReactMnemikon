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

export const API_RequestReports = async ({ accessToken, refreshToken }) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands + "authenticated/reports/";

  return requestWithAuth({ accessToken, refreshToken, url });
};

export const API_RequestReportsMeta = async ({ accessToken, refreshToken }) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands + "authenticated/reports/meta/";

  return requestWithAuth({ accessToken, refreshToken, url });
};

export const API_RequestReport = async ({
  accessToken,
  refreshToken,
  reportId,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/reports/${reportId}/`;

  return requestWithAuth({ accessToken, refreshToken, url });
};

export const API_RequestReportPreview = async ({
  accessToken,
  refreshToken,
  reportId,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/reports/${reportId}/preview/`;

  return requestWithAuth({ accessToken, refreshToken, url });
};

export const API_CreateReport = async ({
  accessToken,
  refreshToken,
  payload,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands + "authenticated/reports/";

  return requestWithAuth({
    accessToken,
    refreshToken,
    url,
    method: "POST",
    payload,
  });
};

export const API_UpdateReport = async ({
  accessToken,
  refreshToken,
  reportId,
  payload,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/reports/${reportId}/`;

  return requestWithAuth({
    accessToken,
    refreshToken,
    url,
    method: "PUT",
    payload,
  });
};

export const API_DeleteReport = async ({
  accessToken,
  refreshToken,
  reportId,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/reports/${reportId}/`;

  return requestWithAuth({
    accessToken,
    refreshToken,
    url,
    method: "DELETE",
  });
};

export const API_DownloadReportPdf = async ({
  accessToken,
  refreshToken,
  reportId,
  selectedPieceIds = [],
}) => {
  const params = new URLSearchParams();
  if (selectedPieceIds.length) {
    params.set("selected_piece_ids", selectedPieceIds.join(","));
  }
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/reports/${reportId}/pdf/${params.toString() ? `?${params.toString()}` : ""}`;

  try {
    const response = await fetchWithAuth(
      url,
      {
        method: "GET",
      },
      { accessToken, refreshToken },
    );

    if (!response.ok) {
      try {
        return await response.json();
      } catch (error) {
        console.error(error);
        return { error: "No fue posible descargar el PDF." };
      }
    }

    const blob = await response.blob();
    const disposition = response.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename=\"?([^"]+)\"?/i);
    const fileName = match?.[1] || `reporte_${reportId}.pdf`;

    return { blob, fileName };
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const API_RequestReportPieces = async ({
  accessToken,
  refreshToken,
  page = 1,
  pageSize = 10,
  search = "",
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/reports/pieces/?page=${page}&page_size=${pageSize}&search=${encodeURIComponent(search)}`;

  return requestWithAuth({ accessToken, refreshToken, url });
};

export const API_RequestReportTemplates = async ({
  accessToken,
  refreshToken,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands + "authenticated/report-templates/";

  return requestWithAuth({ accessToken, refreshToken, url });
};

export const API_CreateReportTemplate = async ({
  accessToken,
  refreshToken,
  payload,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands + "authenticated/report-templates/";

  return requestWithAuth({
    accessToken,
    refreshToken,
    url,
    method: "POST",
    payload,
  });
};

export const API_DeleteReportTemplate = async ({
  accessToken,
  refreshToken,
  templateId,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/report-templates/${templateId}/`;

  return requestWithAuth({
    accessToken,
    refreshToken,
    url,
    method: "DELETE",
  });
};
