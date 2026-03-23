import { useEffect, useState ,useRef } from "react";
import { useParams } from "react-router-dom";
//import { useNavigate } from "react-router-dom";
import { useDataResearch } from "./researchsActions";
import { API_UpdateResearch } from "./APICalls";
import { getTranslations } from "../Languages/i18n";
import { Button } from "@mui/material";

import { InventoryFields } from "./fields/_inventory_fields";
import { ResearchFields } from "./fields/_research_fields";
import { FootNotesFields } from "./fields/_foot_notes_fields";
import { NewFootNotesFields } from "./fields/_new_foot_notes_fields";
import { BibliographiesFields } from "./fields/_bibliographies_fields";
import { NewBibliographyFields } from "./fields/_new_bibliographies_fields";
import { ImagesFields } from "./fields/_images_fields";
import { NewImageFields } from "./fields/_new_image_fields";
import { DocumentsFields } from "./fields/_documents_fields";
import { NewDocumentsFields } from "./fields/_new_documents_fields";
import { ModalSaveResearch } from "./fields/_modal_save_research";

const langData = getTranslations();

export const EditResearch = ({ accessToken, refreshToken, permissions }) => {
  const { _id } = useParams();
  const big_data = useDataResearch();
  //const navigate = useNavigate();
  const [formDataResearch, setFormDataResearch] = useState(null);
  const [actualFormData, setCpFormData] = useState();
  const [Documents, setDocuments] = useState([]);
  const [actualDocs, setactualDocs] = useState([]);
  const [Pics, setPics] = useState([]);
  const [changedPics, setchangedPics] = useState({});
  const [PicsNew, setPicsNew] = useState([]); //Estas imagenes van cambiando conforme se escribe sobre ellas
  const [DocumentsNew, setDocumentsNew] = useState([]); //Estas imagenes van cambiando conforme se escribe sobre ellas
  const [actualPics, setCpPics] = useState(); //Estas se mantienen como estaban para hacer la comparación
  const [footnotes, setFootnotes] = useState();
  const [actualFootnotes, setCpFootnotes] = useState(); //Estas se mantienen como estaban para hacer la comparación
  const [newFootnotes, setNewFootnotes] = useState([]); //Estas footnotes van cambiando conforme se escribe sobre ellas
  const [bibliographies, setBibliographies] = useState();
  const [actualBibliographies, setCpBibliographies] = useState(); //Estas se mantienen como estaban para hacer la comparación
  const [newBibliographies, setNewBibliographies] = useState([]);
  const [allreferences, setReferences] = useState();
  const [filteredReferences, setfilteredReferences] = useState();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalState, setModalState] = useState("confirm");
  // confirm | saving | success | error
  const [serverMsg, setServerMsg] = useState("");
  const pendingSaveRef = useRef(null);


  const data = big_data && big_data["research_data"];
  const InventoryData =
    data && data["inventory_data"] && data["inventory_data"][0];

  const compareFormModifications = (original, modified) => {
    let changes = {};

    for (const key in original) {
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

  const handleReferenceFilter = (e) => {
    const { value } = e.target;
    const filtered = allreferences.filter((reference) =>
      reference.title.toLowerCase().includes(value.toLowerCase()),
    );
    setfilteredReferences(filtered);
  };

  useEffect(() => {
    setReferences(big_data && big_data["all_references_type"]);

    setDocuments(big_data && big_data["research_data"]["documents"]);
    setactualDocs(big_data && big_data["research_data"]["documents"]);

    setFootnotes((big_data && big_data.research_data.footnotes_info) || []);
    setCpFootnotes((big_data && big_data.research_data.footnotes_info) || []);
    setBibliographies(
      (big_data && big_data.research_data.bibliographies_info) || [],
    );
    setCpBibliographies(
      (big_data && big_data.research_data.bibliographies_info) || [],
    );
    /*    setSelectedReference(
      big_data &&
        big_data.research_data.bibliographies_info[currentBibliographyIndex] &&
        big_data.research_data.bibliographies_info[currentBibliographyIndex]
          .reference_type_info[0]
    );*/
  }, [big_data]);

  useEffect(() => {
    //console.log("permissions", permissions);
    const data_research = {
      title: data?.title ? data.title : null,
      technique: data?.technique ? data.technique : null,
      materials: data?.materials ? data.materials : null,
      creation_date: data?.creation_date ? data.creation_date : null,
      acquisition_form: data?.acquisition_form ? data.acquisition_form : null,
      acquisition_source: data?.acquisition_source
        ? data.acquisition_source
        : null,
      acquisition_date: data?.acquisition_date ? data.acquisition_date : null,
      firm: data?.firm ? data.firm : null,
      firm_description: data?.firm_description ? data.firm_description : null,
      short_description: data?.short_description
        ? data.short_description
        : null,
      formal_description: data?.formal_description
        ? data.formal_description
        : null,
      observation: data?.observation ? data.observation : null,
      publications: data?.publications ? data.publications : null,
      card: data?.card ? data.card : null,
      keywords: data?.keywords ? data.keywords : null,

      gender_id: InventoryData?.genders_info
        ? InventoryData.genders_info
        : null,
      subgender_id: InventoryData?.subgenders_info
        ? InventoryData.subgenders_info
        : null,
      type_object_id: InventoryData?.type_object_info
        ? InventoryData.type_object_info
        : null,
      dominant_material_id: InventoryData?.dominant_material_info
        ? InventoryData.dominant_material_info
        : null,
      authors: data && data.authors_info,
      involved_creation: data && data.involved_creation_info,
      place_of_creation: data && data.place_of_creation_info,
      period: data && data.period_info,

      description_origin: InventoryData?.description_origin
        ? InventoryData.description_origin
        : null,
      description_inventory: InventoryData?.description_inventory
        ? InventoryData.description_inventory
        : null,
    };

    setFormDataResearch(data_research);
    setCpFormData(data_research);

    setfilteredReferences(allreferences);

    setPics(big_data && big_data["research_data"]["photos"]);
    setCpPics(big_data && big_data["research_data"]["photos"]);
  }, [data, InventoryData, allreferences, big_data]);

  const handleSave = (e) => {
    e.preventDefault();

    const changes = compareFormModifications(actualFormData, formDataResearch);
    const changes_pics_inputs = comparePicsModifications(actualPics, Pics);
    const changes_bibliographies = compareBibliographies(
      actualBibliographies,
      bibliographies,
    );
    const changes_footnotes = compareFootNotes(actualFootnotes, footnotes);
    const changes_documents = compareDocuments(actualDocs, Documents);

    const hasChanges =
      (changes && Object.keys(changes).length > 0) ||
      (PicsNew && PicsNew.length > 0) ||
      (changes_pics_inputs && Object.keys(changes_pics_inputs).length > 0) ||
      (changedPics && Object.keys(changedPics).length > 0) ||
      (changes_bibliographies &&
        Object.keys(changes_bibliographies).length > 0) ||
      (changes_footnotes && Object.keys(changes_footnotes).length > 0) ||
      (DocumentsNew && DocumentsNew.length > 0) ||
      (changes_documents && Object.keys(changes_documents).length > 0) ||
      (newBibliographies && newBibliographies.length > 0) ||
      (newFootnotes && newFootnotes.length > 0);
  console.log("hasChanges", hasChanges);
    if (!hasChanges) {
      // opcional: modal "No hay cambios"
      return;
    }

    // 🔐 Guardamos TODO el payload, sin tocar la API
    pendingSaveRef.current = {
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
    };

    setModalState("confirm");
    setModalOpen(true);
  };

  const confirmSave = async () => {
  if (!pendingSaveRef.current) return;

  try {
    setModalState("saving");

    const response = await API_UpdateResearch(pendingSaveRef.current);
    let msg = "Error al guardar los cambios";

    if (response["ok"]){
      
      if(response["message"] === "msg1ok")
      {
        msg = "Cambios guardados correctamente";
      }

    
    setModalState("success");
    setServerMsg(msg);
    } else {
      setModalState("error");
      setServerMsg(msg);
    }

    pendingSaveRef.current = null;
  } catch (err) {
    console.error(err);
    setModalState("error");
    setServerMsg("Error al guardar los cambios");
  }
};


  const compareFootNotes = (original, modified) => {
    let changes = {};
    const footnotesk = [
      "title",
      "author",
      "article",
      "chapter",
      "editorial",
      "vol_no",
      "city_country",
      "pages",
      "publication_date",
      "description",
    ];

    for (let i = 0; i < original.length; i++) {
      const originalItem = original[i];
      const modifiedItem = modified[i];
      let isFirstTime = true;

      for (const key of footnotesk) {
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

  const compareDocuments = (original, modified) => {
    let changes = {};
    const doc_keys = ["name", "size", "mime_type", "file"];
    //console.log("original", original);
    //console.log("modified", modified);
    for (let i = 0; i < original.length; i++) {
      const originalItem = original[i];
      const modifiedItem = modified[i];
      let localChanges = {}; // Para guardar cambios de esta bibliografía
      console.log("originalItem", originalItem);
      console.log("modifiedItem", modifiedItem);
      for (const key of doc_keys) {
        console.log("key", key);

        console.log("originalItem[key]", originalItem[key]);
        console.log("modifiedItem[key]", modifiedItem[key]);
        // Cargamos el file si es que ha cambiado
        if (key === "file") {
          console.log("modifiedItem[key]", modifiedItem[key]);
          localChanges[key] = modifiedItem[key];
          console.log("file cambiado", localChanges[key]);
          continue;
        }
        const originalValue =
          typeof originalItem[key] === "string"
            ? originalItem[key].trim()
            : originalItem[key];

        const modifiedValue =
          typeof modifiedItem[key] === "string"
            ? modifiedItem[key].trim()
            : modifiedItem[key];

        if (originalValue !== modifiedValue) {
          localChanges[key] = {
            oldValue: originalItem[key],
            newValue: modifiedItem[key],
          };
        }

        if (Object.keys(localChanges).length > 0) {
          localChanges["_id"] = originalItem["_id"];
          changes[i] = localChanges;
          console.log("changes", changes);
        }
      }

      if (Object.keys(changes).length > 0) {
        return changes;
      } else return null;
    }
  };

  const compareBibliographies = (original, modified) => {
    let changes = {};
    const bibliok = [
      "reference_type_info",
      "title",
      "author",
      "article",
      "chapter",
      "editorial",
      "vol_no",
      "city_country",
      "pages",
      "editor",
      "webpage",
      "identifier",
    ];

    for (let i = 0; i < original.length; i++) {
      const originalItem = original[i];
      const modifiedItem = modified[i];
      let localChanges = {}; // Para guardar cambios de esta bibliografía

      for (const key of bibliok) {
        if (!(key in originalItem)) continue;

        const originalValue =
          typeof originalItem[key] === "string"
            ? originalItem[key].trim()
            : originalItem[key];

        const modifiedValue =
          typeof modifiedItem[key] === "string"
            ? modifiedItem[key].trim()
            : modifiedItem[key];

        if (key === "reference_type_info") {
          if (
            originalItem[key] &&
            modifiedItem[key] &&
            originalItem[key][0]["_id"] !== modifiedItem[key][0]["_id"]
          ) {
            localChanges[key] = {
              oldValue: originalItem[key],
              newValue: modifiedItem[key],
            };
          }
          continue;
        }

        if (originalValue !== modifiedValue) {
          localChanges[key] = {
            oldValue: originalItem[key],
            newValue: modifiedItem[key],
          };
        }
      }

      if (Object.keys(localChanges).length > 0) {
        localChanges["_id"] = originalItem["_id"];
        changes[i] = localChanges;
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
  

  return (
    <div>
      <div className="container">
        <ModalSaveResearch
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          confirmSave={confirmSave}
          modalState={modalState}
          serverMsg={serverMsg}
          _id={_id}
        />

        <form onSubmit={handleSave}>
          {/*Campos de Inventario*/}
          <div
            className="card pt-3 ps-3 pe-3 pb-1 "
            style={{ background: "#abcc" }}
          >
            <InventoryFields
              langData={langData}
              big_data={big_data}
              formDataResearch={formDataResearch}
              setFormDataResearch={setFormDataResearch}
            />

            <ResearchFields
              big_data={big_data}
              formDataResearch={formDataResearch}
              setFormDataResearch={setFormDataResearch}
              langData={langData}
            />

            <FootNotesFields
              footnotes={footnotes}
              setFootnotes={setFootnotes}
              langData={langData}
            />

            <NewFootNotesFields
              newFootnotes={newFootnotes}
              setNewFootnotes={setNewFootnotes}
              langData={langData}
            />

            <BibliographiesFields
              big_data={big_data}
              bibliographies={bibliographies}
              setBibliographies={setBibliographies}
              handleReferenceFilter={handleReferenceFilter}
              filteredReferences={filteredReferences}
              langData={langData}
            />

            <NewBibliographyFields
              newBibliographies={newBibliographies}
              setNewBibliographies={setNewBibliographies}
              handleReferenceFilter={handleReferenceFilter}
              filteredReferences={filteredReferences}
              allreferences={allreferences}
              langData={langData}
            />

            <ImagesFields
              Pics={Pics}
              setPics={setPics}
              changedPics={changedPics}
              setchangedPics={setchangedPics}
              langData={langData}
            />

            <NewImageFields
              PicsNew={PicsNew}
              setPicsNew={setPicsNew}
              langData={langData}
            />

            <DocumentsFields
              Documents={Documents}
              setDocuments={setDocuments}
              actualDocs={actualDocs}
              langData={langData}
            />

            <NewDocumentsFields
              DocumentsNew={DocumentsNew}
              setDocumentsNew={setDocumentsNew}
              langData={langData}
            />
          </div>

          <Button
            className="m-3"
            variant="contained"
            color="primary"
            type="submit"
          >
            {"Salvar"}
          </Button>
        </form>
      </div>
    </div>
  );
};
