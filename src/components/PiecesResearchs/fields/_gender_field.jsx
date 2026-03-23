import { Paper, TextField, Autocomplete, Chip } from "@mui/material";

export const GenderField = ({
  filteredGenders,
  selectedGender,
  handleGenderChange,
  handleGenderFilter,
  langData,
}) => {
  return (
    <>
      <Paper
        elevation={6}
        sx={{
          paddingLeft: 1,
          paddingRight: 1,
          paddingBottom: 1,          
          margin: 1,
        }}
      >
        <div className="mt-2">
          <Autocomplete
            freeSolo
            options={filteredGenders || []}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.title || ""
            }
            value={selectedGender || null}
            onInputChange={(event, newValue) => {
              if (event && event.type === "change") {
                handleGenderFilter({ target: { value: newValue } });
              }
            }}
            onChange={(event, newValue) => {
              // Verificamos si newValue es un objeto antes de acceder a su propiedad _id
              if (newValue && typeof newValue !== "string") {
                handleGenderChange(newValue);
              } else if (typeof newValue === "string") {
                handleGenderChange({ _id: null, title: newValue });
              } else {
                // Si newValue es null o undefined, puedes manejarlo según lo necesites
                handleGenderChange({ _id: null, title: "" });
              }
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderOption={(props, option) => (
              // `key` no se pasa dentro de `props` para evitar el error
              <li {...props} key={option._id || option.title}>
                {option.title}
              </li>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                // Extraemos `key` fuera de `props`
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip key={option._id} {...tagProps} label={option.title} />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={langData.pieceDetailDescriptors.inventory.gender}
                placeholder={
                  langData.pieceDetailDescriptors.inventory
                    .type_to_filter_genders                    
                }
                
              />
            )}
          />
        </div>
      </Paper>
    </>
  );
};
