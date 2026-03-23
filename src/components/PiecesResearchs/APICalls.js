import SETTINGS from "../Config/settings";

export const API_RequestResearchs = async ({ accessToken, refreshToken }) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands + "authenticated/piece_research/";
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
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

export const fetchResearchEdit = async (accessToken, refreshToken, _id) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/piece_researchs/edit/${_id}/`;
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

export const API_UpdateResearch = async ({
        accessToken,
        refreshToken,
        changes,
        changedPics,
        changes_pics_inputs,
        PicsNew,
        DocumentsNew,
        changes_documents,
        newBibliographies,
        newFootnotes,
        changes_bibliographies,
        changes_footnotes,
        
        _id,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/piece_researchs/edit/${_id}/`;
  try {
    
    const formData = new FormData();
    formData.append("Changes", JSON.stringify(changes || {}));
    
    formData.append("PicsNew", JSON.stringify(PicsNew || {}));
    formData.append("NewFootnotes", JSON.stringify(newFootnotes || {}));
    formData.append("NewBibliographies", JSON.stringify(newBibliographies || {}));
    formData.append("DocumentsNew", JSON.stringify(DocumentsNew || {}));
    formData.append("ChangesDocs", JSON.stringify(changes_documents || {}));
    formData.append("ChangesBibliographies", JSON.stringify(changes_bibliographies || {}));
    formData.append("ChangesFootnotes", JSON.stringify(changes_footnotes || {}));
    //formData.append("changed_docs", JSON.stringify(changedDocs || {}));
    if (DocumentsNew && Object.keys(DocumentsNew).length > 0) {
      for (const [key, { file }] of Object.entries(DocumentsNew)) {
        formData.append(`files[new_doc_${key}]`, file);
      }
    }
    if (changes_documents && Object.keys(changes_documents).length > 0) {
      for (const [key, { file }] of Object.entries(changes_documents)) {
        if (!file) continue;
        formData.append(`files[changed_doc_${key}]`, file);        
      }
    }
    
    if (PicsNew && Object.keys(PicsNew).length > 0) {
      for (const [key, { file }] of Object.entries(PicsNew)) {
        formData.append(`files[new_img_${key}]`, file);
      }
    }
    formData.append(
      "ChangesPicsInputs",
      JSON.stringify(changes_pics_inputs || {})
    );
    let files = {};

    if (changedPics && Object.keys(changedPics).length > 0) {
      for (const [key, { _id, file }] of Object.entries(changedPics)) {
        formData.append(`files[changed_img_${key}]`, file);
        files[`${key}`] = { _id };
      }
      formData.append("ChangedPics", JSON.stringify(files));
    }

    const response = await fetch(url, {
      method: "PATCH",
      headers: {        
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
    let data;
    if (response.ok) {
       data = await response.json();
      return data;
    } else {       
       data = await response.json();
      return data;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};
