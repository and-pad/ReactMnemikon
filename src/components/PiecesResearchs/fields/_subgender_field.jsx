import { Paper, TextField, Autocomplete } from "@mui/material";

export const SubGenderField = ({
  filteredSubGenders,
  selectedSubGender,
  handleSubGenderFilter,
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
            options={filteredSubGenders || []}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.title || ""
            }
            value={selectedSubGender || ""}
            onInputChange={(event, newValue) => {
              if (event && event.type === "change") {
                handleSubGenderFilter({
                  target: { value: newValue },
                });
              }
            }}
            onChange={(event, newValue) => {
              if (newValue && typeof newValue !== "string") {
                setFormDataResearch({
                  ...formDataResearch,
                  subgender_id: newValue,
                });
              } else if (typeof newValue === "string") {
                setFormDataResearch({
                  ...formDataResearch,
                  subgender_id: { _id: null, title: newValue },
                });
              } else {
                setFormDataResearch({
                  ...formDataResearch,
                  subgender_id: { _id: null, title: "" },
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
                  langData.pieceDetailDescriptors.inventory.subgenders_info
                }
                placeholder={
                  langData.pieceDetailDescriptors.inventory
                    .type_to_filter_subgenders
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
