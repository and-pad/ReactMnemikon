import { useState, useEffect } from "react";
import {
  TextField,  
  Paper,
  FormControlLabel,
  Switch,  
  Box,
} from "@mui/material";
import { Field } from "./_field";
import { MultipleOptionField } from "./_multiple_option_field";
import { OptionField } from "./_option_field";

export const ResearchFields = ({
  big_data,
  formDataResearch,
  setFormDataResearch,
  langData,
}) => {
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [AllInvolvedCreation, setAllInvolvedCreation] = useState();
  const [AllAuthors, setAllAuthors] = useState();
  const [filteredInvolvedCreation, setFilteredInvolvedCreation] = useState([]);
  const [selectedPlaceOfCreation, setSelectedPlaceOfCreation] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState();
  const [filteredPlaceOfCreation, setFilteredPlaceOfCreation] = useState(); //setFilteredPlaceOfCreation
  const [AllPlaceOfCreation, setAllPlaceOfCreation] = useState();
  const [AllPeriod, setAllPeriod] = useState();
  const [filteredPeriod, setFilteredPeriod] = useState();

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setFormDataResearch((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handlePlaceOfCreationFilter = (e) => {
    const { value } = e.target;
    const filtered = AllPlaceOfCreation.filter((place_of_creation) =>
      place_of_creation.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPlaceOfCreation(filtered);
  };

  const handlePeriodChange = (selectedPeriod) => {
    setFormDataResearch((prev) => ({
      ...prev,
      period: { _id: selectedPeriod._id, title: selectedPeriod.title }, // Guardar múltiples autores en el estado
    }));
    //console.log("Autores seleccionados", selectedPeriod);
  };

  const handleFilteredPeriod = (e) => {
    const { value } = e.target;
    const filtered = AllPeriod.filter((period) =>
      period.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPeriod(filtered);
  };

  const removeAuthor = (id) => {
    setFormDataResearch((prev) => ({
      ...prev,
      authors: prev.authors.filter((author) => author._id !== id),
    }));
  };

  const removeInvolved = (id) => {
    setFormDataResearch((prev) => ({
      ...prev,
      involved_creation: prev.involved_creation.filter(
        (involved) => involved._id !== id
      ),
    }));
  };

  const handlePlaceOfCreationChange = (selectedPlaceOfCreation) => {
    setFormDataResearch((prev) => ({
      ...prev,
      place_of_creation: {
        _id: selectedPlaceOfCreation._id,
        title: selectedPlaceOfCreation.title,
      }, // Guardar múltiples autores en el estado
    }));
    //console.log("Autores seleccionados", selectedPlaceOfCreation);
  };

  const handleAuthorsChange = (selectedAuthors) => {
    setFormDataResearch((prev) => ({
      ...prev,
      authors: selectedAuthors, // Guardar múltiples autores en el estado
    }));
  };

  const handleInvolvedChange = (selectedInvolved) => {
    setFormDataResearch((prev) => ({
      ...prev,
      involved_creation: selectedInvolved, // Guardar múltiples autores en el estado
    }));
    //console.log("Autores seleccionados", selectedInvolved);
  };

  useEffect(() => {
    setFilteredAuthors(AllAuthors);
    setFilteredInvolvedCreation(AllInvolvedCreation);
    setFilteredPlaceOfCreation(AllPlaceOfCreation);
    setFilteredPeriod(AllPeriod);
  }, [AllAuthors, AllInvolvedCreation, AllPeriod, AllPlaceOfCreation]);

  useEffect(() => {
    setAllAuthors(big_data && big_data["all_authors"]);
    setAllInvolvedCreation(big_data && big_data["all_involved_creation"]);
    setSelectedPlaceOfCreation(
      big_data &&
        big_data["research_data"]["place_of_creation_info"] &&
        big_data["research_data"]["place_of_creation_info"][0]
    );
    setSelectedPeriod(
      big_data &&
        big_data["research_data"]["period_info"] &&
        big_data["research_data"]["period_info"][0]
    );

    setAllPlaceOfCreation(big_data && big_data["all_place_of_creation"]);
    setAllPeriod(big_data && big_data["all_period"]);
  }, [big_data]);

  return (
    <>
      <div className="row">
        <Field
          formDataResearch={formDataResearch || []}
          handleInputChange={handleInputChange}
          ID={"title"}
          Label={langData.pieceDetailDescriptors.research.title}
        />
      </div>
      {}
      <div className="row mb-1">
        <MultipleOptionField
          formDataResearch={formDataResearch}
          filteredOptions={filteredAuthors}
          formDataResearch_element={formDataResearch?.authors || null}
          handleChange={handleAuthorsChange}
          removeElement={removeAuthor}
          ID={"authors"}
          Label={langData.pieceDetailDescriptors.research.author_s_}
          PlaceHolder={
            langData.pieceDetailDescriptors.research.type_to_filter_authors
          }
        />
      </div>

      <div className="row ">
        <MultipleOptionField
          formDataResearch={formDataResearch}
          filteredOptions={filteredInvolvedCreation}
          formDataResearch_element={formDataResearch?.involved_creation || null}
          handleChange={handleInvolvedChange}
          removeElement={removeInvolved}
          ID={"involved_creation"}
          Label={
            langData.pieceDetailDescriptors.research.involved_creation_info
          }
          PlaceHolder={
            langData.pieceDetailDescriptors.research
              .type_to_filter_involved_creation
          }
        />
      </div>

      <div className="row">
        <Field
          formDataResearch={formDataResearch || []}
          handleInputChange={handleInputChange}
          ID={"technique"}
          Label={langData.pieceDetailDescriptors.research.technique}
        />
      </div>

      <div className="row">
        <Field
          formDataResearch={formDataResearch || []}
          handleInputChange={handleInputChange}
          ID={"materials"}
          Label={langData.pieceDetailDescriptors.research.materials}
        />
      </div>

      <div className="row">
        <OptionField
          filteredOptions={filteredPlaceOfCreation}
          selectedOption={selectedPlaceOfCreation}
          handleChange={handlePlaceOfCreationChange}
          handleFilter={handlePlaceOfCreationFilter}
          //langData={langData}
          ID={"place_of_creation"}
          Label={langData.pieceDetailDescriptors.research.place_of_creation}
          PlaceHolder={
            langData.pieceDetailDescriptors.research
              .type_to_filter_place_of_creation
          }
        />
      </div>

      <div className="row">
        <Field
          formDataResearch={formDataResearch || []}
          handleInputChange={handleInputChange}
          ID={"creation_date"}
          Label={langData.pieceDetailDescriptors.research.creation_date}
        />
      </div>

      <div className="row ">
        <Field
          formDataResearch={formDataResearch || []}
          handleInputChange={handleInputChange}
          ID={"acquisition_form"}
          Label={langData.pieceDetailDescriptors.research.acquisition_form}
        />
      </div>

      <div className="row ">
        <OptionField
          filteredOptions={filteredPeriod}
          selectedOption={selectedPeriod}
          handleChange={handlePeriodChange}
          handleFilter={handleFilteredPeriod}
          //langData={langData}
          ID={"period"}
          Label={langData.pieceDetailDescriptors.research.period}
          PlaceHolder={
            langData.pieceDetailDescriptors.research.type_to_filter_period
          }
        />
        
      </div>

      <div className="row">
        <Field
          formDataResearch={formDataResearch || []}
          handleInputChange={handleInputChange}
          ID={"acquisition_source"}
          Label={langData.pieceDetailDescriptors.research.acquisition_source}
        />
      </div>

      <div className="row">
        <Field
          formDataResearch={formDataResearch || []}
          handleInputChange={handleInputChange}
          ID={"acquisition_date"}
          Label={langData.pieceDetailDescriptors.research.acquisition_date}
        />
      </div>

      <Paper
        elevation={3}
        sx={{
          padding: 1,
          marginBottom: 1,
          marginRight: -1.5,
          marginLeft: -1.5,
        }}
      >
        <Box display="flex" gap={2} alignItems="center">
          {/* Switch para Firm */}
          <FormControlLabel
            control={
              <Switch
                checked={
                  formDataResearch?.firm === "yes" ||
                  formDataResearch?.firm === true
                }
                onChange={(e) =>
                  handleInputChange({
                    target: {
                      id: "firm",
                      value: e.target.checked ? "yes" : "no",
                    },
                  })
                }
              />
            }
            label={
              formDataResearch?.firm === "yes" ||
              formDataResearch?.firm === true
                ? "Sí"
                : "No"
            }
          />

          {/* Campo de descripción, habilitado solo si firm es "yes" o true */}
          <TextField
            fullWidth
            id="firm_description"
            label={langData.pieceDetailDescriptors.research.firm_description}
            value={
              formDataResearch?.firm === "no" ||
              formDataResearch?.firm === false
                ? ""
                : formDataResearch?.firm_description || ""
            }
            onChange={handleInputChange}
            size="small"
            disabled={
              formDataResearch?.firm !== "yes" &&
              formDataResearch?.firm !== true
            }
          />
        </Box>
      </Paper>

      <div className="row ">
        <Field
          formDataResearch={formDataResearch || []}
          handleInputChange={handleInputChange}
          ID={"short_description"}
          Label={langData.pieceDetailDescriptors.research.short_description}
        />
      </div>

      <div className="row">
        <Field
          formDataResearch={formDataResearch || []}
          handleInputChange={handleInputChange}
          ID={"formal_description"}
          Label={langData.pieceDetailDescriptors.research.formal_description}
        />
      </div>

      <div className="row ">
        <Field
          formDataResearch={formDataResearch || []}
          handleInputChange={handleInputChange}
          ID={"observation"}
          Label={langData.pieceDetailDescriptors.research.observation}
        />
      </div>

      <div className="row">
        <Field
          formDataResearch={formDataResearch || []}
          handleInputChange={handleInputChange}
          ID={"publications"}
          Label={langData.pieceDetailDescriptors.research.publications}
        />
      </div>

      <div className="row ">
        <Field
          formDataResearch={formDataResearch || []}
          handleInputChange={handleInputChange}
          ID={"card"}
          Label={langData.pieceDetailDescriptors.research.card}
        />
      </div>

      <div className="row">
        <Field
          formDataResearch={formDataResearch || []}
          handleInputChange={handleInputChange}
          ID={"keywords"}
          Label={langData.pieceDetailDescriptors.research.keywords}
        />
      </div>
    </>
  );
};
