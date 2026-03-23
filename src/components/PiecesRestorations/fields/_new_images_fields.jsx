
import { getTranslations } from "../../Languages/i18n";
import { Button } from "@mui/material";
import Dropzone from "react-dropzone";
import {  useState } from "react";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { pink } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { ModalPictures } from "./_modal_pictures";
//import { faBan } from "@fortawesome/free-solid-svg-icons";


const langData = getTranslations();
export const NewImagesField = ({PicsNew, setPicsNew}) => {
    const [isExpandedImg, setIsExpandedImg] = useState(false);
   // const [PicsNew, setPicsNew] = useState([]);
    const [currentImgNewIndex, setCurrentImgNewIndex] = useState(0);


    const toggleExpandNewImage = () => {
        setIsExpandedImg(!isExpandedImg);
    };


    const deleteImage = (index) => {
        setPicsNew(PicsNew.filter((_, i) => i !== index));
        setCurrentImgNewIndex(0); // Actualiza el índice al primer elemento
    };


    const addImage = () => {
        const newImage = {
        photographer: "",
        description: "",
        photographed_at: "",
        file: null,
        };
        setPicsNew([...PicsNew, newImage]);
        setCurrentImgNewIndex(PicsNew.length); // Actualiza el índice al último elemento nuevo
    };

    const handleImageDrop = (acceptedFiles) => {
    //console.log("pics new", PicsNew);
    const updatedPics = [...PicsNew];
    updatedPics[currentImgNewIndex] = {
      ...updatedPics[currentImgNewIndex],
      file: acceptedFiles[0],
      size: acceptedFiles[0].size,
      mime_type: acceptedFiles[0].type,
    };
    setPicsNew(updatedPics);
  };

    const handlePrevNew = () => {
    setCurrentImgNewIndex((prevIndex) => {
      if (PicsNew.length > 0) {
        return prevIndex === 0 ? PicsNew.length - 1 : prevIndex - 1;
      }
      return prevIndex; // No cambia si no hay imágenes
    });
    //setCurrentPicNew(PicsNew && PicsNew.length > 0 ? PicsNew[currentImgNewIndex] : null);
  };
  const handleNextNew = () => {
    setCurrentImgNewIndex((prevIndex) => {
      if (PicsNew.length > 0) {
        return prevIndex === PicsNew.length - 1 ? 0 : prevIndex + 1;
      }
      return prevIndex; // No cambia si no hay imágenes
    });
    // setCurrentPicNew(PicsNew && PicsNew.length > 0 ? PicsNew[currentImgNewIndex] : null);
  };

return(

 <div className="row">
              <div className="col">
                <div className="card mt-4" style={{ background: "#abcc" }}>
                  {/* Card Header */}
                  <div
                    className="card-header text-center"
                    style={{
                      background: "#99dd",
                      position: "relative",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                    onClick={toggleExpandNewImage}
                  >
                    {/* Header Content */}
                    <span>{langData.pieceInventoryEdit.new_images} </span>
                    {isExpandedImg && (
                      <>
                        <IconButton
                          sx={{ color: pink[400] }}
                          aria-label="del image"
                          onClick={(e) => {
                            e.stopPropagation(); // Evita que el clic oculte el contenido
                            deleteImage(currentImgNewIndex);
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
                            addImage();
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
                      {isExpandedImg ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </div>

                  {/* Card Body */}
                  {isExpandedImg && (
                    <>
                      {PicsNew.length > 0 && (
                        <div className="card-body text-center">
                          {/* Images and Inputs */}
                          <div className="mb-4">
                            <div className="row">
                              {/* Current Image */}
                              <div className="col-4">
                                {PicsNew[currentImgNewIndex]?.file && (
                                  <img
                                    alt="thumbnail"
                                    src={URL.createObjectURL(
                                      PicsNew[currentImgNewIndex].file
                                    )}
                                    className="img-fluid mb-3 rounded"
                                    style={{
                                      maxHeight: "100px",
                                      maxWidth: "100px",
                                    }}
                                    data-bs-toggle="modal"
                                    data-bs-target={`#modalPicNewNew${currentImgNewIndex}`}
                                  />
                                )}
                              </div>

                              {/* Dropzone */}

                              <div className="col-4">
                                <Dropzone
                                  maxFiles={1}
                                  accept={{
                                    "image/png": [".png"],
                                    "image/jpeg": [".jpg", ".jpeg"],
                                  }}
                                  onDrop={(acceptedFiles) =>
                                    handleImageDrop(acceptedFiles)
                                  }
                                >
                                  {({ getRootProps, getInputProps }) => (
                                    <section className="container-fluid dashed-box">
                                      <div
                                        {...getRootProps({
                                          className: "dropzone",
                                        })}
                                      >
                                        <input {...getInputProps()} />
                                        <p>
                                          Arrastra aquí tu imagen o haz clic
                                          para subirla
                                        </p>
                                      </div>
                                    </section>
                                  )}
                                </Dropzone>
                              </div>
                            </div>

                            {/* Modal for Uploaded Image */}
                            <ModalPictures
                              IDmodal={`modalPicNewNew${currentImgNewIndex}`}
                              picFileName={null}
                              ObjectImg={
                                PicsNew[currentImgNewIndex]?.file
                                  ? URL.createObjectURL(
                                      PicsNew[currentImgNewIndex].file
                                    )
                                  : null
                              }
                            />

                            {/* Input Fields */}
                            <div className="text-start">
                              <label className="d-block">
                                Fotógrafo:
                                <input
                                  id="photographer"
                                  type="text"
                                  value={
                                    PicsNew[currentImgNewIndex]?.photographer ||
                                    ""
                                  }
                                  className="form-control mt-2"
                                  onChange={(e) => {
                                    const updatedPics = [...PicsNew];
                                    updatedPics[currentImgNewIndex] = {
                                      ...updatedPics[currentImgNewIndex],
                                      photographer: e.target.value,
                                    };
                                    setPicsNew(updatedPics);
                                  }}
                                />
                              </label>
                              <label className="d-block mt-3">
                                Fecha de fotografía:
                                <input
                                  id="photographed_at"
                                  type="date"
                                  value={
                                    PicsNew[currentImgNewIndex]
                                      ?.photographed_at || ""
                                  }
                                  className="form-control mt-2"
                                  onChange={(e) => {
                                    const updatedPics = [...PicsNew];
                                    updatedPics[currentImgNewIndex] = {
                                      ...updatedPics[currentImgNewIndex],
                                      photographed_at: e.target.value,
                                    };
                                    setPicsNew(updatedPics);
                                  }}
                                />
                              </label>
                              <label className="d-block mt-3">
                                Descripción:
                                <textarea
                                  id="description"
                                  value={
                                    PicsNew[currentImgNewIndex]?.description ||
                                    ""
                                  }
                                  className="form-control mt-2"
                                  onChange={(e) => {
                                    const updatedPics = [...PicsNew];
                                    updatedPics[currentImgNewIndex] = {
                                      ...updatedPics[currentImgNewIndex],
                                      description: e.target.value,
                                    };
                                    setPicsNew(updatedPics);
                                  }}
                                />
                              </label>
                            </div>

                            {/* Pagination Buttons */}
                            <div className="d-flex justify-content-between mt-3">
                              <Button
                                variant="contained"
                                color="secondary"
                                type="button"
                                onClick={handlePrevNew}
                                className="btn btn-secondary"
                              >
                                ← Anterior
                              </Button>
                              <span>
                                {currentImgNewIndex + 1} / {PicsNew.length}
                              </span>
                              <Button
                                variant="contained"
                                color="secondary"
                                type="button"
                                onClick={handleNextNew}
                                className="btn btn-secondary"
                              >
                                Siguiente →
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
)
}