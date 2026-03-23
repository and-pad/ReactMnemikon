import { useEffect, useState } from "react";
import { Field } from "./_field";
import { getTranslations } from "../../Languages/i18n";
import { Paper, Autocomplete, Chip, TextField } from "@mui/material";

const langData = getTranslations();

export const RestorationFields = ({
  formDataRestoration,
  handleInputChange,
  setFormDataRestoration,
  catalogResponsible,
}) => {
  const [responsible, setResponsible] = useState(false);
  // const [filteredResponsible, setFilteredResponsible] = useState([]);

  useEffect(() => {
    const resp = catalogResponsible.find(
      (res) => res._id === formDataRestoration.responsible_restorer
    );
    //console.log("formDataRestoration", formDataRestoration);
    //console.log("catalogResponsible", catalogResponsible.filter((res) => res._id == formDataRestoration.responsible_restorer))
    setResponsible(resp);
  }, [
     catalogResponsible,
     formDataRestoration,
    ]);

/*
  useEffect(() => {
    if (Pics && Pics.length > 0) {
      setCurrentPic(Pics[currentImgIndex]);
    }
  }, [Pics, currentImgIndex]);
*/

  const handleResponsibleChange = (selectedResponsible) => {
    setFormDataRestoration((prev) => ({
      ...prev,

      responsible_restorer: selectedResponsible._id,
    }));
    console.log("Responsables seleccionados", selectedResponsible);
  };

  return (
    <div className="mt-2">
      <Field
        formDataRestoration={formDataRestoration || []}
        handleInputChange={handleInputChange}
        ID={"preliminary_examination"}
        Label={langData.pieceRestorationEdit.preliminary_examination}
      />

      <Field
        formDataRestoration={formDataRestoration || []}
        handleInputChange={handleInputChange}
        ID={"laboratory_analysis"}
        Label={langData.pieceRestorationEdit.laboratory_analysis}
      />

      <Field
        formDataRestoration={formDataRestoration || []}
        handleInputChange={handleInputChange}
        ID={"proposal_of_treatment"}
        Label={langData.pieceRestorationEdit.proposal_of_treatment}
      />

      <Field
        formDataRestoration={formDataRestoration || []}
        handleInputChange={handleInputChange}
        ID={"treatment_description"}
        Label={langData.pieceRestorationEdit.treatment_description}
      />

      <Field
        formDataRestoration={formDataRestoration || []}
        handleInputChange={handleInputChange}
        ID={"results"}
        Label={langData.pieceRestorationEdit.results}
      />
      <Field 
        formDataRestoration={formDataRestoration || []}
        handleInputChange={handleInputChange}
        ID={"observations"}
        Label={langData.pieceRestorationEdit.observations}
      />
      <Field
        formDataRestoration={formDataRestoration || []}
        handleInputChange={handleInputChange}
        ID={"treatment_date"}
        Label={langData.pieceRestorationEdit.treatment_date}
      />

      <div className="row">
        <Paper
          elevation={6}
          sx={{
            paddingLeft: 1,
            paddingRight: 1,
            paddingTop: 1,
            paddingBottom: 0,
            marginRight: 1,
            marginBottom: 1,
          }}
        >
          <div className="mb-2">
            <Autocomplete
              freeSolo
              options={catalogResponsible || []}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.title || ""
              }
              value={responsible || null}         
         
              onChange={(event, newValue) => {
                if (newValue && typeof newValue !== "string") {
                  handleResponsibleChange(newValue);
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
                  label={langData.pieceRestorationEdit.responsible_restorer}
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
      </div>
    </div>
  );
};
