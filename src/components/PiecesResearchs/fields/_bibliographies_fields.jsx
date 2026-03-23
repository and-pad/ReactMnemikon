import { useEffect, useState } from "react";
import { Autocomplete, Box, TextField, Chip, Button } from "@mui/material";

export const BibliographiesFields = ({
  big_data,
  bibliographies,
  setBibliographies,
  handleReferenceFilter,
  filteredReferences,
  langData,
}) => {
  const [selectedReference, setSelectedReference] = useState();
  const [currentBibliographyIndex, setCurrentBibliographyIndex] = useState(0);
  const handleReferenceChange = (selectedReferences) => {
    setBibliographies((prev) => {
      const updated = [...prev]; // copia superficial del arreglo
      //console.log("updated", updated);
      updated[currentBibliographyIndex] = {
        ...updated[currentBibliographyIndex],
        reference_type_info: [selectedReferences], // esto debe ser un array
      };
      return updated;
    });
    setSelectedReference(selectedReferences); // Actualiza el estado del reference_type_info
  };

  const handlePrevBibliography = () => {
    setCurrentBibliographyIndex((prevIndex) => {
      const newIndex =
        prevIndex === 0 ? bibliographies.length - 1 : prevIndex - 1;
      setSelectedReference(bibliographies[newIndex].reference_type_info[0]);
      return newIndex;
    });
  };
  const handleNextBibliography = () => {
    setCurrentBibliographyIndex((prevIndex) => {
      const newindex =
        prevIndex === bibliographies.length - 1 ? 0 : prevIndex + 1;
      setSelectedReference(bibliographies[newindex].reference_type_info[0]);
      return newindex;
    });
  };

  const handleInputBibliographyChange = (e) => {
    const { id, value } = e.target;

    setBibliographies((prevData) =>
      prevData.map((bibliography, index) => {
        if (index === currentBibliographyIndex) {
          const updatedBibliography = { ...bibliography, [id]: value };
          /*console.log("Updated bibliography:", updatedBibliography[id]);
          console.log("actualBibliographies:", actualBibliographies[index][id]);*/
          return updatedBibliography;
        }
        return bibliography;
      }),
    );
  };

  useEffect(() => {
    setSelectedReference(
      big_data?.research_data?.bibliographies_info?.[currentBibliographyIndex]
        ?.reference_type_info?.[0] ?? null,
    );
  }, [big_data, currentBibliographyIndex]);

  return (
    <>
      <div className="row mt-4">
        <div className="col ">
          <div className="card " style={{ background: "#abcc" }}>
            <div
              className="card-header text-center"
              style={{
                background: "#99dd",
                position: "relative",
                padding: "10px",
              }}
            >
              {/* Texto centrado */}
              <span>Bibliografias</span>
            </div>

            <div
              className="card-body border-primary "
              style={{ background: "#f0f0f0" }}
            >
              <Box
                sx={{
                  paddingBottom: 1,
                  paddingLeft: 1,
                  paddingRight: 1,
                  borderRadius: 2,
                  background: "white",
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <Autocomplete
                  className=""
                  freeSolo
                  options={filteredReferences || []}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.title || ""
                  }
                  value={selectedReference || null}
                  onInputChange={(event, newValue) => {
                    if (event && event.type === "change") {
                      handleReferenceFilter({
                        target: { value: newValue },
                      });
                    }
                  }}
                  onChange={(event, newValue) => {
                    if (newValue && typeof newValue !== "string") {
                      handleReferenceChange(newValue);
                    } else if (typeof newValue === "string") {
                      handleReferenceChange({
                        _id: null,
                        title: newValue,
                      });
                    } else {
                      handleReferenceChange({ _id: null, title: "" });
                    }
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={option._id || option.title}>
                      {option.title}
                    </li>
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Chip
                          key={option._id}
                          {...tagProps}
                          label={option.title}
                        />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        langData.pieceDetailDescriptors.research
                          .bibliographies_reference
                      }
                      placeholder={
                        langData.pieceDetailDescriptors.research
                          .type_to_filter_reference
                      }
                      variant="outlined"
                      fullWidth
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

                <TextField
                  label="Title"
                  id="title"
                  value={
                    (bibliographies &&
                      bibliographies[currentBibliographyIndex]?.title) ||
                    ""
                  }
                  onChange={(e) => handleInputBibliographyChange(e)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Author"
                  id="author"
                  value={
                    (bibliographies &&
                      bibliographies[currentBibliographyIndex]?.author) ||
                    ""
                  }
                  onChange={(e) => handleInputBibliographyChange(e)}
                  fullWidth
                  margin="dense"
                />

                <TextField
                  label="Article"
                  id="article"
                  value={
                    (bibliographies &&
                      bibliographies[currentBibliographyIndex]?.article) ||
                    ""
                  }
                  onChange={(e) => handleInputBibliographyChange(e)}
                  fullWidth
                  margin="dense"
                />

                <TextField
                  label="Chapter"
                  id="chapter"
                  value={
                    (bibliographies &&
                      bibliographies[currentBibliographyIndex]?.chapter) ||
                    ""
                  }
                  onChange={(e) => handleInputBibliographyChange(e)}
                  fullWidth
                  margin="dense"
                />

                <TextField
                  label="Editorial"
                  id="editorial"
                  value={
                    (bibliographies &&
                      bibliographies[currentBibliographyIndex]?.editorial) ||
                    ""
                  }
                  onChange={(e) => handleInputBibliographyChange(e)}
                  fullWidth
                  margin="dense"
                />

                <TextField
                  label="Vol No"
                  id="vol_no"
                  value={
                    (bibliographies &&
                      bibliographies[currentBibliographyIndex]?.vol_no) ||
                    ""
                  }
                  onChange={(e) => handleInputBibliographyChange(e)}
                  fullWidth
                  margin="dense"
                />

                <TextField
                  label="City Country"
                  id="city_country"
                  value={
                    (bibliographies &&
                      bibliographies[currentBibliographyIndex]?.city_country) ||
                    ""
                  }
                  onChange={(e) => handleInputBibliographyChange(e)}
                  fullWidth
                  margin="dense"
                />

                <TextField
                  label="Pages"
                  id="pages"
                  value={
                    (bibliographies &&
                      bibliographies[currentBibliographyIndex]?.pages) ||
                    ""
                  }
                  onChange={(e) => handleInputBibliographyChange(e)}
                  fullWidth
                  margin="dense"
                />

                <TextField
                  label="Editor"
                  id="editor"
                  value={
                    (bibliographies &&
                      bibliographies[currentBibliographyIndex]?.editor) ||
                    ""
                  }
                  onChange={(e) => handleInputBibliographyChange(e)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Web page"
                  id="webpage"
                  value={
                    (bibliographies &&
                      bibliographies[currentBibliographyIndex]?.webpage) ||
                    ""
                  }
                  onChange={(e) => handleInputBibliographyChange(e)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Identifier"
                  id="identifier"
                  value={
                    (bibliographies &&
                      bibliographies[currentBibliographyIndex]?.identifier) ||
                    ""
                  }
                  onChange={(e) => handleInputBibliographyChange(e)}
                  fullWidth
                  margin="dense"
                />
              </Box>

              <div className="d-flex justify-content-between mt-3">
                <Button
                  variant="contained"
                  color="secondary"
                  type="button"
                  onClick={handlePrevBibliography}
                  className="btn btn-secondary"
                >
                  ← {langData.pieceInventoryEdit.previous}
                </Button>
                <span>
                  {currentBibliographyIndex + 1} /{" "}
                  {bibliographies?.length ? bibliographies.length : null}
                </span>{" "}
                {/* Paginación */}
                <Button
                  variant="contained"
                  color="secondary"
                  type="button"
                  onClick={handleNextBibliography}
                  className="btn btn-secondary"
                >
                  {langData.pieceInventoryEdit.next} →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
