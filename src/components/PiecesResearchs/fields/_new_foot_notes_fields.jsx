import { useState } from "react";
import { TextField, IconButton, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { pink } from "@mui/material/colors";

export const NewFootNotesFields = ({
  newFootnotes,
  setNewFootnotes,
  langData,
}) => {
  const [isExpandedFootnote, setIsExpandedFootnote] = useState(false);
  const [currentNewFootnoteIndex, setCurrentNewFootnoteIndex] = useState(0);

  const addFootnote = () => {
    const new_footnote = {
      /*reference_type_info:
        allreferences && allreferences.length > 0 ? [allreferences[0]] : [],*/
      _id: null,
      title: null,
      author: null,
      article: null,
      chapter: null,
      editorial: null,
      vol_no: null,
      city_country: null,
      pages: null,
      publication_date: null,
      description: null,
    };
    setNewFootnotes((prev) => [...prev, new_footnote]);
  };
  const handlePrevNewFootnote = () => {
    setCurrentNewFootnoteIndex((prevIndex) =>
      prevIndex === 0 ? newFootnotes.length - 1 : prevIndex - 1
    );
  };
  const handleNextNewFootnote = () => {
    setCurrentNewFootnoteIndex((prevIndex) =>
      prevIndex === newFootnotes.length - 1 ? 0 : prevIndex + 1
    );
  };

  const toggleExpandFootnote = () => {
    setIsExpandedFootnote(!isExpandedFootnote);
  };

  const deleteFootnote = (index) => {
    setNewFootnotes(newFootnotes.filter((_, i) => i !== index));
    setCurrentNewFootnoteIndex(0); // Actualiza el índice al primer elemento
  };

  const handleInputNewFootnoteChange = (e) => {
    const { id, value } = e.target;
    setNewFootnotes((prevData) =>
      prevData.map((footnote, index) => {
        if (index === currentNewFootnoteIndex) {
          const updatedFootnote = { ...footnote, [id]: value };
          /*console.log("Updated footnote:", updatedFootnote[id]);
          console.log("actualFootnotes:", actualFootnotes[index][id]);*/
          return updatedFootnote;
        }
        return footnote;
      })
    );
  };

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
              onClick={toggleExpandFootnote}
            >
              {/* Texto centrado */}
              <span>Notas al pie Nuevas</span>

              {isExpandedFootnote && (
                <>
                  <IconButton
                    sx={{ color: pink[400] }}
                    aria-label="del image"
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que el clic oculte el contenido
                      deleteFootnote(currentNewFootnoteIndex);
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
                      addFootnote();
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
                {isExpandedFootnote ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </div>

            {isExpandedFootnote && (
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
                  <TextField
                    label={langData.pieceDetailDescriptors.foot_notes.title}
                    id="title"
                    value={
                      (newFootnotes &&
                        newFootnotes[currentNewFootnoteIndex]?.title) ||
                      ""
                    }
                    onChange={(e) => handleInputNewFootnoteChange(e)}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label={langData.pieceDetailDescriptors.foot_notes.author}
                    id="author"
                    value={
                      (newFootnotes &&
                        newFootnotes[currentNewFootnoteIndex]?.author) ||
                      ""
                    }
                    onChange={(e) => handleInputNewFootnoteChange(e)}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label={
                      langData.pieceDetailDescriptors.foot_notes.city_country
                    }
                    id="city_country"
                    value={
                      (newFootnotes &&
                        newFootnotes[currentNewFootnoteIndex]?.city_country) ||
                      ""
                    }
                    onChange={(e) => handleInputNewFootnoteChange(e)}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label={langData.pieceDetailDescriptors.foot_notes.vol_no}
                    id="vol_no"
                    value={
                      (newFootnotes &&
                        newFootnotes[currentNewFootnoteIndex]?.vol_no) ||
                      ""
                    }
                    onChange={(e) => handleInputNewFootnoteChange(e)}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label={
                      langData.pieceDetailDescriptors.foot_notes.description
                    }
                    id="description"
                    value={
                      (newFootnotes &&
                        newFootnotes[currentNewFootnoteIndex]?.description) ||
                      ""
                    }
                    onChange={(e) => handleInputNewFootnoteChange(e)}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label={langData.pieceDetailDescriptors.foot_notes.article}
                    id="article"
                    value={
                      (newFootnotes &&
                        newFootnotes[currentNewFootnoteIndex]?.article) ||
                      ""
                    }
                    onChange={(e) => handleInputNewFootnoteChange(e)}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label={langData.pieceDetailDescriptors.foot_notes.chapter}
                    id="chapter"
                    value={
                      (newFootnotes &&
                        newFootnotes[currentNewFootnoteIndex]?.chapter) ||
                      ""
                    }
                    onChange={(e) => handleInputNewFootnoteChange(e)}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label={langData.pieceDetailDescriptors.foot_notes.editorial}
                    id="editorial"
                    value={
                      (newFootnotes &&
                        newFootnotes[currentNewFootnoteIndex]?.editorial) ||
                      ""
                    }
                    onChange={(e) => handleInputNewFootnoteChange(e)}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label={langData.pieceDetailDescriptors.foot_notes.pages}
                    id="pages"
                    value={
                      (newFootnotes &&
                        newFootnotes[currentNewFootnoteIndex]?.pages) ||
                      ""
                    }
                    onChange={(e) => handleInputNewFootnoteChange(e)}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label={
                      langData.pieceDetailDescriptors.foot_notes
                        .publication_date
                    }
                    id="publication_date"
                    value={
                      (newFootnotes &&
                        newFootnotes[currentNewFootnoteIndex]
                          ?.publication_date) ||
                      ""
                    }
                    onChange={(e) => handleInputNewFootnoteChange(e)}
                    fullWidth
                    margin="dense"
                  />
                </Box>

                <div className="d-flex justify-content-between mt-3">
                  <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    onClick={handlePrevNewFootnote}
                    className="btn btn-secondary"
                  >
                    ← {langData.pieceInventoryEdit.previous}
                  </Button>
                  <span>
                    {currentNewFootnoteIndex + 1} /{" "}
                    {newFootnotes?.length ? newFootnotes.length : null}
                  </span>{" "}
                  {/* Paginación */}
                  <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    onClick={handleNextNewFootnote}
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
