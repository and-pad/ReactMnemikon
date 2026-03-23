import { useState } from "react";
import { TextField, Autocomplete, Box, IconButton, Chip, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { pink } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export const NewBibliographyFields = ({
  newBibliographies,
  setNewBibliographies,
  handleReferenceFilter,
  filteredReferences,
  allreferences,
  langData,
}) => {
  const [currentNewBibliographyIndex, setCurrentNewBibliographyIndex] =
    useState(0);
  const [isExpandedNewBibliography, setIsExpandedNewBibliography] =
    useState(false);

  const [selectedNewReference, setSelectedNewReference] = useState();

  const deleteBibliography = (index) => {
    setNewBibliographies(newBibliographies.filter((_, i) => i !== index));
    setCurrentNewBibliographyIndex(0); // Actualiza el índice al primer elemento
  };

  const handleInputNewBibliographyChange = (e) => {
    const { id, value } = e.target;
    setNewBibliographies((prevData) =>
      prevData.map((bibliography, index) => {
        if (index === currentNewBibliographyIndex) {
          const updatedBibliography = { ...bibliography, [id]: value };
          /*console.log("Updated bibliography:", updatedBibliography[id]);
          console.log("actualBibliographies:", actualBibliographies[index][id]);*/
          return updatedBibliography;
        }
        return bibliography;
      })
    );
  };

  const handleNextNewBibliography = () => {
    setCurrentNewBibliographyIndex((prevIndex) => {
      const newIndex =
        prevIndex === newBibliographies.length - 1 ? 0 : prevIndex + 1;
      setSelectedNewReference(
        newBibliographies[newIndex].reference_type_info[0]
      );
      return newIndex;
    });
  };
  const handlePrevNewBibliography = () => {
    setCurrentNewBibliographyIndex((prevIndex) => {
      const newIndex =
        prevIndex === 0 ? newBibliographies.length - 1 : prevIndex - 1;
      setSelectedNewReference(
        newBibliographies[newIndex].reference_type_info[0]
      );
      return newIndex;
    });

    // console.log("bibliographies", bibliographies[currentBibliographyIndex]);
  };

  const handleNewReferenceChange = (selectedReferences) => {
    setNewBibliographies((prev) => {
      const updated = [...prev]; // copia superficial del arreglo
      updated[currentNewBibliographyIndex] = {
        ...updated[currentNewBibliographyIndex],
        reference_type_info: [selectedReferences], // esto debe ser un array
      };
      return updated;
    });
    setSelectedNewReference(selectedReferences); // Actualiza el estado del reference_type_info
  };

    const addBibliography = () => {
    const new_bibliography = {
      reference_type_info:
        allreferences && allreferences.length > 0 ? [allreferences[0]] : [],
      _id: null,
      title: null,
      author: null,
      article: null,
      chapter: null,
      editorial: null,
      vol_no: null,
      city_country: null,
      pages: null,
      editor: null,
      webpage: null,
      identifier: null,
    };
    setNewBibliographies((prev) => [...prev, new_bibliography]);
  };

  const toggleExpandNewBibliography = () => {
    setIsExpandedNewBibliography(!isExpandedNewBibliography);
  };
  return (
    <>
      <div className="row mt-4 ">
        <div className="col ">
          <div className="card " style={{ background: "#abcc" }}>
            <div
              className="card-header text-center"
              style={{
                background: "#99dd",
                position: "relative",
                padding: "10px",
              }}
              onClick={toggleExpandNewBibliography}
            >
              {/* Texto centrado */}
              <span>Bibliografias Nuevas</span>
              {isExpandedNewBibliography && (
                <>
                  <IconButton
                    sx={{ color: pink[400] }}
                    aria-label="del image"
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que el clic oculte el contenido
                      deleteBibliography(currentNewBibliographyIndex);
                    }}
                    style={{
                      position: "absolute",
                      right: "75px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>

                  <IconButton
                    color="secondary"
                    aria-label="add image"
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que el clic oculte el contenido
                      addBibliography();
                    }}
                    style={{
                      position: "absolute",
                      right: "50px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </>
              )}
              <IconButton
                color="primary"
                aria-label="toggle expand"
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {isExpandedNewBibliography ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </div>

            {isExpandedNewBibliography && (
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
                    className="mt-2"
                    freeSolo
                    options={filteredReferences || []}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.title || ""
                    }
                    value={
                      selectedNewReference || filteredReferences[0] || null
                    }
                    onInputChange={(event, newValue) => {
                      if (event && event.type === "change") {
                        handleReferenceFilter({
                          target: { value: newValue },
                        });
                      }
                    }}
                    onChange={(event, newValue) => {
                      if (newValue && typeof newValue !== "string") {
                        handleNewReferenceChange(newValue);
                      } else if (typeof newValue === "string") {
                        handleNewReferenceChange({
                          _id: null,
                          title: newValue,
                        });
                      } else {
                        handleNewReferenceChange({
                          _id: null,
                          title: "",
                        });
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
                        const { key, ...tagProps } = getTagProps({
                          index,
                        });
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
                      (newBibliographies &&
                        newBibliographies[currentNewBibliographyIndex]
                          ?.title) ||
                      ""
                    }
                    onChange={(e) => handleInputNewBibliographyChange(e)}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Author"
                    id="author"
                    value={
                      (newBibliographies &&
                        newBibliographies[currentNewBibliographyIndex]
                          ?.author) ||
                      ""
                    }
                    onChange={(e) => handleInputNewBibliographyChange(e)}
                    fullWidth
                    margin="dense"
                  />

                  <TextField
                    label="Article"
                    id="article"
                    value={
                      (newBibliographies &&
                        newBibliographies[currentNewBibliographyIndex]
                          ?.article) ||
                      ""
                    }
                    onChange={(e) => handleInputNewBibliographyChange(e)}
                    fullWidth
                    margin="dense"
                  />

                  <TextField
                    label="Chapter"
                    id="chapter"
                    value={
                      (newBibliographies &&
                        newBibliographies[currentNewBibliographyIndex]
                          ?.chapter) ||
                      ""
                    }
                    onChange={(e) => handleInputNewBibliographyChange(e)}
                    fullWidth
                    margin="dense"
                  />

                  <TextField
                    label="Editorial"
                    id="editorial"
                    value={
                      (newBibliographies &&
                        newBibliographies[currentNewBibliographyIndex]
                          ?.editorial) ||
                      ""
                    }
                    onChange={(e) => handleInputNewBibliographyChange(e)}
                    fullWidth
                    margin="dense"
                  />

                  <TextField
                    label="Vol No"
                    id="vol_no"
                    value={
                      (newBibliographies &&
                        newBibliographies[currentNewBibliographyIndex]
                          ?.vol_no) ||
                      ""
                    }
                    onChange={(e) => handleInputNewBibliographyChange(e)}
                    fullWidth
                    margin="dense"
                  />

                  <TextField
                    label="City Country"
                    id="city_country"
                    value={
                      (newBibliographies &&
                        newBibliographies[currentNewBibliographyIndex]
                          ?.city_country) ||
                      ""
                    }
                    onChange={(e) => handleInputNewBibliographyChange(e)}
                    fullWidth
                    margin="dense"
                  />

                  <TextField
                    label="Pages"
                    id="pages"
                    value={
                      (newBibliographies &&
                        newBibliographies[currentNewBibliographyIndex]
                          ?.pages) ||
                      ""
                    }
                    onChange={(e) => handleInputNewBibliographyChange(e)}
                    fullWidth
                    margin="dense"
                  />

                  <TextField
                    label="Editor"
                    id="editor"
                    value={
                      (newBibliographies &&
                        newBibliographies[currentNewBibliographyIndex]
                          ?.editor) ||
                      ""
                    }
                    onChange={(e) => handleInputNewBibliographyChange(e)}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Web page"
                    id="webpage"
                    value={
                      (newBibliographies &&
                        newBibliographies[currentNewBibliographyIndex]
                          ?.webpage) ||
                      ""
                    }
                    onChange={(e) => handleInputNewBibliographyChange(e)}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Identifier"
                    id="identifier"
                    value={
                      (newBibliographies &&
                        newBibliographies[currentNewBibliographyIndex]
                          ?.identifier) ||
                      ""
                    }
                    onChange={(e) => handleInputNewBibliographyChange(e)}
                    fullWidth
                    margin="dense"
                  />
                </Box>

                <div className="d-flex justify-content-between mt-3">
                  <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    onClick={handlePrevNewBibliography}
                    className="btn btn-secondary"
                  >
                    ← {langData.pieceInventoryEdit.previous}
                  </Button>
                  <span>
                    {currentNewBibliographyIndex + 1} /{" "}
                    {newBibliographies?.length
                      ? newBibliographies.length
                      : null}
                  </span>{" "}
                  {/* Paginación */}
                  <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    onClick={handleNextNewBibliography}
                    className="btn btn-secondary"
                  >
                    {langData.pieceInventoryEdit.next} →
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
