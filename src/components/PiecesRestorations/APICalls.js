
import { Form } from "react-router-dom";
import SETTINGS from "../Config/settings";

export const fetchRestorationEditSelect = async (accessToken, refreshToken, _id) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/piece_restorations/edit-select/${_id}/`;
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

export const fectchRestorationEdit = async (accessToken, refreshToken, _id, restoration_id) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/piece_restorations/edit-select/${_id}/restoration/${restoration_id}/`;
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

export const fetchRestorationUpdate = async ( accessToken,
        refreshToken,
        _id,
        restoration_id,
        changed,
        changedPics,
        changedPicsInputs,
        PicsNew,
        DocumentsNew,
        changedDocs        
      ) => {
 
  const url = SETTINGS.URL_ADDRESS.server_api_commands + `authenticated/piece_restorations/update/${_id}/restoration/${restoration_id}/`;

  const formData = new FormData();
  
  if (changed) {
    formData.append("formDatachanges", JSON.stringify(changed || {}));
    
  } 
  else {
    formData.append("formDatachanges", {});
   
  }

  //formData.append("changedPics", JSON.stringify(changedPics || {}));
  formData.append("changedPicsInputs", JSON.stringify(changedPicsInputs || {}));
  formData.append("PicsNew", JSON.stringify(PicsNew || {}));
  formData.append("changedDocs", JSON.stringify(changedDocs || {}));
  formData.append("DocumentsNew", JSON.stringify(DocumentsNew || {}));

  if (DocumentsNew && DocumentsNew.length > 0) {
    DocumentsNew.forEach((doc, index) => {
      if(!doc.file) return; // Skip if no file is present
      formData.append(`files[new_doc_${index}]`, doc.file);
    });
  }

if (PicsNew && PicsNew.length > 0) {
    PicsNew.forEach((pic, index) => {
      if(!pic.file) return; // Skip if no file is present
      formData.append(`files[new_img_${index}]`, pic.file);
    });
  }


let files = {};
if (changedPics && Object.keys(changedPics).length > 0) {
      for (const [key, { _id, file }] of Object.entries(changedPics)) {
        formData.append(`files[changed_img_${key}]`, file);
        files[`${key}`] = { _id };
      }
      formData.append("ChangedPics", JSON.stringify(files));
    }  

   if (changedDocs && Object.keys(changedDocs).length > 0) {
      for (const [key, { file }] of Object.entries(changed)) {
        if (!file) continue;
        formData.append(`files[changed_doc_${key}]`, file);        
      }
    } 
//console.log(Object.fromEntries(formData.entries()));

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {       
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return true;
    }

  }
  catch (e) {
    console.error(e);
    return false;
  }
 

}

export const fetchRestorationNew = async (accessToken, refreshToken, _id) => {

  const url = SETTINGS.URL_ADDRESS.server_api_commands + `authenticated/piece_restorations/new/${_id}/`;
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
  
}

export const fetchRestorationInsert = async (accessToken, refreshToken, _id, changed,  PicsNew,  DocumentsNew) => {
  const url = SETTINGS.URL_ADDRESS.server_api_commands + `authenticated/piece_restorations/insert/${_id}/`;
  console.log("accessToken",accessToken);
  const formData = new FormData();
  formData.append("formDatachanges", JSON.stringify(changed || {}));
  formData.append("PicsNew", JSON.stringify(PicsNew || {}));
  formData.append("DocumentsNew", JSON.stringify(DocumentsNew || {}));

  if (DocumentsNew && DocumentsNew.length > 0) {
    DocumentsNew.forEach((doc, index) => {
      if(!doc.file) return; // Skip if no file is present
      formData.append(`files[new_doc_${index}]`, doc.file);
    });
  }

if (PicsNew && PicsNew.length > 0) {
    PicsNew.forEach((pic, index) => {
      if(!pic.file) return; // Skip if no file is present
      formData.append(`files[new_img_${index}]`, pic.file);
    });
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
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
}