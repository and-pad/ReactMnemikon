import SETTINGS from "../Config/settings";

export const API_RequestPendingList = async ({
  accessToken,
  refreshToken,
}) => {
  console.log("accessToken in APICalls", accessToken);
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/inventory_query/pending/list/`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
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
export const API_RequestInventoryNew = async ({
  accessToken,
  refreshToken,
  
  changes,
  PicsNew,
  DocumentsNew,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/inventory_query/new/`;
      
  try {
    const formData = new FormData();
    // Agregar datos JSON+
    formData.append("changes", JSON.stringify(changes || {}));
    formData.append("PicsNew", JSON.stringify(PicsNew || {}));
    formData.append("DocumentsNew", JSON.stringify(DocumentsNew || {}));

    // Agregar datos y archivos separados

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

    const response = await fetch(url, {
      method: "POST",
      headers: {
        //Aquí es donde enviamos el token mismo que es tomado al hacer la peticion        
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
    if (response.ok) {
      return await response.json();
    }
    return true;
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
    // Agregar datos JSON+

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

    // Agregar datos y archivos separados
    // Asegurarse de que changed_pics no sea null/undefined
    let files = {};   

    if (changedPics && Object.keys(changedPics).length > 0) {
      for (const [key, { _id, file }] of Object.entries(changedPics)) {
        formData.append(`files[changed_img_${key}]`, file);
        files[`${key}`] = { _id };
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
    //console.log("fuera docs", changedDocs);
    if (changedDocs && Object.keys(changedDocs).length > 0) {
      for (const [key, { _id, file }] of Object.entries(changedDocs)) {
        formData.append(`files[changed_doc_${key}]`, file);
        files[`${key}`] = { _id };
        //console.log("changed_files docs", files);
      }
      formData.append("changed_docs", JSON.stringify(files));
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        //Aquí es donde enviamos el token mismo que es tomado al hacer la peticion        
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
    if (response.ok) {
      return await response.json();
    }
    return true;
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
  console.log("accessToken in API_SendNewApprovralDecision", accessToken);
  console.log("API_SendNewApprovralDecision called with ID:", itemId, "isApproved:", approved);
  const url = SETTINGS.URL_ADDRESS.server_api_commands + `authenticated/inventory_query/new/${itemId}/`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        //aqui es donde enviamos el token mismo que es tomado al hacer la peticion
        //por eso en este caso el body va vacío.
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ isApproved: approved }),
    });

    if (response.ok) {
      const data = await response.json();
      //console.log('data response from save',data);
      return data;
    } else {
      const data = await response.json();
      console.log("error", data);
      return { error: response };
    }
  } catch {}
};
//tengo que ponerle al boton esta funcion para llamar a la api
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
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        //aqui es donde enviamos el token mismo que es tomado al hacer la peticion
        //por eso en este caso el body va vacío.
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ isApproved: isApproved }),
    });

    if (response.ok) {
      const data = await response.json();
      //console.log('data response from save',data);
      return data;
    } else {
      const data = await response.json();
      console.log("error", data);
      return { error: response };
    }
  } catch {}
};


const API_inventory_fetch_edit = async (accessToken, _id) => {
  const requestOptions = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
      },
  };
  const url = SETTINGS.URL_ADDRESS.server_api_commands + `authenticated/inventory_query/edit/${_id}/`;
  const response = await fetch(url, requestOptions)
  return response;

};

export const fetchInventoryEdit = async ( accessToken, refreshToken, _id ) => {
  
  const response = await API_inventory_fetch_edit(accessToken, _id);

  var data;
  if (response.ok) {
      data = await response.json();
      //console.log(data[appraisal],"Datatattatat");
      return data;
  } 
  else if (response.status === 401 )
    {
      console.log("401 error");
      return {no_permission: response};
    }  
  
  else {
      const errorData = await response.json();
      if (errorData.code === "token_not_valid") {
          try {

              //En esta url de api es para refrescar el accessToken con el refreshToken
              const url = SETTINGS.URL_ADDRESS.server_api_commands + 'auth/signin/';
              const response2 = await fetch(url, {
                  method: 'PUT',//En el metodo PUT es donde renovamos el accessToken
                  headers: {
                      'Content-Type': 'application/json',
                      /* 'Authorization': `Bearer ${accessToken}`,*/

                  },
                  body: JSON.stringify({ 'refresh': refreshToken }),//ponemos el RefreshToken en el body para que intente hacer la renovacion                        
              });
              //console.log({ refresh: refreshToken });
              if (response2.ok) {
                  //Esperamos a que nos de respuesta y lo convertimos en un objeto json.
                  //viene un json con un elemento llamado "access" que es el nuevo accessToken con tiempo renovado
                  
              }
              

          } catch {

          }
      } else {
          return 'error: impossible to comunicate to server';
      }
  }
}

const API_inventory_fetch_new = async (accessToken, _id) => {
  const requestOptions = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
      },
  };
  const url = SETTINGS.URL_ADDRESS.server_api_commands + `authenticated/inventory_query/new/`;
  const response = await fetch(url, requestOptions)
  return response;

}


export const fetchNewInventory = async (accessToken, refreshToken, _id) => {

  const response = await API_inventory_fetch_new(accessToken, _id);

  var data;
  if (response.ok) {
      data = await response.json();
      //console.log(data[appraisal],"Datatattatat");
      console.log("data new inventory",data);
      return data;
  } else {
    //filrar errores 401  
    return true;
  }
}

/*
const API_research_fetch_edit = async (accessToken, _id) => {
  const requestOptions = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
      },
  };
  const url = SETTINGS.URL_ADDRESS.server_api_commands + `authenticated/piece_research/edit/${_id}/`;
  const response = await fetch(url, requestOptions)
  return response;

};
*/
/*
export const fetchResearchEdit = async ( accessToken, refreshToken, _id ) => {
  
  const response = await API_research_fetch_edit(accessToken, _id);

  var data;
  if (response.ok) {
      data = await response.json();
      //console.log(data[appraisal],"Datatattatat");
      return data;
  } else {
      const errorData = await response.json();
      if (errorData.code === "token_not_valid") {
          try {

              //En esta url de api es para refrescar el accessToken con el refreshToken
              const url = SETTINGS.URL_ADDRESS.server_api_commands + 'auth/signin/';
              const response2 = await fetch(url, {
                  method: 'PUT',//En el metodo PUT es donde renovamos el accessToken
                  headers: {
                      'Content-Type': 'application/json',
                      /* 'Authorization': `Bearer ${accessToken}`,*/
/*
                  },
                  body: JSON.stringify({ 'refresh': refreshToken }),//ponemos el RefreshToken en el body para que intente hacer la renovacion                        
              });
              //console.log({ refresh: refreshToken });
              if (response2.ok) {
                  //Esperamos a que nos de respuesta y lo convertimos en un objeto json.
                  //viene un json con un elemento llamado "access" que es el nuevo accessToken con tiempo renovado
                  
              } else {
                  console.log("error", errorData);
                  return 'error: impossible to comunicate to server';
              }
          } catch {

          }
      }
  }
} 
*/