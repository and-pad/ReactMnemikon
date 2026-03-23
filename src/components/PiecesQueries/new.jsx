import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "./inventoryActions";
import { getTranslations } from "../Languages/i18n";
import { API_RequestInventoryNew} from "./APICalls";
import "./edit.css";
import SETTINGS from "../Config/settings";
import "react-dropzone-uploader/dist/styles.css";
//import Dropzone from 'react-dropzone-uploader';
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";

import { Button } from "@mui/material";

import ModifiedOutlet from "./isModifiedOutlet";
import { InventoryFields } from "./Fields/_inventory_fields";

const langData = getTranslations();

export const NewInventory = ({ accessToken, refreshToken, permissions }) => {
  //const navigate = useNavigate();

  //definiciones para manejar los cambios
  const data = useData();
  const [Data, setData] = useState();
  const [Genders, setGenders] = useState();
  const [Subgenders, setSubgenders] = useState();
  const [formData, setFormData] = useState();
  const [actualFormData, setCpFormData] = useState();
  const [filteredGenders, setFilteredGenders] = useState();
  const [filteredSubGenders, setFilteredSubGenders] = useState();
  const [TypeObject, setTypeObject] = useState();
  const [filteredTypeObject, setfilteredTypeObject] = useState();
  const [DominantMaterial, setDominantMaterial] = useState();
  const [filteredDominantMaterial, setFilteredDominantMaterial] = useState();
  const refToSave = useRef({});
  const [isModified, setIsModified] = useState();
  const [tags, setTags] = useState([]);
  const [editTag, setEditTag] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [Pics, setPics] = useState(); //Estas imagenes van cambiando conforme se escribe sobre ellas
  const [actualPics, setCpPics] = useState({}); //Estas se mantienen como estaban para hacer la comparación
  const [PicsNew, setPicsNew] = useState([]); //Estas imagenes van cambiando conforme se escribe sobre ellas
  const [currentImgNewIndex, setCurrentImgNewIndex] = useState(0); //el indice para navegar entre imagenes

  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  

  

  const [DocumentsNew, setDocumentsNew] = useState([]); //Estas son las imagenes nuevas
  const [currentDocNewIndex, setCurrentDocNewIndex] = useState(0); //el indice para navegar entre imagenes

  const [currentImgIndex, setCurrentImgIndex] = useState(0); //el indice para navegar entre imagenes
  const [currentPic, setCurrentPic] = useState(); //la imagen que se muestra actualmente
  const [changedPics, setchangedPics] = useState({});
  const [changedDocs, setchangedDocs] = useState();
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Estado para verificar si los datos ya fueron cargados

  //const [currentDoc, setCurrentDoc] = useState();
  const [currentDocIndex, setCurrentDocIndex] = useState(0);

  const [Documents, setDocuments] = useState();
  const [actualDocs, setCpDocs] = useState({});

  const [isExpandedImg, setIsExpandedImg] = useState(false);
  const [isExpandedDoc, setIsExpandedDoc] = useState(false);

  const image_path =
    SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.inventory_thumbnails;

  const handlePrev = () => {
    setCurrentImgIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? Pics.length - 1 : prevIndex - 1;
      setCurrentPic(Pics && Pics.length > 0 ? Pics[newIndex] : null);
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentImgIndex((prevIndex) => {
      const newIndex = prevIndex === Pics.length - 1 ? 0 : prevIndex + 1;
      //console.log(newIndex);
      setCurrentPic(Pics && Pics.length > 0 ? Pics[newIndex] : null);
      return newIndex;
    });
  };
  const handlePrevNew = () => {
    setCurrentImgNewIndex((prevIndex) => {
      if (PicsNew.length > 0) {
        return prevIndex === 0 ? PicsNew.length - 1 : prevIndex - 1;
      }
      return prevIndex; // No cambia si no hay imágenes
    });
    //setCurrentPicNew(PicsNew && PicsNew.length > 0 ? PicsNew[currentImgNewIndex] : null);
  };
  const handleNextNew = () => {
    setCurrentImgNewIndex((prevIndex) => {
      if (PicsNew.length > 0) {
        return prevIndex === PicsNew.length - 1 ? 0 : prevIndex + 1;
      }
      return prevIndex; // No cambia si no hay imágenes
    });
    // setCurrentPicNew(PicsNew && PicsNew.length > 0 ? PicsNew[currentImgNewIndex] : null);
  };





  const handleImageDrop = (acceptedFiles) => {
    //console.log("pics new", PicsNew);
    const updatedPics = [...PicsNew];
    updatedPics[currentImgNewIndex] = {
      ...updatedPics[currentImgNewIndex],
      file: acceptedFiles[0],
      size: acceptedFiles[0].size,
      mime_type: acceptedFiles[0].type,
    };
    setPicsNew(updatedPics);
  };

  const handleDocumentDrop = (acceptedFiles) => {
    const updatedDocs = [...DocumentsNew];
    updatedDocs[currentDocNewIndex] = {
      ...updatedDocs[currentDocNewIndex],
      file: acceptedFiles[0],
      name: acceptedFiles[0].name.split(".").slice(0, -1).join("."),
      size: acceptedFiles[0].size,
      mime_type: acceptedFiles[0].type,
    };
    setDocumentsNew(updatedDocs);
  };
  const addImage = () => {
    const newImage = {
      photographer: "",
      description: "",
      photographed_at: "",
      file: null,
    };
    setPicsNew([...PicsNew, newImage]);
    setCurrentImgNewIndex(PicsNew.length); // Actualiza el índice al último elemento nuevo
  };
  const deleteImage = (index) => {
    setPicsNew(PicsNew.filter((_, i) => i !== index));
    setCurrentImgNewIndex(0); // Actualiza el índice al primer elemento
  };

  const handleLocationChange = (selectedLocation) => {
    console.log("selected location", selectedLocation);
    setFormData({
      ...formData,
      location_id: {
        _id: selectedLocation._id,
        name: selectedLocation.name,
      },
    });

  };
  /*  const handleGenderChange = (selectedGender) => {
    setFormData({
      ...formData,
      gender_id: {
        _id: selectedGender._id,
        title: selectedGender.title,
      },
    });
    //console.log("selected Gender", selectedGender);
  };*/

  const handleLocationFilter = (e) => {
    const { value } = e.target;
    console.log("locations", locations);
    console.log("value", value);
    const filtered = locations.filter((location) =>
      location.name.toLowerCase().includes(value.toLowerCase())
    );
    console.log("filtered", filtered);
    setFilteredLocations(filtered);
  };

  useEffect(() => {
    if (data !== undefined && data !== null) {
        console.log("data view", data);
      if (data["genders"] !== undefined) {
        //setData(data.piece);
        //setDocuments(data.documents);
        setGenders(data.genders);
        setSubgenders(data.subgenders);
        setTypeObject(data.type_object);
        setfilteredTypeObject(TypeObject);
        setDominantMaterial(data.dominant_material);
        setLocations(data.locations);
        setFilteredLocations(locations);
        setFilteredDominantMaterial(DominantMaterial);
        setFilteredGenders(Genders);
        setFilteredSubGenders(Subgenders);

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
              _id: data.piece?.gender_id ? data.piece.gender_id : null,
              title: data?.piece?.genders_info
                ? data.piece.genders_info.title
                : null,
              description: data?.piece?.genders_info
                ? data.piece.genders_info.description
                : null,
            },
            subgender_id: {
              _id: data.piece?.subgender_id ? data.piece.subgender_id : null,
              title: data?.piece?.subgenders_info
                ? data.piece.subgenders_info.title
                : null,
              description: data?.piece?.subgenders_info
                ? data.piece.subgenders_info.description
                : null,
            },

            type_object_id: {
              _id: data.piece?.type_object_id
                ? data.piece.type_object_id
                : null,
              title: data?.piece?.type_object_info
                ? data.piece.type_object_info.title
                : null,
              description: data?.piece?.type_object_info
                ? data.piece.type_object_info.description
                : null,
            },
            dominant_material_id: {
              _id: data.piece?.dominant_material_id
                ? data.piece.dominant_material_id
                : null,
              title: data?.piece?.dominant_material_info
                ? data.piece.dominant_material_info.title
                : null,
              description: data?.piece?.dominant_material_info
                ? data.piece.dominant_material_info.description
                : null,
            },

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

            incidence: data.piece?.incidence || "",
            location_id: data.piece?.location_id || "",
            admitted_at : "",
          };

          setPics(data.pics);
          console.log("temp", temp);
          setFormData(temp || {});
          setCpFormData(temp || {});
          //setCpPics(data.pics);
          //setCpDocs(data.documents);
          setIsDataLoaded(true);
          setIsModified(false);
          const tagsArray = temp.tags.split(",").map((tag) => tag.trim());
          setTags(tagsArray);
        }
        if (Pics && Pics.length > 0) {
          setCurrentPic(Pics[currentImgIndex]);
          //console.log("Pics current", Pics[currentImgIndex]);
          //console.log("current index", currentImgIndex);
          //console.log("Pics", Pics);
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
    isModified,    

    currentImgIndex,
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
    //const changes_pics_inputs = comparePicsModifications(actualPics, Pics);
    //const changes_docs_inputs = compareDocsModifications(actualDocs, Documents);
    console.log("handle save changes", changes);
    if (
      (changes && Object.keys(changes).length > 0) ||
      //(changes_pics_inputs && Object.keys(changes_pics_inputs).length > 0) ||
      //(changedPics && Object.keys(changedPics).length > 0) ||
      //(changedDocs && Object.keys(changedDocs).length > 0) ||
      (PicsNew && PicsNew.length > 0) ||
      //(changes_docs_inputs && Object.keys(changes_docs_inputs).length > 0) ||
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
    //const _id = Data._id;

    API_RequestInventoryNew({
      accessToken,
      refreshToken,
      //_id,
      changes,
      //changes_pics_inputs,
      //changedPics,
      PicsNew,
      //changedDocs,
      DocumentsNew,
      //changes_docs_inputs,
    }).then((data) => {
      if (data) {
        console.log("data after save", data);   }
    });
  };

  const handleTagClick = (index) => {
    // Colocar el tag en el input para permitir su edición
    setCurrentTag(tags[index]);
    setEditTag(index);
  };

  const handleTagDelete = (index) => {
    setTags(tags.filter((_, i) => i !== index)); // Eliminar el tag seleccionado
    setEditTag("");
    setCurrentTag("");
  };

  const handleTagKeyDown = (e) => {
    if (editTag !== "") {
      const result = tags.map((tag, index) =>
        index !== editTag ? tag : e.target.value
      );
      setTags(result);
      setEditTag("");
      setCurrentTag("");

      // esta es la idea hay que hacerla con el setformData //formData.tags = result.join(",");
      setFormData((prevData) => ({
        ...prevData,
        tags: result.join(","),
      }));
    } else {
      if (e.target.value.trim() !== "") {
        setTags([...tags, e.target.value.trim()]);
        setCurrentTag("");
        setFormData((prevData) => ({
          ...prevData,
          tags: [...tags, e.target.value.trim()].join(","), // Actualiza los tags en el formData
        }));
      }
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (id === "tags") {
      if (value.endsWith(",")) {
        // Agrega el tag sin la coma al final y limpia el currentTag
        // setTags([...tags, currentTag.trim()]);
        //setCurrentTag("");
      } else {
        setCurrentTag(value); // Actualiza el tag actual mientras se escribe
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleGenderChange = (selectedGender) => {
    setFormData({
      ...formData,
      gender_id: {
        _id: selectedGender._id,
        title: selectedGender.title,
      },
    });
    //console.log("selected Gender", selectedGender);
  };

  const handleSubGenderChange = (selectedSubGender) => {
    setFormData({
      ...formData,
      subgender_id: {
        _id: selectedSubGender._id,
        title: selectedSubGender.title,
      },
    });
    //console.log("selected SubGender", selectedSubGender);
  };

  const handleTypeObjectChange = (selectedTypeObject) => {
    setFormData({
      ...formData,
      type_object_id: {
        _id: selectedTypeObject._id,
        title: selectedTypeObject.title,
      },
    });
    //console.log("selected TypeObject", selectedTypeObject);
  };

  const handleDominantMaterialChange = (selectedDominantMaterial) => {
    setFormData({
      ...formData,
      dominant_material_id: {
        _id: selectedDominantMaterial._id,
        title: selectedDominantMaterial.title,
      },
    });
    //console.log("selected DominantMaterial", selectedDominantMaterial);
  };

  // Filtra las opciones de gender en función de lo que escribe el usuario
  const handleGenderFilter = (e) => {
    const { value } = e.target;
    const filtered = Genders.filter((gender) =>
      gender.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredGenders(filtered);
  };
  const handleSubGenderFilter = (e) => {
    const { value } = e.target;

    // Filtra la lista de genders
    const filtered = Subgenders.filter((subgender) =>
      subgender.title.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredSubGenders(filtered);
  };

  const handleTypeObjectFilter = (e) => {
    const { value } = e.target;
    const filtered = TypeObject.filter((type_object) =>
      type_object.title.toLowerCase().includes(value.toLowerCase())
    );
    setfilteredTypeObject(filtered);
  };

  const handleDominantMaterialFilter = (e) => {
    const { value } = e.target;
    const filtered = DominantMaterial.filter((dominant_material) =>
      dominant_material.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDominantMaterial(filtered);
  };

  // Actualiza los campos de la imagen seleccionada
  const handleInputPic = (e) => {
    const { id, value } = e.target;
    setPics((prevData) =>
      prevData.map(
        (pic, index) =>
          index === currentImgIndex
            ? { ...pic, [id]: value } // Crea una copia del objeto actual con el campo actualizado
            : pic // Retorna el objeto sin cambios si el índice no coincide
      )
    );
  };



  const handleChangeImageStatus = ({ file }) => {
    setchangedPics((prevChangedPics) => {
      const updatedFile = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
      return {
        ...prevChangedPics,
        [currentImgIndex]: {
          _id: Pics[currentImgIndex]._id,
          file: updatedFile,
        },
      };
    });
  };

  const handleChangeDocumentStatus = ({ file }) => {
    const copyFile = new File([file], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    });
    setchangedDocs((prevChangedDocs) => ({
      ...prevChangedDocs,
      [currentDocIndex]: {
        _id: Documents[currentDocIndex]["_id"],
        file: copyFile,
      },
    }));
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
                handleInputChange={handleInputChange}
                tags={tags}
                currentTag={currentTag}
                handleTagClick={handleTagClick}
                handleTagDelete={handleTagDelete}
                handleTagKeyDown={handleTagKeyDown}
                filteredGenders={filteredGenders}
                handleGenderFilter={handleGenderFilter}
                handleGenderChange={handleGenderChange}
                filteredSubGenders={filteredSubGenders}
                handleSubGenderFilter={handleSubGenderFilter}
                handleSubGenderChange={handleSubGenderChange}
                filteredTypeObject={filteredTypeObject}
                handleTypeObjectFilter={handleTypeObjectFilter}
                handleTypeObjectChange={handleTypeObjectChange}
                filteredDominantMaterial={filteredDominantMaterial}
                handleDominantMaterialFilter={handleDominantMaterialFilter}
                handleDominantMaterialChange={handleDominantMaterialChange}
                image_path={image_path}
                currentPic={currentPic}
                currentImgIndex={currentImgIndex}
                handleChangeImageStatus={handleChangeImageStatus}
                Pics={Pics}
                formatDate={formatDate}
                //formatSize={formatSize}
                handleInputPic={handleInputPic}
                handlePrev={handlePrev}
                handleNext={handleNext}
                isExpandedImg={isExpandedImg}
                //toggleExpandNewImage={toggleExpandNewImage}
                deleteImage={deleteImage}
                addImage={addImage}
                currentImgNewIndex={currentImgNewIndex}
                PicsNew={PicsNew}
                handleImageDrop={handleImageDrop}
                changedPics={changedPics}
                refToSave={refToSave}
                
                setPicsNew ={setPicsNew}
                handlePrevNew = {handlePrevNew}
                handleNextNew = {handleNextNew}
                Documents = {Documents}
                currentDocIndex = {currentDocIndex}
                handleChangeDocumentStatus = {handleChangeDocumentStatus}
                changedDocs = {changedDocs}
                setDocumentsNew = {setDocumentsNew}
                currentDocNewIndex = {currentDocNewIndex}
                handleDocumentDrop = {handleDocumentDrop}

                setDocuments = {setDocuments}
                setCurrentDocNewIndex = {setCurrentDocNewIndex}
                setIsExpandedImg = {setIsExpandedImg}
                setIsExpandedDoc = {setIsExpandedDoc}
                setCurrentDocIndex = {setCurrentDocIndex}
                DocumentsNew = {DocumentsNew}

                isExpandedDoc={isExpandedDoc}
                sendSave={sendSave}
                handleLocationChange={handleLocationChange}
                handleLocationFilter={handleLocationFilter}
                filteredLocations={filteredLocations}
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

// Agrega esta función en el componente para formatear la fecha:
function formatDate(dateTime) {
  return dateTime.split(" ")[0]; // Extrae solo la fecha en formato YYYY-MM-DD
}


