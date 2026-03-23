import { useState } from "react";
import { Box, TextField ,Button } from "@mui/material";

export const FootNotesFields = ({ footnotes, setFootnotes, langData }) => {
  const [currentFootnoteIndex, setCurrentFootnoteIndex] = useState(0);

  const handlePrevFootnote = () => {
    setCurrentFootnoteIndex((prevIndex) =>
      prevIndex === 0 ? footnotes.length - 1 : prevIndex - 1
    );
  };
  const handleNextFootnote = () => {
    setCurrentFootnoteIndex((prevIndex) =>
      prevIndex === footnotes.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleInputFootnoteChange = (e) => {
    const { id, value } = e.target;

    setFootnotes((prevData) =>
      prevData.map((footnote, index) => {
        if (index === currentFootnoteIndex) {
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
      <div className="row mt-3">
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
              <span>Notas al pie</span>
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
                <TextField
                  label={langData.pieceDetailDescriptors.foot_notes.title}
                  id="title"
                  value={
                    (footnotes && footnotes[currentFootnoteIndex]?.title) || ""
                  }
                  onChange={(e) => handleInputFootnoteChange(e)}
                  fullWidth
                  size="small"
                  margin="dense"
                />
                <TextField
                  label={langData.pieceDetailDescriptors.foot_notes.author}
                  id="author"
                  value={
                    (footnotes && footnotes[currentFootnoteIndex]?.author) || ""
                  }
                  onChange={(e) => handleInputFootnoteChange(e)}
                  fullWidth
                  size="small"
                  margin="dense"
                />
                <TextField
                  label={
                    langData.pieceDetailDescriptors.foot_notes.city_country
                  }
                  id="city_country"
                  value={
                    (footnotes &&
                      footnotes[currentFootnoteIndex]?.city_country) ||
                    ""
                  }
                  onChange={(e) => handleInputFootnoteChange(e)}
                  fullWidth
                  size="small"
                  margin="dense"
                />
                <TextField
                  label={langData.pieceDetailDescriptors.foot_notes.vol_no}
                  id="vol_no"
                  value={
                    (footnotes && footnotes[currentFootnoteIndex]?.vol_no) || ""
                  }
                  onChange={(e) => handleInputFootnoteChange(e)}
                  fullWidth
                  size="small"
                  margin="dense"
                />
                <TextField
                  label={langData.pieceDetailDescriptors.foot_notes.description}
                  id="description"
                  value={
                    (footnotes &&
                      footnotes[currentFootnoteIndex]?.description) ||
                    ""
                  }
                  onChange={(e) => handleInputFootnoteChange(e)}
                  fullWidth
                  size="small"
                  margin="dense"
                />
                <TextField
                  label={langData.pieceDetailDescriptors.foot_notes.article}
                  id="article"
                  value={
                    (footnotes && footnotes[currentFootnoteIndex]?.article) ||
                    ""
                  }
                  onChange={(e) => handleInputFootnoteChange(e)}
                  fullWidth
                  size="small"
                  margin="dense"
                />
                <TextField
                  label={langData.pieceDetailDescriptors.foot_notes.chapter}
                  id="chapter"
                  value={
                    (footnotes && footnotes[currentFootnoteIndex]?.chapter) ||
                    ""
                  }
                  onChange={(e) => handleInputFootnoteChange(e)}
                  fullWidth
                  size="small"
                  margin="dense"
                />
                <TextField
                  label={langData.pieceDetailDescriptors.foot_notes.editorial}
                  id="editorial"
                  value={
                    (footnotes && footnotes[currentFootnoteIndex]?.editorial) ||
                    ""
                  }
                  onChange={(e) => handleInputFootnoteChange(e)}
                  fullWidth
                  size="small"
                  margin="dense"
                />
                <TextField
                  label={langData.pieceDetailDescriptors.foot_notes.pages}
                  id="pages"
                  value={
                    (footnotes && footnotes[currentFootnoteIndex]?.pages) || ""
                  }
                  onChange={(e) => handleInputFootnoteChange(e)}
                  fullWidth
                  size="small"
                  margin="dense"
                />
                <TextField
                  label={
                    langData.pieceDetailDescriptors.foot_notes.publication_date
                  }
                  id="publication_date"
                  value={
                    (footnotes &&
                      footnotes[currentFootnoteIndex]?.publication_date) ||
                    ""
                  }
                  onChange={(e) => handleInputFootnoteChange(e)}
                  fullWidth
                  size="small"
                  margin="dense"
                />
              </Box>

              <div className="d-flex justify-content-between mt-3">
                <Button
                  variant="contained"
                  color="secondary"
                  type="button"
                  onClick={handlePrevFootnote}
                  className="btn btn-secondary"
                >
                  ← {langData.pieceInventoryEdit.previous}
                </Button>
                <span>
                  {currentFootnoteIndex + 1} /{" "}
                  {footnotes?.length ? footnotes.length : null}
                </span>{" "}
                {/* Paginación */}
                <Button
                  variant="contained"
                  color="secondary"
                  type="button"
                  onClick={handleNextFootnote}
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
