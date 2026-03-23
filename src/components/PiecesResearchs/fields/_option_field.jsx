import { Paper, TextField, Autocomplete, Chip } from "@mui/material";

export const OptionField = ({
  filteredOptions,
  selectedOption,
  handleChange,
  handleFilter,
  //langData,
  ID,
  Label,
  PlaceHolder,
}) => {
  return (
    <>
      <Paper
        id={ID}
        elevation={6}
        sx={{
          paddingLeft: 1,
          paddingRight: 1,
          paddingTop: 1,
          paddingBottom: 1,
          marginRight: -4,
          marginBottom: 1.5,
        }}
      >
        <div className="">
          <Autocomplete
            freeSolo
            options={filteredOptions || []}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.title || ""
            }
            value={selectedOption || null}
            onInputChange={(event, newValue) => {
              if (event && event.type === "change") {
                handleFilter({
                  target: { value: newValue },
                });
              }
            }}
            onChange={(event, newValue) => {
              if (newValue && typeof newValue !== "string") {
                handleChange(newValue);
              } else if (typeof newValue === "string") {
                handleChange({
                  _id: null,
                  title: newValue,
                });
              } else {
                handleChange({ _id: null, title: "" });
              }
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderOption={(props, option) => (
              <li {...props} key={option._id || option.title}>
                {option.title}
              </li>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip key={option._id} {...tagProps} label={option.title} />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={Label}
                placeholder={PlaceHolder}
                variant="outlined"
                fullWidth
                size="small"
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#6c757d", // Label en gris
                  },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#ffffff",
                  },
                }}
              />
            )}
          />
        </div>
      </Paper>
    </>
  );
};
