import { useState, useEffect } from "react";

import { CardHeader, Typography } from "@mui/material";
import { GenderField } from "./_gender_field";
import { SubGenderField } from "./_subgender_field";
import { TypeObjectField } from "./_type_object_field";
import { DominantMaterialField } from "./_dominant_material_field";
import { InventoryField } from "./_inventory_field";
import { InventoryModifications } from "./_inventory_modifications";

const inventory_fields = [
  "gender_id",
  "subgender_id",
  "type_object_id",
  "dominant_material_id",
  "description_origin",
  "description_inventory",
];

export const InventoryFields = ({
  langData,
  big_data,
  formDataResearch,
  setFormDataResearch,
}) => {
  const [Genders, setGenders] = useState();
  const [Subgenders, setSubgenders] = useState();
  const [ObjectTypes, setObjectTypes] = useState();
  const [DominantMaterials, setDominantMaterials] = useState();
  const [filteredGenders, setFilteredGenders] = useState([]);
  const [filteredSubGenders, setFilteredSubGenders] = useState([]);
  const [selectedGender, setSelectedGender] = useState();
  const [selectedSubGender, setSelectedSubGender] = useState();
  const [selectedTypeObject, setSelectedTypeObject] = useState();
  const [filteredTypeObject, setfilteredTypeObject] = useState();
  const [selectedDominantMaterial, setSelectedDominantMaterial] = useState();
  const [filteredDominantMaterial, setFilteredDominantMaterial] = useState();
  const [inventoryModifications, SetInventoryModifications] = useState({});

  useEffect(() => {
    setSelectedGender(
      big_data && big_data["research_data"]["inventory_data"][0]["genders_info"]
    );
    setSelectedSubGender(
      big_data &&
        big_data["research_data"]["inventory_data"][0]["subgenders_info"]
    );
    setSelectedTypeObject(
      big_data &&
        big_data["research_data"]["inventory_data"][0]["type_object_info"]
    );
    setSelectedDominantMaterial(
      big_data &&
        big_data["research_data"]["inventory_data"][0]["dominant_material_info"]
    );

    setGenders(big_data && big_data["all_genders"]);
    setSubgenders(big_data && big_data["all_subgenders"]);
    setObjectTypes(big_data && big_data["all_object_type"]);
    setDominantMaterials(big_data && big_data["all_dominant_material"]);
  }, [big_data]);

  useEffect(() => {
    setFilteredGenders(Genders);
    setfilteredTypeObject(ObjectTypes);
    setFilteredDominantMaterial(DominantMaterials);

    setFilteredSubGenders(
      Subgenders?.filter((subgender) => {
        const subgenderIdStr = subgender.gender_id.toString();
        const bigDataIdStr =
          big_data["research_data"]["inventory_data"][0]["subgenders_info"][
            "gender_id"
          ].toString();
        // console.log("subgenderIdStr", subgenderIdStr);
        if (subgenderIdStr === bigDataIdStr) {
          //console.log("subgender", subgender);
          return subgender;
        } else {
          //  console.log("subgender", subgender.gender_id);
          //console.log("bigDataId", bigDataIdStr);
          return null;
        }
      })
    );
    SetInventoryModifications(
      (big_data && big_data["research_data"]["inventory_modifications"]) || []
    );
  }, [Genders, Subgenders, ObjectTypes, DominantMaterials, big_data]);

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
    const filtered = ObjectTypes.filter((type_object) =>
      type_object.title.toLowerCase().includes(value.toLowerCase())
    );
    setfilteredTypeObject(filtered);
  };

  const handleDominantMaterialFilter = (e) => {
    const { value } = e.target;
    const filtered = DominantMaterials.filter((dominant_material) =>
      dominant_material.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDominantMaterial(filtered);
  };

  const handleGenderChange = (SelectedGender) => {
    setFormDataResearch({
      ...formDataResearch,
      gender_id: {
        _id: SelectedGender._id,
        title: SelectedGender.title,
      },
    });

    // console.log("selected Gender", SelectedGender);
    setFilteredSubGenders(
      Subgenders.filter(
        (subgender) => subgender.gender_id === SelectedGender._id
      )
    );
   
  };

  return (
    <div className="row mb-3">
      {inventoryModifications.length > 0 ? (
        <InventoryModifications
          inventoryModifications={inventoryModifications}
          inventory_fields={inventory_fields}
          langData={langData}
        />
      ) : (
        <div
          className="card border-primary mb-1 "
          style={{ background: " #abaa" }}
        >
          <CardHeader
            title={
              <Typography
                variant="h6"
                sx={{
                  color: "#0d6efd",
                  fontWeight: "bold",
                  textAlign: "center",
                  padding: "2px 0", // Reduce padding arriba y abajo
                }}
              >
                {langData.pieceDetailDescriptors.research.inventory_fields}
              </Typography>
            }
            sx={{ padding: "8px 16px 0 16px" }} // Menos espacio arriba y laterales normales
          />

          <GenderField
            filteredGenders={filteredGenders}
            selectedGender={selectedGender}
            handleGenderChange={handleGenderChange}
            handleGenderFilter={handleGenderFilter}
            langData={langData}
          />
          <SubGenderField
            filteredSubGenders={filteredSubGenders}
            selectedSubGender={selectedSubGender}
            handleSubGenderFilter={handleSubGenderFilter}
            //handleSubGenderChange={handleSubGenderChange}
            langData={langData}
          />
          <TypeObjectField
            filteredTypeObject={filteredTypeObject}
            selectedTypeObject={selectedTypeObject}
            handleTypeObjectFilter={handleTypeObjectFilter}
            setFormDataResearch={setFormDataResearch}
            formDataResearch={formDataResearch}
            langData={langData}
          />
          <DominantMaterialField
            filteredDominantMaterial={filteredDominantMaterial}
            selectedDominantMaterial={selectedDominantMaterial}
            handleDominantMaterialFilter={handleDominantMaterialFilter}
            setFormDataResearch={setFormDataResearch}
            formDataResearch={formDataResearch}
            langData={langData}
          />

          {/* Descripción de Origen */}
          <InventoryField
            label={langData.pieceDetailDescriptors.inventory.description_origin}
            value={formDataResearch?.description_origin || ""}
            setFormDataResearch={setFormDataResearch}
            fieldName="description_origin"
          />
          {/* Descripción de Inventario */}
          <InventoryField
            label={
              langData.pieceDetailDescriptors.inventory.description_inventory
            }
            value={formDataResearch?.description_inventory || ""}
            setFormDataResearch={setFormDataResearch}
            fieldName="description_inventory"
          />
        </div>
      )}
    </div>
  );
};
