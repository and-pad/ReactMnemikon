import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "./inventoryActions";
import { getTranslations } from "../Languages/i18n";
import { API_RequestInventoryEdit } from "./APICalls";
import "./edit.css";
import SETTINGS from "../Config/settings";
import "react-dropzone-uploader/dist/styles.css";
//import Dropzone from 'react-dropzone-uploader';
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
//import { faBan } from "@fortawesome/free-solid-svg-icons";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import Dropzone from "react-dropzone";
//import { IconButton, Button } from "@mui/material";
import { Button } from "@mui/material";
//import AddIcon from "@mui/icons-material/Add";
//import RemoveIcon from "@mui/icons-material/Remove";
//import { pink } from "@mui/material/colors";
//import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ModifiedOutlet from "./isModifiedOutlet";
import { InventoryFields } from "./Fields/_inventory_fields";

const langData = getTranslations();

export const EditInventory = ({ accessToken, refreshToken, permissions }) => {
  const navigate = useNavigate();

  //definiciones para manejar los cambios
  const data = useData();
  const [Data, setData] = useState();
  const [formData, setFormData] = useState();
  const [actualFormData, setCpFormData] = useState();
  const [isModified, setIsModified] = useState();
  const [Pics, setPics] = useState(); //Estas imagenes van cambiando conforme se escribe sobre ellas
  const [actualPics, setCpPics] = useState(); //Estas se mantienen como estaban para hacer la comparación
  const [PicsNew, setPicsNew] = useState([]); //Estas imagenes van cambiando conforme se escribe sobre ellas

  const [DocumentsNew, setDocumentsNew] = useState([]); //Estas son las imagenes nuevas

  const [changedPics, setchangedPics] = useState({});
  const [changedDocs, setchangedDocs] = useState();
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Estado para verificar si los datos ya fueron cargados

  const [Documents, setDocuments] = useState();
  const [actualDocs, setCpDocs] = useState();

  const image_path =
    SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.inventory_thumbnails;

  useEffect(() => {
    if (data !== undefined) {
      if (data.piece) {
        setData(data.piece);
        setDocuments(data.documents);
        // Si no hacemos esta revision si hay un cambio en los datos se reinician los cabios
        // eso no es deseado asi que solo llenamos los datos una vez
        //console.log("gender_info", data?.piece ? data.piece : "N/D");
        if (!isDataLoaded) {
          const temp = {
            origin_number: data.piece?.origin_number || "",
            inventory_number: data.piece?.inventory_number || "",
            catalog_number: data.piece?.catalog_number || "",
            description_origin: data.piece?.description_origin || "",
            description_inventory: data.piece?.description_inventory || "",
            gender_id: {
              _id: data.piece?.gender_id ? data.piece.gender_id : "N/D",
              title: data?.piece?.genders_info
                ? data.piece.genders_info.title
                : "N/D",
              description: data?.piece?.genders_info
                ? data.piece.genders_info.description
                : "N/D",
            },
            subgender_id: {
              _id: data.piece?.subgender_id ? data.piece.subgender_id : "N/D",
              title: data?.piece?.subgenders_info
                ? data.piece.subgenders_info.title
                : "N/D",
              description: data?.piece?.subgenders_info
                ? data.piece.subgenders_info.description
                : "N/D",
            },

            type_object_id: {
              _id: data.piece?.type_object_id
                ? data.piece.type_object_id
                : "N/D",
              title: data?.piece?.type_object_info
                ? data.piece.type_object_info.title
                : "N/D",
              description: data?.piece?.type_object_info
                ? data.piece.type_object_info.description
                : "N/D",
            },
            dominant_material_id: {
              _id: data.piece?.dominant_material_id
                ? data.piece.dominant_material_id
                : "N/D",
              title: data?.piece?.dominant_material_info
                ? data.piece.dominant_material_info.title
                : "N/D",
              description: data?.piece?.dominant_material_info
                ? data.piece.dominant_material_info.description
                : "N/D",
            },
            location: data.piece?.location_info.name || "",
            incidence: data.piece?.incidence || "",

            tags: data.piece?.tags || "",
            appraisal: data.piece?.appraisal || "",
            base_or_frame: data.piece?.base_or_frame || "base",
            height: data.piece?.height || "",
            width: data.piece?.width || "",
            depth: data.piece?.depth || "",
            diameter: data.piece?.diameter || "",
            height_with_base: data.piece?.height_with_base || "",
            width_with_base: data.piece?.width_with_base || "",
            depth_with_base: data.piece?.depth_with_base || "",
            diameter_with_base: data.piece?.diameter_with_base || "",
            action: data?.action || "",

          };

          setPics(data.pics);

          setFormData(temp);
          setCpFormData(temp);
          setCpPics(data.pics);
          setCpDocs(data.documents);
          setIsDataLoaded(true);
          setIsModified(false);
        }
      } else {
        if (data.changes) {
          setIsModified(true);
          setData(data);
        }
      }
    }
  }, [
    data,
    setData,
    setFormData,
    isModified,
    isDataLoaded,
  ]);

  const compareFormModifications = (original, modified) => {
    let changes = {};

    for (const key in original) {
      let originalValue = original[key];
      let modifiedValue = modified[key];

      // Aplicar trim a los strings
      if (typeof originalValue === "string")
        originalValue = originalValue.trim();
      if (typeof modifiedValue === "string")
        modifiedValue = modifiedValue.trim();

      // Si el valor es un objeto con _id, solo compararemos _id
      if (
        typeof originalValue === "object" &&
        typeof modifiedValue === "object"
      ) {
        if (originalValue._id !== modifiedValue._id) {
          changes[key] = {
            oldValue: original[key],
            newValue: modified[key],
          };
        }
      }
      // Comparación normal para strings y valores primitivos
      else if (originalValue !== modifiedValue) {
        changes[key] = {
          oldValue: original[key],
          newValue: modified[key],
        };
      }
    }

    return changes;
  };

  const comparePicsModifications = (original, modified) => {
    let changes = {};
    const keys = ["photographer", "photographed_at", "description"];

    for (let i = 0; i < original.length; i++) {
      const originalItem = original[i];
      const modifiedItem = modified[i];
      let isFirstTime = true;

      for (const key of keys) {
        // Iteramos directamente sobre `keys`
        if (key in originalItem) {
          const originalValue =
            typeof originalItem[key] === "string"
              ? originalItem[key].trim()
              : originalItem[key];

          const modifiedValue =
            typeof modifiedItem[key] === "string"
              ? modifiedItem[key].trim()
              : modifiedItem[key];

          if (originalValue !== modifiedValue) {
            if (!changes[i]) {
              changes[i] = {};
            } // Asegura que `changes[i]` exista

            if (isFirstTime) {
              changes[i]["_id"] = originalItem["_id"]; // Solo asigna `_id` la primera vez
              isFirstTime = false; // Marca que ya se procesó el primer cambio
            }

            changes[i][key] = {
              oldValue: originalItem[key],
              newValue: modifiedItem[key],
            };
          }
        }
      }
    }

    return changes;
  };

  // compareDocsModifications, igual que comparePicsModifications pero para documentos solo con el campo name
  const compareDocsModifications = (original, modified) => {
    let changes = {};
    const keys = ["name"];

    for (let i = 0; i < original.length; i++) {
      const originalItem = original[i];
      const modifiedItem = modified[i];
      let isFirstTime = true;

      for (const key of keys) {
        // Iteramos directamente sobre `keys`
        if (key in originalItem) {
          const originalValue =
            typeof originalItem[key] === "string"
              ? originalItem[key].trim()
              : originalItem[key];
          const modifiedValue =
            typeof modifiedItem[key] === "string"
              ? modifiedItem[key].trim()
              : modifiedItem[key];

          if (originalValue !== modifiedValue) {
            if (!changes[i]) {
              changes[i] = {};
            } // Asegura que `changes[i]` exista

            if (isFirstTime) {
              changes[i]["_id"] = originalItem["_id"]; // Solo asigna `_id` la primera vez
              isFirstTime = false; // Marca que ya se procesó el primer cambio
            }

            changes[i][key] = {
              oldValue: originalItem[key],
              newValue: modifiedItem[key],
            };
          }
        }
      }
    }
    return changes;
  };

  // Función para guardar los cambios (puedes ajustarla para conectarla a una API o manejar el guardado local)

  const handleSave = (e) => {
    e.preventDefault();

    const changes = compareFormModifications(actualFormData, formData);
    const changes_pics_inputs = comparePicsModifications(actualPics, Pics);
    const changes_docs_inputs = compareDocsModifications(actualDocs, Documents);

    if (
      (changes && Object.keys(changes).length > 0) ||
      (changes_pics_inputs && Object.keys(changes_pics_inputs).length > 0) ||
      (changedPics && Object.keys(changedPics).length > 0) ||
      (changedDocs && Object.keys(changedDocs).length > 0) ||
      (PicsNew && PicsNew.length > 0) ||
      (changes_docs_inputs && Object.keys(changes_docs_inputs).length > 0) ||
      (DocumentsNew && DocumentsNew.length > 0)
    ) {
      const modalElement = document.getElementById("ChangesModal");
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      }
    } else {
      const modalElement = document.getElementById("noChangesModal");
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      }
    }
  };

  const sendSave = () => {
    const changes = compareFormModifications(actualFormData, formData);
    const changes_pics_inputs = comparePicsModifications(actualPics, Pics);
    const changes_docs_inputs = compareDocsModifications(actualDocs, Documents);
    const _id = Data._id;

    API_RequestInventoryEdit({
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
    }).then((data) => {
      if (data) {
        navigate(0);
      }
    });
  };

  return (
    <>
      {isModified ? (
        <ModifiedOutlet
          Data={Data}
          accessToken={accessToken}
          refreshToken={refreshToken}
          setIsModified={setIsModified}
        />
      ) : (
        <div className="container">
          <form onSubmit={handleSave}>
            <div className="card p-4" style={{ background: "#abcc" }}>
              <InventoryFields
                langData={langData}
                formData={formData}
                setFormData={setFormData}
                inventoryData={data}
                image_path={image_path}
                Pics={Pics}
                setPics={setPics}
                PicsNew={PicsNew}
                setPicsNew={setPicsNew}
                changedPics={changedPics}
                setchangedPics={setchangedPics}
                Documents={Documents}
                setDocuments={setDocuments}
                DocumentsNew={DocumentsNew}
                setDocumentsNew={setDocumentsNew}
                changedDocs={changedDocs}
                setchangedDocs={setchangedDocs}
                sendSave={sendSave}
              />
            </div>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="btn btn-primary mt-2 mb-5"
            >
              Save
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

