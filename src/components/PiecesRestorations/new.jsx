import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { fetchRestorationNew, fetchRestorationInsert } from "./APICalls";
//import { RestorationEdit } from "./_restoration_edit";
import { RestorationNew } from "./_restoration_new";

export const NewRestoration = ({ accessToken, refreshToken, permissions }) => {
  const [Data, setData] = useState();

  const [formDataRestoration, setFormDataRestoration] = useState({});
  const [formDataRestorationCp, setFormDataRestorationCp] = useState({});

  const [catalogResponsible, setCatalogResponsible] = useState([]);  
  const [PicsNew, setPicsNew] = useState([]);  
  const [DocumentsNew, setDocumentsNew] = useState([]);  

  const { _id } = useParams();


  //console.log("tokens", accessToken, refreshToken);
  useEffect(() => {
    const response = fetchRestorationNew(
      accessToken,
      refreshToken,
      _id,
      //restoration_id
    );
    response
      .then((data) => {
        // console.log(data.restoration, "datarecien");        
        setData(data);
        setCatalogResponsible(data.catalog_responsible || []);

      })
      .catch((error) => {
        console.error("Error inesperado", error);
      });
  }, [accessToken, refreshToken]);

  useEffect(() => {
    console.log("Data", Data);
    if (Data) {

      const temp_data = {
        preliminary_examination: "",
        laboratory_analysis: "",
        proposal_of_treatment: "",
        treatment_description: "",
        results: "",
        observations: "",
        treatment_date: null,
        responsible_restorer: null,
        piece_id: null,
        documents_ids: null,
        photographs_ids: null,
        height: null,
        width: null,
        depth: null,
        diameter: null,
        height_with_base: null,
        width_with_base: null,
        depth_with_base: null,
        diameter_with_base: null,
        base_or_frame: "base",

      }
      setFormDataRestoration(temp_data);
      setFormDataRestorationCp(temp_data);
    }

  }, [Data]);

  const IGNORED_KEYS = [
    "_id",
    "created_at",
    "updated_at",
    "deleted_at",
    "deleted_by",
    "created_by",
    "updated_by",
  ];

  const compareformData = (original, modified) => {
    let changes = {};

    for (const key in original) {
      if (IGNORED_KEYS.includes(key)) continue; // ignoramos campos que no importan

      let originalValue = original[key];
      let modifiedValue = modified[key];
      if (key === "authors") {
        /* console.log("originalValue", originalValue);
        console.log("modifiedValue", modifiedValue);*/
      }
      // Aplicar trim a los strings
      if (typeof originalValue === "string")
        originalValue = originalValue.trim();
      if (typeof modifiedValue === "string")
        modifiedValue = modifiedValue.trim();

      // Si el valor es un objeto con _id, solo compararemos _id
      if (
        originalValue !== null &&
        modifiedValue !== null &&
        typeof originalValue === "object" &&
        typeof modifiedValue === "object"
      ) {
        // hacer un if en caso de que el objeto sea un array y comparar los _id de cada uno en el array

        if (Array.isArray(originalValue) && Array.isArray(modifiedValue)) {
          const originalIds = originalValue
            .map((item) => item?._id)
            .filter(Boolean);
          const modifiedIds = modifiedValue
            .map((item) => item?._id)
            .filter(Boolean);

          const sameLength = originalIds.length === modifiedIds.length;

          const allIdsMatch =
            sameLength &&
            originalIds.every((id) => modifiedIds.includes(id)) &&
            modifiedIds.every((id) => originalIds.includes(id));

          if (!allIdsMatch) {
            changes[key] = {
              oldValue:
                Array.isArray(original[key]) && original[key].length > 0
                  ? original[key]
                  : null,
              newValue:
                Array.isArray(modified[key]) && modified[key].length > 0
                  ? modified[key]
                  : null,
            };
          }
        } else {
          if (
            originalValue &&
            modifiedValue &&
            originalValue._id !== modifiedValue._id
          ) {
            changes[key] = {
              oldValue: original[key],
              newValue: modified[key],
            };
          }
        }
      }
      // Comparación normal para strings y valores primitivos
      else if (originalValue !== modifiedValue) {
        changes[key] = {
          oldValue: original[key] ? original[key] : null,
          newValue: modified[key],
        };
        if (key === "authors") {
          /*console.log("originalValue desde if array", originalValue);
          console.log("modifiedValue", modifiedValue);*/
        }
      }
    }
    //console.log("changes desde compare modifications", changes);
    return changes;
  };



  const handleSave = (e) => {
    e.preventDefault();
    console.log("formDataRestorationCp", formDataRestorationCp);
    console.log("formDataRestoration", formDataRestoration);
    const changed = compareformData(formDataRestorationCp, formDataRestoration);
    console.log(changed, "changed");

    if (
      Object.keys(changed || {}).length === 0 &&
      //Object.keys(changedPics || {}).length === 0 &&
      //Object.keys(changedPicsInputs || {}).length === 0 &&
      //Object.keys(changedDocs || {}).length === 0 &&
      PicsNew.length === 0 &&
      DocumentsNew.length === 0
    ) {
      alert("Hey chavo, no modificaste nada 😎");
      return;
    } else {
      alert("Se enviará el formulario con los cambios. 🚀");
      console.log(changed, "changed to send");
      const response = fetchRestorationInsert(
        accessToken,
        refreshToken,
        _id,
        changed,
        PicsNew,
        DocumentsNew,
      );

      response.then((data) => {
        console.log(data, "datarespuesta");
        if (data !== true) {
          alert("Cambios guardados con éxito! 🎉");
        }
        else {
          alert("Hubo un error al guardar los cambios. 😔");
        }
      })
        .catch((error) => {
          console.error("Error inesperado", error);
        });


    }
  };

  return (
    <div>
      New Restoration
      <br />
      <div className="container ">
        <form onSubmit={handleSave}>
          <div
            className="card ps-5 pe-5 pt-3 pb-3"
            style={{ background: "#abcc" }}
          >
            <RestorationNew
              formDataRestoration={formDataRestoration}
              setFormDataRestoration={setFormDataRestoration}
              catalogResponsible={catalogResponsible}
              //photos={photos}
              //setPhotos={setPhotos}
              PicsNew={PicsNew}
              setPicsNew={setPicsNew}
              //changedPics={changedPics}
              //setChangedPics={setChangedPics}
              //Documents={Documents}
              //setDocuments={setDocuments}
              //actualDocs={actualDocs}
              DocumentsNew={DocumentsNew}
              setDocumentsNew={setDocumentsNew}
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3 mb-5">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};
