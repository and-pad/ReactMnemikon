import SETTINGS from "../Config/settings";
import { fetchWithAuth } from "../LoginComponents/handleLogin";

export const API_RequestPendingList = async ({
  accessToken,
  refreshToken,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    "authenticated/inventory_query/pending/list/";

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

export const API_RequestInventoryNew = async ({
  accessToken,
  refreshToken,
  changes,
  PicsNew,
  DocumentsNew,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    "authenticated/inventory_query/new/";

  try {
    const formData = new FormData();
    formData.append("changes", JSON.stringify(changes || {}));
    formData.append("PicsNew", JSON.stringify(PicsNew || {}));
    formData.append("DocumentsNew", JSON.stringify(DocumentsNew || {}));

    if (PicsNew && Object.keys(PicsNew).length > 0) {
      for (const [key, { file }] of Object.entries(PicsNew)) {
        formData.append(`files[new_img_${key}]`, file);
      }
    }

    if (DocumentsNew && Object.keys(DocumentsNew).length > 0) {
      for (const [key, { file }] of Object.entries(DocumentsNew)) {
        formData.append(`files[new_doc_${key}]`, file);
      }
    }

    const response = await fetchWithAuth(
      url,
      {
        method: "POST",
        body: formData,
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

export const API_RequestInventoryEdit = async ({
  accessToken,
  refreshToken,
  _id,
  changes,
  changes_pics_inputs,
  changedPics,
  PicsNew,
  changedDocs,
  DocumentsNew,
  changes_docs_inputs,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/inventory_query/edit/${_id}/`;

  try {
    const formData = new FormData();
    formData.append("changes", JSON.stringify(changes || {}));
    formData.append(
      "changes_pics_inputs",
      JSON.stringify(changes_pics_inputs || {})
    );
    formData.append(
      "changes_docs_inputs",
      JSON.stringify(changes_docs_inputs || {})
    );
    formData.append("PicsNew", JSON.stringify(PicsNew || {}));
    formData.append("DocumentsNew", JSON.stringify(DocumentsNew || {}));

    let files = {};

    if (changedPics && Object.keys(changedPics).length > 0) {
      for (const [key, { _id: picId, file }] of Object.entries(changedPics)) {
        formData.append(`files[changed_img_${key}]`, file);
        files[key] = { _id: picId };
      }
      formData.append("changed_pics", JSON.stringify(files));
    }

    if (PicsNew && Object.keys(PicsNew).length > 0) {
      for (const [key, { file }] of Object.entries(PicsNew)) {
        formData.append(`files[new_img_${key}]`, file);
      }
    }

    if (DocumentsNew && Object.keys(DocumentsNew).length > 0) {
      for (const [key, { file }] of Object.entries(DocumentsNew)) {
        formData.append(`files[new_doc_${key}]`, file);
      }
    }

    files = {};
    if (changedDocs && Object.keys(changedDocs).length > 0) {
      for (const [key, { _id: docId, file }] of Object.entries(changedDocs)) {
        formData.append(`files[changed_doc_${key}]`, file);
        files[key] = { _id: docId };
      }
      formData.append("changed_docs", JSON.stringify(files));
    }

    const response = await fetchWithAuth(
      url,
      {
        method: "POST",
        body: formData,
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

export const API_SendNewApprovralDecision = async ({
  accessToken,
  refreshToken,
  itemId,
  approved,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/inventory_query/new/${itemId}/`;

  try {
    const response = await fetchWithAuth(
      url,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isApproved: approved }),
      },
      { accessToken, refreshToken }
    );

    if (response.ok) {
      return await response.json();
    }

    const data = await response.json();
    console.log("error", data);
    return { error: response };
  } catch {
    return false;
  }
};

export const API_SendApprovralDecision = async ({
  accessToken,
  refreshToken,
  ID,
  isApproved,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/inventory_query/edit/${ID}/`;

  try {
    const response = await fetchWithAuth(
      url,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isApproved }),
      },
      { accessToken, refreshToken }
    );

    if (response.ok) {
      return await response.json();
    }

    const data = await response.json();
    console.log("error", data);
    return { error: response };
  } catch {
    return false;
  }
};

const API_inventory_fetch_edit = async (accessToken, refreshToken, _id) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/inventory_query/edit/${_id}/`;

  return fetchWithAuth(url, requestOptions, { accessToken, refreshToken });
};

export const fetchInventoryEdit = async (accessToken, refreshToken, _id) => {
  const response = await API_inventory_fetch_edit(accessToken, refreshToken, _id);

  if (response.ok) {
    return await response.json();
  }

  if (response.status === 401) {
    return { no_permission: response };
  }

  const errorData = await response.json();
  if (errorData.code === "token_not_valid") {
    return "error: impossible to comunicate to server";
  }

  return "error: impossible to comunicate to server";
};

const API_inventory_fetch_new = async (accessToken, refreshToken) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    "authenticated/inventory_query/new/";

  return fetchWithAuth(url, requestOptions, { accessToken, refreshToken });
};

export const fetchNewInventory = async (accessToken, refreshToken) => {
  const response = await API_inventory_fetch_new(accessToken, refreshToken);

  if (response.ok) {
    const data = await response.json();
    console.log("data new inventory", data);
    return data;
  }

  return true;
};
