
import { Paper, Autocomplete, TextField, Chip } from "@mui/material";


export const MultipleOptionField = ({
  formDataResearch,
  filteredOptions,
  formDataResearch_element,  
  handleChange,
  removeElement,
  
  
  ID,
  Label,
  PlaceHolder

}) => {

  return (
    <>
    <Paper
              elevation={6}
              sx={{
                paddingLeft: 1,
                paddingRight: 1,
                paddingTop: 1,
                paddingBottom: 1,
    
                marginRight: 1,
                marginBottom: 1,
              }}
            >
              
               
                  <Autocomplete
                    multiple
                    id={ID}
                    options={
                      filteredOptions?.filter(
                        (element, index, self) =>
                          self.findIndex((a) => a._id === element._id) === index && // Evita duplicados
                          !formDataResearch_element?.some(
                            (a) => a._id === element._id
                          ) // Evita mostrar seleccionados
                      ) || []
                    }
                    getOptionLabel={(option) => option.title || ""}
                    getOptionKey={(option) => option._id}
                    value={formDataResearch?.[ID] || []}
                    onChange={(event, newValue) => handleChange(newValue)}
                    filterOptions={(options, { inputValue }) =>
                      options.filter(
                        (option) =>
                          option.title
                            .toLowerCase()
                            .includes(inputValue.toLowerCase()) // Filtra por texto
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={Label}
                        placeholder={
                          PlaceHolder
                        }
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
                    renderTags={(selected, getTagProps) =>
                      selected.map((authors, index) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                          <Chip
                            key={authors._id}
                            label={authors.title}
                            {...tagProps}
                            onDelete={() => removeElement(authors._id)}
                            sx={{
                              bgcolor: "white",
                              color: "black",
                              border: "1px solid #777",
                              marginRight: "2px",
                              marginBottom: "2px",
                              height: "1.4rem",
                            }}
                          />
                        );
                      })
                    }
                  />
               
             
            </Paper>

            </>
  )
};