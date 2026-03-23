
import { Paper, TextField, Autocomplete, Chip } from "@mui/material";

export const OptionField = ({
  filteredOptions,
  selectedOption,
  handleChange,
  handleFilter,
  langData,
  ID,
  Label,
  PlaceHolder

}) => {
  let option_name = "title";
  if (ID === "location")
    option_name = "name";

  return (
    <>
      <Paper
        elevation={6}
        sx={{
            paddingLeft: 1,
            paddingRight: 1,
            paddingBottom: 1,
            marginLeft: -1,
            marginRight: -1,
            marginTop: -2,
            marginBottom: -0,
        }}
      >
        <div className="mt-2">
          <Autocomplete
            className="pt-2"
            freeSolo
            options={filteredOptions || []}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option[option_name] || ""
            }
            value={selectedOption || null}
            onInputChange={(event, newValue) => {
              if (event && event.type === "change") {
                handleFilter({ target: { value: newValue } });
              }
            }}
            onChange={(event, newValue) => {
              // Verificamos si newValue es un objeto antes de acceder a su propiedad _id
              console.log("newValue", newValue);
              if (newValue && typeof newValue !== "string") {
                console.log("newValue._id", newValue._id);
                handleChange(newValue);
              } else if (typeof newValue === "string") {
                handleChange({ _id: null, [option_name]: newValue });
              } else {
                // Si newValue es null o undefined, puedes manejarlo según lo necesites
                handleChange({ _id: null, [option_name]: "" });
              }
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderOption={(props, option) => (
              // `key` no se pasa dentro de `props` para evitar el error
              <li {...props} key={option._id || option[option_name]}>
                {option[option_name]}
              </li>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                // Extraemos `key` fuera de `props`
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip key={option._id} {...tagProps} label={option[option_name]} />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={Label}
                placeholder={
                  PlaceHolder                   
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