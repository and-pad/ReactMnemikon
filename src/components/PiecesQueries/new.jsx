import { useEffect, useState } from "react";
import { useData } from "./inventoryActions";
import { getTranslations } from "../Languages/i18n";
import { API_RequestInventoryNew } from "./APICalls";
import "./edit.css";
import SETTINGS from "../Config/settings";
import "react-dropzone-uploader/dist/styles.css";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import { Button } from "@mui/material";
import ModifiedOutlet from "./isModifiedOutlet";
import { InventoryFields } from "./Fields/_inventory_fields";

const langData = getTranslations();

export const NewInventory = ({ accessToken, refreshToken, permissions }) => {
  const data = useData();
  const [Data, setData] = useState();
  const [formData, setFormData] = useState();
  const [actualFormData, setCpFormData] = useState();
  const [isModified, setIsModified] = useState();
  const [Pics, setPics] = useState();
  const [actualPics, setCpPics] = useState({});
  const [PicsNew, setPicsNew] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [DocumentsNew, setDocumentsNew] = useState([]);
  const [changedPics, setchangedPics] = useState({});
  const [changedDocs, setchangedDocs] = useState();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [Documents, setDocuments] = useState();
  const [actualDocs, setCpDocs] = useState({});

  const image_path =
    SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.inventory_thumbnails;

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

  const handleLocationFilter = (e) => {
    const { value } = e.target;
    console.log("locations", locations);
    console.log("value", value);
    const filtered = locations.filter((location) =>
      location.name.toLowerCase().includes(value.toLowerCase()),
    );
    console.log("filtered", filtered);
    setFilteredLocations(filtered);
  };

  useEffect(() => {
    if (data !== undefined && data !== null) {
      console.log("data view", data);
      if (data["genders"] !== undefined) {
        setLocations(data.locations);
        setFilteredLocations(data.locations);

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
            admitted_at: "",
          };

          setPics(data.pics);
          console.log("temp", temp);
          setFormData(temp || {});
          setCpFormData(temp || {});
          setIsDataLoaded(true);
          setIsModified(false);
        }
      } else if (data.changes) {
        setIsModified(true);
        setData(data);
      }
    }
  }, [data, isModified, isDataLoaded]);

  const compareFormModifications = (original, modified) => {
    let changes = {};

    for (const key in original) {
      let originalValue = original[key];
      let modifiedValue = modified[key];

      if (typeof originalValue === "string")
        originalValue = originalValue.trim();
      if (typeof modifiedValue === "string")
        modifiedValue = modifiedValue.trim();

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
      } else if (originalValue !== modifiedValue) {
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
            }

            if (isFirstTime) {
              changes[i]["_id"] = originalItem["_id"];
              isFirstTime = false;
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

  const compareDocsModifications = (original, modified) => {
    let changes = {};
    const keys = ["name"];

    for (let i = 0; i < original.length; i++) {
      const originalItem = original[i];
      const modifiedItem = modified[i];
      let isFirstTime = true;

      for (const key of keys) {
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
            }

            if (isFirstTime) {
              changes[i]["_id"] = originalItem["_id"];
              isFirstTime = false;
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

  const handleSave = (e) => {
    e.preventDefault();

    const changes = compareFormModifications(actualFormData, formData);
    console.log("handle save changes", changes);
    if (
      (changes && Object.keys(changes).length > 0) ||
      (PicsNew && PicsNew.length > 0) ||
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

    API_RequestInventoryNew({
      accessToken,
      refreshToken,
      changes,
      PicsNew,
      DocumentsNew,
    }).then((data) => {
      if (data) {
        console.log("data after save", data);
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
                Documents={Documents}
                setDocuments={setDocuments}
                DocumentsNew={DocumentsNew}
                setDocumentsNew={setDocumentsNew}
                changedDocs={changedDocs}
                setchangedPics={setchangedPics}
                setchangedDocs={setchangedDocs}
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
