import { Paper, TextField, Autocomplete } from "@mui/material";
export const DominantMaterialField = ({
  filteredDominantMaterial,
  selectedDominantMaterial,
  handleDominantMaterialFilter,
  setFormDataResearch,
  formDataResearch,
  langData,
}) => {
  return (
    <>
      <Paper
        elevation={6}
        sx={{
          paddingLeft: 1,
          paddingRight: 1,
          paddingBottom: 0,
          marginLeft: 1,
          marginRight: 1,
          marginBottom: 1,
        }}
      >
        <div className="mb-2 mt-2">
          <Autocomplete
            freeSolo
            options={filteredDominantMaterial || []}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.title || ""
            }
            value={selectedDominantMaterial || ""}
            onInputChange={(event, newValue) => {
              if (event && event.type === "change") {
                handleDominantMaterialFilter({
                  target: { value: newValue },
                });
              }
            }}
            onChange={(event, newValue) => {
              if (newValue && typeof newValue !== "string") {
                setFormDataResearch({
                  ...formDataResearch,
                  dominant_material_id: newValue,
                });
              } else if (typeof newValue === "string") {
                setFormDataResearch({
                  ...formDataResearch,
                  dominant_material_id: {
                    _id: null,
                    title: newValue,
                  },
                });
              } else {
                setFormDataResearch({
                  ...formDataResearch,
                  dominant_material_id: { _id: null, title: "" },
                });
              }
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderOption={(props, option) => (
              <li {...props} key={option._id || option.title}>
                {option.title}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={
                  langData.pieceDetailDescriptors.inventory
                    .dominant_material_info
                }
                placeholder={
                  langData.pieceDetailDescriptors.inventory
                    .type_to_filter_materials
                }
                size="small"
              />
            )}
          />
        </div>
      </Paper>
    </>
  );
};
