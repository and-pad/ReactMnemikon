import { getTranslations } from "../../Languages/i18n";
import { Button } from "@mui/material";
import Dropzone from "react-dropzone";
import {  formatSize } from "../../LocalTools/tools";
import  SETTINGS from "../../Config/settings";
//import { ModalPictures } from "../Inventory/ModalPictures";
import { useState , useEffect} from "react";
import { ModalPictures } from "./_modal_pictures";

const thumb_image_path = SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.restoration_thumbnails;


const langData = getTranslations();

function formatDate(dateTime) {
  return dateTime.split(" ")[0]; // Extrae solo la fecha en formato YYYY-MM-DD
}

export const ImagesField = ({photos, setPhotos, changedPics, setChangedPics}) => {

const [currentPic, setCurrentPic] = useState(null);
const [currentImgIndex, setCurrentImgIndex] = useState(0);
//const [Pics, setPics] = useState([]); // Array of picture objects with metadata


  const handleChangeImageStatus = ({ file }) => {
    setChangedPics((prevChangedPics) => {
      const updatedFile = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
      return {
        ...prevChangedPics,
        [currentImgIndex]: {
          _id: photos[currentImgIndex]._id,
          file: updatedFile,
        },
      };
    });
  };


  useEffect(() => {
    if (photos && photos.length > 0) {
      setCurrentPic(photos[currentImgIndex]);
    }
  }, [photos, currentImgIndex]);

    const handlePrev = () => {    
    setCurrentImgIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? photos.length - 1 : prevIndex - 1;
      setCurrentPic(photos && photos.length > 0 ? photos[newIndex] : null);
      return newIndex;
    });
  };
  const handleInputPic = (e) => {
    const { id, value } = e.target;
    setPhotos((prevData) =>
      prevData.map(
        (pic, index) =>
          index === currentImgIndex
            ? { ...pic, [id]: value } // Crea una copia del objeto actual con el campo actualizado
            : pic // Retorna el objeto sin cambios si el índice no coincide
      )
    );
  };

  const handleNext = () => {   
    setCurrentImgIndex((prevIndex) => {
      const newIndex = prevIndex === photos.length - 1 ? 0 : prevIndex + 1;
      //console.log(newIndex);
      setCurrentPic(photos && photos.length > 0 ? photos[newIndex] : null);
      return newIndex;
    });
  };
  
    return(
  <div className="row">
    <div className="col">
      <div className="card mt-4" style={{ background: "#abcc" }}>
        <div
          className="card-header text-center"
          style={{
            background: "#99dd",
            position: "relative",
            padding: "10px",
          }}
        >
          {/* Texto centrado */}
          <span>{langData.pieceInventoryEdit.images}</span>
        </div>

        <div className="card-body text-center">
          <div className="mb-4">
            <div className="row">
              <div className="col-4">
                <img
                  alt="thumbnail"
                  src={`${thumb_image_path}${
                    currentPic?.file_name ? currentPic.file_name : ""
                  }`}
                  className="img-fluid mb-3 rounded"
                  style={{ maxHeight: "100px", maxWidth: "100px" }}
                  data-bs-toggle="modal"
                  data-bs-target={`#modalPicEdit${currentImgIndex}`}
                />
              </div>

              <div className="col-4">
                <Dropzone
                  disabled={!currentPic?.file_name}
                  maxFiles={1}
                  accept={{
                    "image/png": [".png"],
                    "image/jpeg": [".jpg", ".jpeg"],
                    "image/gif": [".gif"],
                    "image/svg+xml": [".svg"],
                    "image/bmp": [".bmp"],
                    "image/tiff": [".tiff"],
                    "image/webp": [".webp"],
                  }}
                  onDrop={(acceptedFiles) =>
                    handleChangeImageStatus({
                      file: acceptedFiles[0],
                    })
                  }
                >
                  {({ getRootProps, getInputProps }) => (
                    <section className="container-fluid dashed-box">
                      <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} />
                        <p>{langData.pieceInventoryEdit.uploader_img_sign}</p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>

              <div className="col-4">
                {changedPics &&
                changedPics[currentImgIndex] &&
                changedPics[currentImgIndex]["file"] ? (
                  <img
                    alt="new pic"
                    src={URL.createObjectURL(
                      changedPics[currentImgIndex]["file"]
                    )}
                    className="img-fluid mb-3 rounded"
                    style={{ maxHeight: "100px", maxWidth: "100px" }}
                    data-bs-toggle="modal"
                    data-bs-target={`#modalPicNew${currentImgIndex}`}
                  />
                ) : null}
              </div>
            </div>
            <ModalPictures
              IDmodal={`modalPicNew${currentImgIndex}`}
              picFileName={null}
              ObjectImg={
                changedPics &&
                changedPics[currentImgIndex] &&
                changedPics[currentImgIndex]["file"]
                  ? URL.createObjectURL(changedPics[currentImgIndex]["file"])
                  : null
              }
            />
            <ModalPictures
              IDmodal={`modalPicEdit${currentImgIndex}`}
              picFileName={currentPic?.file_name || ""}
              ObjectImg={null}
            />

            <div className="text-start">
              <label className="d-block">
                {langData.pieceInventoryEdit.photographer}:
                <input
                  id="photographer"
                  type="text"
                  value={
                    photos && photos[currentImgIndex]?.photographer
                      ? photos[currentImgIndex].photographer
                      : ""
                  }
                  className="form-control mt-2"
                  onChange={handleInputPic}
                />
              </label>
              <label className="d-block mt-3">
                {langData.pieceInventoryEdit.photographed_at}:
                <input
                  id="photographed_at"
                  type="date"
                  value={formatDate(
                    photos && photos[currentImgIndex]?.photographed_at
                      ? photos[currentImgIndex].photographed_at
                      : ""
                  )}
                  className="form-control mt-2"
                  onChange={handleInputPic}
                />
              </label>
              <label className="d-block mt-3">
                {langData.pieceInventoryEdit.description}:
                <textarea
                  id="description"
                  value={
                    photos && photos[currentImgIndex]?.description
                      ? photos[currentImgIndex].description
                      : ""
                  }
                  className="form-control mt-2"
                  onChange={handleInputPic}
                />
              </label>
              <label className="d-block mt-3">
                {langData.pieceInventoryEdit.size}:
                <p className="mt-2">
                  {formatSize(currentPic?.size ? currentPic.size : 0)}
                </p>
              </label>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <Button
              variant="contained"
              color="secondary"
              type="button"
              onClick={handlePrev}
              className="btn btn-secondary"
            >
              ← {langData.pieceInventoryEdit.previous}
            </Button>
            <span>
              {currentImgIndex + 1} / {photos?.length ? photos.length : null}
            </span>{" "}
            {/* Paginación */}
            <Button
              variant="contained"
              color="secondary"
              type="button"
              onClick={handleNext}
              className="btn btn-secondary"
            >
              {langData.pieceInventoryEdit.next} →
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
    );
};

