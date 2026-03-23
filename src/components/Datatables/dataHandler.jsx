import { applyLogicToInventoryColumn } from "./columnDriver";
import SETTINGS from "../Config/settings";
import Cookies from "js-cookie";

const research_keys = [
  "title",
  "keywords",
  "technique",
  "materials",
  "acquisition_form",
  "acquisition_source",
  "acquisition_date",
  "firm_description",
  "short_description",
  "formal_description",
  "observation",
  "publications",
  "card",
];

function push_data(orderedData, column) {
  var data_c = [];
  data_c.push(orderedData);
  data_c.push(column);
  return data_c;
}

function push_array_data(orderedData, column) {
  var data_c = [];

  //console.log(orderedData['title']);
  var column_c;
  //console.log(column);
  if (column === "research_info") {
    //Del objeto orderedData extraemos la info de research_info
    for (var i = 0; i < research_keys.length; i++) {
      column_c = research_keys[i];
      data_c.push(push_data(orderedData[column_c], research_keys[i]));
    }
    return data_c;
  } else if (column === "location_info") {
    column_c = "name";
  } else if (column === "authors_info") {
    if (orderedData && orderedData.length > 0 && "title" in orderedData[0]) {
      data_c.push(orderedData[0]["title"]);
    }
  } else if (column === "involved_creation_info") {
    if (orderedData && orderedData.length > 0 && "title" in orderedData[0]) {
      data_c.push(orderedData[0]["title"]);
    }
  } else if (column === "period_info") {
    if (orderedData && orderedData.length > 0 && "title" in orderedData[0]) {
      data_c.push(orderedData[0]["title"]);
      //   console.log(orderedData[0]['title']);
    }
  } else if (column === "photo_thumb_info") {
    //  console.log('aqui si entra', orderedData);

    if (orderedData && "file_name" in orderedData) {
      data_c.push(orderedData["file_name"]);
      //       console.log('si', orderedData['file_name']);
    }
  } else {
    column_c = "title";
  }
  data_c.push(orderedData[column_c]);
  data_c.push(column);

  return data_c;
}

function structData(orderedData = null, column = null) {
  switch (column) {
    case "inventory_number":
    case "catalog_number":
    case "origin_number":
    case "tags":
    case "description_origin":
    case "description_inventory":
    case "measure_with":
    case "measure_without":
    case "_id":
    case "actions":
      return orderedData ? push_data(orderedData, column) : []; // Devuelve el resultado de push_data solo si orderedData no es nulo

    case "genders_info":
    case "subgenders_info":
    case "type_object_info":
    case "dominant_material_info":
    case "location_info":
    case "research_info":
    case "authors_info":
    case "involved_creation_info":
    case "period_info":
    case "photo_thumb_info":
      //console.log(orderedData);
      return orderedData ? push_array_data(orderedData, column) : [];
    default:
      return [];
  }
}

function omitingElements(size, hideConstructor, defColumns, module) {
  var out;
  if (hideConstructor.length >= size) {
    let quitElements = hideConstructor.length - size;
    quitElements = (quitElements + 1) * -1;
    let slice_elements = -2;
    //Query no tiene Actions solo muestra la foto -2 por foto y actions
    if (module === "Query") {
      slice_elements = -1;
    }
    out = hideConstructor.slice(quitElements, slice_elements); // Elementos que están fuera del tamaño

    out.forEach((element) => {
      const id = element.id;
      const correspondingElement = defColumns.find((item) => item.id === id);
      if (correspondingElement) {
        correspondingElement.omit = true;
      }
    });
  }
  return out;
}
// Define una función que aplique la lógica específica para cada propiedad de la columna
export function ConstructElementsToHide(
  defColumns,
  size,
  module,
  hideConstructor = [],
) {
  var out;
  if (hideConstructor.length !== 0) {
    out = omitingElements(size, hideConstructor, defColumns, module);
    return out;
  } else {
    var hideConstructorLoc = [];
    defColumns.forEach((element) => {
      if (element.show) {
        element.omit = false;
        hideConstructorLoc.push(element);
      }
    });
    out = omitingElements(size, hideConstructorLoc, defColumns, module);
    return out;
  }
}
export function formatData(
  Dataquery,
  size,
  module,
  isNeededApplyDefault,
  defColumnsUp = null,
  tableDataUp = null,
) {
  var StructuredData = [];
  var StructuredColumns = [];
  const order_columns = [
    "inventory_number",
    "catalog_number",
    "origin_number",
    "genders_info",
    "subgenders_info",
    "type_object_info",
    "dominant_material_info",
    "location_info",
    "tags",
    "description_origin",
    "description_inventory",
    "authors_info",
    "involved_creation_info",
    "period_info",
    "research_info",
    "measure_without",
    "measure_with",
    "photo_thumb_info",
    "_id",
    "actions_inventory",
    "actions_research",
    "actions_restoration",
  ];

  const orderedData = {};
  var defColumns = [];
  var tableData = [];
  if (isNeededApplyDefault) {
    const orderedDataArray = Dataquery.map((item) => {
      let data_column = {};
      order_columns.forEach((column, index) => {
        if (column === "measure_with") {
          let measure_w =
            item["height_with_base"] +
            " X " +
            item["width_with_base"] +
            " X " +
            item["depth_with_base"] +
            " ø" +
            item["diameter_with_base"];
          orderedData[column] = measure_w;
          data_column[column] = structData(orderedData[column], column);
          // console.log(measure_w);
          StructuredColumns.push(column);
        } else if (column === "measure_without") {
          let measure_wo =
            item["height"] +
            " X " +
            item["width"] +
            " X " +
            item["depth"] +
            " ø " +
            item["diameter"];
          orderedData[column] = measure_wo;
          data_column[column] = structData(orderedData[column], column);
          StructuredColumns.push(column);
        } else if (column === "actions_inventory" && module === "Inventory") {
          //  console.log('module', module);
          StructuredColumns.push(column);
        } else if (column === "actions_research" && module === "Research") {
          StructuredColumns.push(column);
        } else if (
          column === "actions_restoration" &&
          module === "Restoration"
        ) {
          StructuredColumns.push(column);
        } else if (column in item) {
          orderedData[column] = item[column];
          data_column[column] = structData(orderedData[column], column);

          let htmldat = [];
          const columnsToCheck = [
            "description_origin",
            "description_inventory",
            "subgenders_info",
            "type_object_info",
            "location_info",
          ];

          if (columnsToCheck.includes(column)) {
            let Cdat = data_column[column][0];
            htmldat = [Cdat];
            data_column[column][0] = htmldat;
          }
          if (data_column["research_info"]) {
            data_column[column].forEach((item) => {
              data_column[item[1]] = [];
              data_column[item[1]].push(item[0]);
              data_column[item[1]].push(item[1]);
            });
            if (data_column.hasOwnProperty(column)) {
              // Elimina la propiedad del objeto
              delete data_column[column]; //elimina research_info y en su lugar pone todos los campos que esta trae como nuevas columnas
            }
          }

          if (column === "research_info") {
            research_keys.forEach((item) => {
              StructuredColumns.push(item);
            });
          } else {
            StructuredColumns.push(column);
          }
          if (column === "_id") {
            let Cdat = data_column[column][0];
            // console.log('CdatID', Cdat);
            htmldat = [];
            htmldat.push(Cdat);
            data_column[column][0] = htmldat;
          }
        } else {
          orderedData[column] = null;
        }
      });
      //console.log('dataColumn', data_column);
      return data_column;
    });

    orderedDataArray.forEach((data_column) => {
      const rowData = {};
      for (const key in data_column) {
        if (data_column[key].length > 0) {
          // Tomar el primer elemento del array como el valor real
          rowData[key] = data_column[key][0];
        }
      }
      StructuredData.push(rowData); // Agregar la fila completa a StructuredData
    });
    tableData = StructuredData;

    // Definir las columnas de la tabla

    let hideConstructor = [];
    var out;

    defColumns = [...new Set(StructuredColumns)].map((column) => {
      //Se declaran los valores en general de los campos
      let columnProps = {
        id: column,
        name: "",
        selector: (row) => row[column],
        omit: false,
        sortable: true,
        show: false,
        
      };
      /* if (column === "_id"){
                console.log('column antes', columnProps);
            }*/
      //aplica los valores por default
      columnProps = applyLogicToInventoryColumn(
        column,
        columnProps /*onDetailClick*/,
      );
      //declara los valores que son para el expander component del datatables
      if (column === "_id") {
        columnProps.show = false;
        //console.log('column', columnProps);
      }

      if (columnProps.show) {
        hideConstructor.push(columnProps);
      }
      //regresa los valores de columnas para datatables.
      return columnProps;
    });

    out = ConstructElementsToHide(defColumns, size, module, hideConstructor);
  } else {
    //console.log("tableDataUp", tableDataUp);
    if (defColumnsUp !== null) {
      out = ConstructElementsToHide(defColumnsUp, size, module);

      defColumns = [...defColumnsUp];
      tableData = [...tableDataUp];
    }
  }

  let TabColOut = [];

  let restorations = Dataquery.map((item) => ({
    _id: item._id,
    restoration_info: item.restoration_info,
  }));
  let researchs = Dataquery.map((item) => ({
    _id: item._id,
    research_info: item.research_info === null ? false : true,
  }));
  /*const dos = researchs.map((item) => {
        if (item.research_info === true) {
            console.log('item', item);
         
        }
    })*/
  //console.log('researchs', researchs);
  //console.log('restorations', restorations);
  TabColOut.push(tableData);
  TabColOut.push(defColumns);
  TabColOut.push(out);
  TabColOut.push(restorations);
  TabColOut.push(researchs);
  return TabColOut;
}
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************Cache*Data*Handle*******************************************************************/

const dataBaseName = "MnemosineV3"; //Base de datos en cache
const storageName = "Queries"; // Esta seria como una tabla en una base de datos
const dataName = "QueryData"; //Y estos nombres de campos en la table
const queryDateName = "QueryDate"; //junto con este
export const saveToCache = (dataQuery) => {
  return new Promise((resolve, reject) => {
    //se crea una promesa ya que es algo externo, en este caso un indexedDB, el navegador lo maneja
    const request = indexedDB.open(dataBaseName, 1); //Abrimos la base de datos con el nombre dado
    //declaramos las variables para la transaccion de lectura y escritura en la cache
    let db;
    let transaction;
    let store;
    //Esta funcion se desencadena cuando se necesita que se actualice en nuestro caso solo se lanza
    //cuando esta se crea.
    request.onupgradeneeded = function (event) {
      db = event.target.result;
      //En caso de que no exista la tabla en la base de datos la crea
      if (!db.objectStoreNames.contains(storageName)) {
        //aqui es donde crea la tabla "storageName"
        store = db.createObjectStore(storageName);
        console.log("Almacén de objetos Queries creado:", store.name);
      } else {
        //En caso de que ya exista entonces se la asignamos a store justo como arriba solo
        //que en vez de crearla la leemos.
        store = event.target.transaction.objectStore(storageName);
        console.log("El almacén de objetos Queries ya existe.", store);
      }
    };

    const serializedQuery = JSON.stringify(dataQuery);

    request.onsuccess = function (event) {
      db = event.target.result;
      const transaction = db.transaction([storageName], "readwrite");
      const store = transaction.objectStore(storageName);

      store.put(serializedQuery, dataName);

      const OneHour = 60 * 60 * 1000;
      store.put(Date.now() + OneHour, queryDateName);

      transaction.oncomplete = () => {
        db.close();
        resolve("query saved");
      };

      transaction.onerror = () => {
        db.close();
        reject("query not saved");
      };
    };

    request.onerror = function (event) {
      console.error("Error al abrir la base de datos:", event.target.error);
      reject("error opening database");
    };
  });
};

export const delCache = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dataBaseName, 1);

    request.onsuccess = function (event) {
      const db = event.target.result;
      if (db.objectStoreNames.contains(storageName)) {
        const transaction = db.transaction([storageName], "readwrite");
        const store = transaction.objectStore(storageName);

        try {
          store.delete(dataName);
          store.delete(queryDateName);
          db.close();
          resolve(true);
        } catch (err) {
          db.close();
          reject(err);
        }
      } else {
        db.close();
        resolve(false); // No se encontró la tabla
      }
    };

    request.onerror = function (event) {
      reject(new Error("Error opening IndexedDB: " + event.target.errorCode));
    };
  });
};

export const getFromCache = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dataBaseName, 1);
    let db;
    let store;
    //Esta parte de la funcion es igual a saveToCache, solo que realmente se ejecuta aqui
    //cuando hacemos la primera busqueda en la logica se genera la base en cuanto le damos open
    //y entonces se lanza el evento onupgradeneeded, si no lo llenamos aqui, despues ya no se le puede agregar
    //entonces aqui le ponemos el nombre, y en save solo lo recuperamos, esta funcion nunca se ejecuta en saveTo Cache
    request.onupgradeneeded = function (event) {
      db = event.target.result;
      if (!db.objectStoreNames.contains(storageName)) {
        store = db.createObjectStore(storageName);
        console.log("Almacén de objetos Queries creado:", store.name);
      } else {
        store = event.target.transaction.objectStore(storageName);
        console.log("El almacén de objetos Queries ya existe.", store);
      }
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      let store;

      try {
        //si ya existen los datos entonces estas instrucciones se ejecutan
        //y le asignamos lectura y escritura a la base de datos
        const transaction = db.transaction([storageName], "readwrite");
        //obtenemos la tabla
        store = transaction.objectStore(storageName);
        //Obtenemos aqui los datos guardados
        const getRequest = store.get(dataName);
        //si tuvo exito al acceder a los datos abre una funcion sobre el evento
        getRequest.onsuccess = function (event) {
          const data = event.target.result; //obtiene en data el resultado del evento get
          if (data) {
            //si hay data
            const expirationDateRequest = store.get(queryDateName); //obtenemos el campo de fecha de expiracion
            expirationDateRequest.onsuccess = function (event) {
              //si obtiene el campo de fecha
              const expirationDate = event.target.result; //toma el campo
              const currentDate = Date.now(); //toma la fecha actual
              if (expirationDate && expirationDate < currentDate) {
                //y compara la fecha de expiracion, con la fecha actual
                //Si la fecha ya expiro borramos datos de la cache
                store.delete(dataName);
                store.delete(queryDateName);
                Cookies.remove("SYNCCODEDB");
                console.log("Los datos han expirado y han sido eliminados.");
                db.close(); // Cerrar la base de datos después de completar la operación
                reject("data expired"); //regresamos mensaje que expiró la base de datos
              } else {
                //                      console.log('Datos recuperados de IndexedDB:', JSON.parse(data));
                db.close(); // Cerrar la base de datos después de completar la operación
                resolve(data); //regresamos la base de datos obtenida despues de ver que aun esta vigente
              }
            };
          } else {
            //Si llegamos aqui es porque no existe aun la base de datos en el naveador
            db.close(); // Cerrar la base de datos después de completar la operación
            reject("no data"); //regresamos el texto de la inexistencia de datos
          }
        };
      } catch (error) {
        //En caso de cualquier error al intetar abrir el almacen de datos.
        console.log("No se pudo abrir el almacén de objetos.");
        reject("error opening object store");
      }
    };

    request.onerror = function (event) {
      //En caso de error al abrir el request manejamos el error
      console.error("Error al abrir la base de datos:", event.target.error);
      reject("error opening database");
    };
  });
};

const getDataFromCache = async () => {
  try {
    const data = await getFromCache();
    return JSON.parse(data); // Convertimos los datos a JSON
  } catch (error) {
    console.error("Error al obtener datos de la caché:", error);
    throw error; // Relanzamos el error para que se maneje en un nivel superior
  }
};

const fetchAndCacheData = async (accessToken, refreshToken) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const _code = Cookies.get("SYNCCODEDB");
  //temporal solo para quitar un error en el navegador para no borrar todo el historial
  //Cookies.remove('SYNCCODEDB');
  let url;
  if (_code) {
    url =
      SETTINGS.URL_ADDRESS.server_api_commands +
      `authenticated/user_query/${_code}`;
  } else {
    url =
      SETTINGS.URL_ADDRESS.server_api_commands + "authenticated/user_query/0";
  }

  const response = await fetch(url, requestOptions);
  var data;
  var queryData;
  if (response.status === 202) {
    data = await response.json();
    //console.log("data raw",data);
    queryData = data.query;
    const dataCode = data.code;
    Cookies.set("SYNCCODEDB", dataCode);
    //console.log('dataCode', dataCode);
    //console.log('query_duration', data.query_duration);
  } else if (response.status === 304) {
    data = await getDataFromCache();
    queryData = data;
    //console.log('data from cache Prra', data);
    //console.log(await response.text());
  } else {
    const errorData = await response.json();
    if (errorData.code === "token_not_valid") {
      try {
        //En esta url de api es para refrescar el accessToken con el refreshToken
        const url = SETTINGS.URL_ADDRESS.server_api_commands + "auth/signin/";
        const response2 = await fetch(url, {
          method: "PUT", //En el metodo PUT es donde renovamos el accessToken
          headers: {
            "Content-Type": "application/json",
            /* 'Authorization': `Bearer ${accessToken}`,*/
          },
          body: JSON.stringify({ refresh: refreshToken }), //ponemos el RefreshToken en el body para que intente hacer la renovacion
        });
        //console.log({ refresh: refreshToken });
        if (response2.ok) {
          //Esperamos a que nos de respuesta y lo convertimos en un objeto json.
          //viene un json con un elemento llamado "access" que es el nuevo accessToken con tiempo renovado
          const data2 = await response2.json();
          //console.log('rastreo access data', data);
          return data2;
        }
      } catch (e) {
        console.log(e);
        //En caso que no se pueda renovar el refreshToken, redirigimos al login
        return "not network1";
      }
    }
  }
  try {
    await saveToCache(queryData); // Guardamos los datos en la caché
    //  console.log("quewryData",queryData);
    return queryData; // Devolvemos los datos obtenidos
  } catch (error) {
    console.error("Error trying to save the data to cache :", error);
    throw error; // Relanzamos el error para que se maneje en un nivel superior
  }
};
export const fetchData = async (accessToken, refreshToken) => {
  try {
    let cachedData;
    let fetch;
    const _code = Cookies.get("SYNCCODEDB");
    if (!_code) {
      fetch = await fetchAndCacheData(accessToken, refreshToken);
      return fetch;
    } else {
      fetch = await fetchAndCacheData(accessToken, refreshToken);
      //cachedData = await getDataFromCache();
      cachedData = fetch;
    }

    //console.log('Data get from cache...');

    return cachedData;
  } catch (error) {
    //console.log('No data cached. Obtaining data from server...');
    const freshData = await fetchAndCacheData(accessToken, refreshToken);
    //console.log('Data obtained from server and saved to cache:');
    return freshData;
  }
};
