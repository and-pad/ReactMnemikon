import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropzone from "react-dropzone";
import { IconButton, Button, Box, Typography, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { pink } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SETTINGS from "../../Config/settings";
import { Field } from "./_field";
import { OptionField } from "./_option_field";
import { TagField } from "./_tag_field";
import { SwitchBaseFrameField } from "./_switch_baseframe_field";

import {
  formatSize,
  fileTypes,
  mimeIcons,
  colorFile,
} from "../../LocalTools/tools";
import { AppraisalField } from "./_appraisal_field";

export const InventoryFields = ({
  langData,
  formData,
  handleInputChange,
  tags,
  currentTag,
  handleTagClick,
  handleTagDelete,
  handleTagKeyDown,
  filteredGenders,
  handleGenderFilter,
  handleGenderChange,
  filteredSubGenders,
  handleSubGenderFilter,
  handleSubGenderChange,
  filteredTypeObject,
  handleTypeObjectFilter,
  handleTypeObjectChange,
  filteredDominantMaterial,
  handleDominantMaterialFilter,
  handleDominantMaterialChange,
  image_path,
  currentPic,
  currentImgIndex,
  handleChangeImageStatus,
  Pics,
  formatDate,
  //formatSize,
  handleInputPic,
  handlePrev,
  handleNext,
  isExpandedImg,
  //toggleExpandNewImage,
  deleteImage,
  addImage,
  currentImgNewIndex,
  PicsNew,
  handleImageDrop,
  changedPics,
  refToSave,

  setPicsNew,
  handlePrevNew,
  handleNextNew,
  Documents,
  currentDocIndex,
  handleChangeDocumentStatus,
  changedDocs,
  setDocumentsNew,
  currentDocNewIndex,
  handleDocumentDrop,

  setDocuments,
  setCurrentDocNewIndex,
  setIsExpandedImg,
  setIsExpandedDoc,
  setCurrentDocIndex,
  DocumentsNew,
  isExpandedDoc,
  sendSave,

  handleLocationChange,
  handleLocationFilter,
  filteredLocations,
}) => {
  const handleInputDoc = (e) => {
    const { id, value } = e.target;
    setDocuments((prevData) =>
      prevData.map(
        (doc, index) =>
          index === currentDocIndex
            ? { ...doc, [id]: value } // Crea una copia del objeto actual con el campo actualizado
            : doc, // Retorna el objeto sin cambios si el índice no coincide
      ),
    );
  };

  const addDocument = () => {
    const newDocument = { name: "", file: null };
    setDocumentsNew([...DocumentsNew, newDocument]);
    setCurrentDocNewIndex(DocumentsNew.length); // Actualiza el índice al último elemento nuevo
  };
  const deleteDocument = (index) => {
    setDocumentsNew(DocumentsNew.filter((_, i) => i !== index));
    setCurrentDocNewIndex(0); // Actualiza el índice al primer elemento
  };

  const toggleExpandNewImage = () => {
    setIsExpandedImg(!isExpandedImg);
  };

  const toggleExpandNewDoc = () => {
    setIsExpandedDoc(!isExpandedDoc);
  };

  const handlePrevDoc = () => {
    setCurrentDocIndex((prevIndex) =>
      prevIndex === 0 ? Documents.length - 1 : prevIndex - 1,
    );
  };
  const handleNextDoc = () => {
    setCurrentDocIndex((prevIndex) =>
      prevIndex === Documents.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handlePrevNewDoc = () => {
    setCurrentDocNewIndex((prevIndex) => {
      if (DocumentsNew.length > 0) {
        return prevIndex === 0 ? DocumentsNew.length - 1 : prevIndex - 1;
      }
      return prevIndex; // No cambia si no hay imágenes
    });
  };
  const handleNextNewDoc = () => {
    setCurrentDocNewIndex((prevIndex) => {
      if (DocumentsNew.length > 0) {
        return prevIndex === DocumentsNew.length - 1 ? 0 : prevIndex + 1;
      }
      return prevIndex; // No cambia si no hay imágenes
    });
  };


  return (
    <>
      <div>
        <div className="row mb-3">
          <div className="col me-1">
            <Field
              formData={formData}
              handleInputChange={handleInputChange}
              ID={"origin_number"}
              Label={langData.pieceDetailDescriptors.inventory.origin_number}
            />
          </div>

          <div className="col ms-1 me-1">
            <Field
              formData={formData}
              handleInputChange={handleInputChange}
              ID={"inventory_number"}
              Label={langData.pieceDetailDescriptors.inventory.inventory_number}
            />
          </div>
          <div className="col ms-1">
            <Field
              formData={formData}
              handleInputChange={handleInputChange}
              ID={"catalog_number"}
              Label={langData.pieceDetailDescriptors.inventory.catalog_number}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col me-1">
            <Field
              formData={formData}
              handleInputChange={handleInputChange}
              ID={"description_origin"}
              Label={
                langData.pieceDetailDescriptors.inventory.description_origin
              }
            />
          </div>

          <div className="col ms-1">
            <Field
              formData={formData}
              handleInputChange={handleInputChange}
              ID={"description_inventory"}
              Label={
                langData.pieceDetailDescriptors.inventory.description_inventory
              }
            />
          </div>
        </div>

        <div className="row mb-1">
          <div className="col mb-1">
            <OptionField
              filteredOptions={filteredGenders}
              selectedOption={formData?.gender_id ? formData.gender_id : null}
              handleChange={handleGenderChange}
              handleFilter={handleGenderFilter}
              langData={langData}
              ID={"gender"}
              Label={langData.pieceDetailDescriptors.inventory.gender}
              PlaceHolder={
                langData.pieceDetailDescriptors.inventory.type_to_filter_genders
              }
            />
          </div>

          <div className="col mb-3">
            <OptionField
              filteredOptions={filteredSubGenders}
              selectedOption={
                formData?.subgender_id ? formData.subgender_id : null
              }
              handleChange={handleSubGenderChange}
              handleFilter={handleSubGenderFilter}
              langData={langData}
              ID={"subgender"}
              Label={langData.pieceDetailDescriptors.inventory.subgenders_info}
              PlaceHolder={
                langData.pieceDetailDescriptors.inventory
                  .type_to_filter_subgenders
              }
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <OptionField
              filteredOptions={filteredTypeObject}
              selectedOption={
                formData?.type_object_id ? formData.type_object_id : null
              }
              handleChange={handleTypeObjectChange}
              handleFilter={handleTypeObjectFilter}
              langData={langData}
              ID={"type_object"}
              Label={langData.pieceDetailDescriptors.inventory.type_object_info}
              PlaceHolder={
                langData.pieceDetailDescriptors.inventory.type_to_filter_types
              }
            />
          </div>

          <div className="col">
            <OptionField
              filteredOptions={filteredDominantMaterial}
              selectedOption={
                formData?.dominant_material_id
                  ? formData.dominant_material_id
                  : null
              }
              handleChange={handleDominantMaterialChange}
              handleFilter={handleDominantMaterialFilter}
              langData={langData}
              ID={"dominant_material"}
              Label={
                langData.pieceDetailDescriptors.inventory.dominant_material_info
              }
              PlaceHolder={
                langData.pieceDetailDescriptors.inventory
                  .type_to_filter_materials
              }
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <TagField
              handleTagDelete={handleTagDelete}
              handleTagClick={handleTagClick}
              handleTagKeyDown={handleTagKeyDown}
              tags={tags}
              currentTag={currentTag}
              handleInputChange={handleInputChange}
              langData={langData}
            />
          </div>

          <div className="col">
            <AppraisalField
              formData={formData}
              handleInputChange={handleInputChange}
              langData={langData}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            {formData && formData.action === "edit" ? (
              <>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 0.5,
                    borderRadius: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.09)",
                  }}
                >
                  <Typography variant="caption">Ubicación</Typography>
                  <Typography variant="body1">
                    {formData?.location || "No hay ubicación"}
                  </Typography>
                </Paper>
              </>
            ) : (
              <OptionField
                filteredOptions={filteredLocations}
                selectedOption={
                  formData?.location_id ? formData.location_id : null
                }
                handleChange={handleLocationChange}
                handleFilter={handleLocationFilter}
                langData={langData}
                ID={"location"}
                Label={langData.pieceDetailDescriptors.inventory.location_info}
                PlaceHolder={
                  langData.pieceDetailDescriptors.inventory
                    .type_to_filter_locations
                }
              />
            )}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <Field
              formData={formData}
              handleInputChange={handleInputChange}
              ID={"incidence"}
              Label={langData.pieceDetailDescriptors.inventory.incidence}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <Field
              formData={formData}
              handleInputChange={handleInputChange}
              ID={"admitted_at"}
              Label={langData.pieceDetailDescriptors.inventory.admitted_at}
            />
          </div>
        </div>
        <SwitchBaseFrameField
          formData={formData}         
          handleInputChange={handleInputChange} 
          ID="base_or_frame"
          langData={langData}
        />
        <h5>
          <div
            className="bg-primary text-white px-1 m-0 d-flex align-items-center justify-content-start"
            style={{ fontSize: ".90em", height: "20px" }}
          >
            {langData.pieceDetailDescriptors.inventory.measure_without.replace(
              /{}/g,
              formData?.base_or_frame
                ? formData.base_or_frame === "base"
                  ? langData.pieceDetailDescriptors.inventory.base
                  : langData.pieceDetailDescriptors.inventory.frame
                : "",
            )}
          </div>
        </h5>

        <div className="row mb-3">
          <div className="col">
            <Field
              formData={formData}
              handleInputChange={handleInputChange}
              ID="height"
              Label={langData.pieceDetailDescriptors.inventory.height}
            />
          </div>

          <div className="col">
            <Field
              formData={formData}
              handleInputChange={handleInputChange}
              ID="width"
              Label={langData.pieceDetailDescriptors.inventory.width}
            />
          </div>

          <div className="col">
            <Field
              formData={formData}
              handleInputChange={handleInputChange}
              ID="depth"
              Label={langData.pieceDetailDescriptors.inventory.depth}
            />
          </div>

          <div className="col">
            <Field
              formData={formData}
              handleInputChange={handleInputChange}
              ID="diameter"
              Label={langData.pieceDetailDescriptors.inventory.diameter}
            />
          </div>
        </div>

        <h5>
          <div
            className="bg-primary text-white px-1 m-0 d-flex align-items-center justify-content-start"
            style={{ fontSize: ".90em", height: "20px" }}
          >
            {langData.pieceDetailDescriptors.inventory.measure_with.replace(
              /{}/g,
              formData?.base_or_frame
                ? formData.base_or_frame === "base"
                  ? langData.pieceDetailDescriptors.inventory.base
                  : langData.pieceDetailDescriptors.inventory.frame
                : "",
            )}
          </div>
        </h5>
        <div className="row mb-3">
          <div className="col">
            <Field
              formData={formData}
              handleInputChange={handleInputChange}
              ID="height_with_base"
              Label={langData.pieceDetailDescriptors.inventory.height_with_base}
            />
          </div>

          <div className="col">
            <Field
              formData={formData}
              handleInputChange={handleInputChange}
              ID="width_with_base"
              Label={langData.pieceDetailDescriptors.inventory.width_with_base}
            />
          </div>

          <div className="col">
            <Field
              formData={formData}
              handleInputChange={handleInputChange}
              ID="depth_with_base"
              Label={langData.pieceDetailDescriptors.inventory.depth_with_base}
            />
          </div>

          <div className="col">
            <Field
              formData={formData}
              handleInputChange={handleInputChange}
              ID="diameter_with_base"
              Label={
                langData.pieceDetailDescriptors.inventory.diameter_with_base
              }
            />
          </div>
        </div>



      </div>

      {formData && formData.action === "edit" ? (
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
                        src={`${image_path}${
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
                              <p>
                                {langData.pieceInventoryEdit.uploader_img_sign}
                              </p>
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
                            changedPics[currentImgIndex]["file"],
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
                        ? URL.createObjectURL(
                            changedPics[currentImgIndex]["file"],
                          )
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
                          Pics && Pics[currentImgIndex]?.photographer
                            ? Pics[currentImgIndex].photographer
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
                          Pics && Pics[currentImgIndex]?.photographed_at
                            ? Pics[currentImgIndex].photographed_at
                            : "",
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
                          Pics && Pics[currentImgIndex]?.description
                            ? Pics[currentImgIndex].description
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
                    {currentImgIndex + 1} / {Pics?.length ? Pics.length : null}
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
      ) : null}

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
                                PicsNew[currentImgNewIndex].file,
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
                                    Arrastra aquí tu imagen o haz clic para
                                    subirla
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
                                PicsNew[currentImgNewIndex].file,
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
                              PicsNew[currentImgNewIndex]?.photographer || ""
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
                              PicsNew[currentImgNewIndex]?.photographed_at || ""
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
                              PicsNew[currentImgNewIndex]?.description || ""
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
      {formData && formData.action === "edit" ? (
        <div className="row">
          <div className="col">
            <div className="card mt-4" style={{ background: "#abcc" }}>
              <div className="card-header " style={{ background: "#99dd" }}>
                {langData.pieceInventoryEdit.documents}
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-4">
                    <div
                      className={`text-${
                        colorFile[
                          fileTypes[
                            Documents && Documents[currentDocIndex]?.mime_type
                              ? Documents[currentDocIndex].mime_type
                              : "primary"
                          ]
                        ]
                      } mt-3`}
                    >
                      {Documents && Documents[currentDocIndex]?.file_name ? (
                        <>
                          <a
                            href={
                              SETTINGS.URL_ADDRESS.server_url +
                              SETTINGS.URL_ADDRESS.inventory_documents +
                              Documents[currentDocIndex].file_name
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FontAwesomeIcon
                              icon={
                                Documents &&
                                Documents[currentDocIndex]?.mime_type
                                  ? mimeIcons[
                                      Documents[currentDocIndex].mime_type
                                    ]
                                  : faBan
                              }
                              size="3x"
                            />
                          </a>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {Documents && Documents.length > 0 && (
                    <div className="col-4">
                      <Dropzone
                        maxFiles={1}
                        accept={{
                          "application/pdf": [".pdf"],
                          "application/msword": [".doc"],
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                            [".docx"],
                          "application/vnd.ms-excel": [".xls"],
                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                            [".xlsx"],
                          "application/vnd.ms-powerpoint": [".ppt"],
                          "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                            [".pptx"],
                          "text/plain": [".txt"],
                          "application/xml": [".xml"],
                        }}
                        onDrop={(acceptedFiles) =>
                          handleChangeDocumentStatus({
                            file: acceptedFiles[0],
                          })
                        }
                      >
                        {({ getRootProps, getInputProps }) => (
                          <section className="container-fluid dashed-box">
                            <div {...getRootProps({ className: "dropzone" })}>
                              <input {...getInputProps()} />
                              <p>Arrastra o sube tus archivos aquí</p>
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    </div>
                  )}

                  <div
                    className={`col-4 text-${
                      colorFile[
                        fileTypes[
                          changedDocs &&
                          changedDocs[currentDocIndex]["file"]?.type
                            ? changedDocs[currentDocIndex]["file"].type
                            : "primary"
                        ]
                      ]
                    } mt-3`}
                  >
                    {changedDocs &&
                    changedDocs[currentDocIndex] &&
                    changedDocs[currentDocIndex]["file"] ? (
                      <div>
                        {/*console.log(
                              /changedDocs[currentDocIndex]["file"].type
                            */}
                        <FontAwesomeIcon
                          icon={
                            changedDocs &&
                            changedDocs[currentDocIndex]["file"]?.type
                              ? mimeIcons[
                                  changedDocs[currentDocIndex]["file"].type
                                ]
                              : faBan
                          }
                          size="3x"
                        />
                      </div>
                    ) : (
                      <FontAwesomeIcon icon={faBan} size="3x" />
                    )}
                  </div>
                </div>

                <div className="text-start">
                  <label className="d-block">
                    {langData.pieceInventoryEdit.name}:
                    <input
                      id="name"
                      type="text"
                      value={
                        Documents && Documents[currentDocIndex]?.name
                          ? Documents[currentDocIndex].name
                          : ""
                      }
                      onChange={handleInputDoc}
                      className="form-control mt-2"
                    />
                  </label>
                  <label className="d-block mt-2">
                    {langData.pieceInventoryEdit.size}:
                    <p className="mt-2">
                      {" "}
                      {formatSize(
                        Documents && Documents[currentDocIndex]?.size
                          ? Documents[currentDocIndex].size
                          : 0,
                      )}
                    </p>
                  </label>
                </div>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    onClick={handlePrevDoc}
                  >
                    ← {langData.pieceInventoryEdit.previous}
                  </Button>
                  <span>
                    {currentDocIndex + 1} /{" "}
                    {Documents?.length ? Documents.length : null}
                  </span>{" "}
                  {/* Paginación */}
                  <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    onClick={handleNextDoc}
                  >
                    {langData.pieceInventoryEdit.next} →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

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
              onClick={toggleExpandNewDoc}
            >
              {/* Header Content */}
              <span>{langData.pieceInventoryEdit.new_documents}</span>
              {isExpandedDoc && (
                <>
                  <IconButton
                    sx={{ color: pink[400] }}
                    aria-label="del image"
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que el clic oculte el contenido
                      deleteDocument(currentDocNewIndex);
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
                      addDocument();
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
                {isExpandedDoc ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </div>

            {/* Card Body */}
            {isExpandedDoc && (
              <div className="card-body">
                <div className="row">
                  {/* Icon Section */}
                  <div className="col-4">
                    <div
                      className={`text-${
                        colorFile[
                          fileTypes[
                            DocumentsNew[currentDocNewIndex] &&
                            DocumentsNew[currentDocNewIndex]["file"] &&
                            DocumentsNew[currentDocNewIndex]["file"].type
                              ? DocumentsNew[currentDocNewIndex]["file"].type
                              : "primary"
                          ]
                        ]
                      } mt-3`}
                    >
                      <FontAwesomeIcon
                        icon={
                          DocumentsNew[currentDocNewIndex] &&
                          DocumentsNew[currentDocNewIndex]["file"] &&
                          DocumentsNew[currentDocNewIndex]["file"].type
                            ? mimeIcons[
                                DocumentsNew[currentDocNewIndex]["file"].type
                              ]
                            : faBan
                        }
                        size="3x"
                      />
                    </div>
                  </div>

                  {/* Dropzone for Document Upload */}
                  <div className="col-4">
                    <Dropzone
                      maxFiles={1}
                      accept={{
                        "application/pdf": [".pdf"],
                        "application/msword": [".doc"],
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                          [".docx"],
                        "application/vnd.ms-excel": [".xls"],
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                          [".xlsx"],
                        "application/vnd.ms-powerpoint": [".ppt"],
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                          [".pptx"],
                        "text/plain": [".txt"],
                        "text/xml": [".xml"],
                      }}
                      onDrop={(acceptedFiles) =>
                        handleDocumentDrop(acceptedFiles)
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section className="container-fluid dashed-box">
                          <div {...getRootProps({ className: "dropzone" })}>
                            <input {...getInputProps()} />
                            <p>Arrastra o sube tus archivos aquí</p>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                </div>

                {/* Document Details */}
                <div className="text-start">
                  <label className="d-block">
                    {langData.pieceInventoryEdit.name}:
                    <input
                      id="NewDocName"
                      type="text"
                      value={DocumentsNew[currentDocNewIndex]?.name || ""}
                      className="form-control mt-2"
                      onChange={(e) => {
                        const updatedDocs = [...DocumentsNew];
                        updatedDocs[currentDocNewIndex] = {
                          ...updatedDocs[currentDocNewIndex],
                          name: e.target.value,
                        };
                        setDocumentsNew(updatedDocs);
                      }}
                    />
                  </label>
                  <label className="d-block mt-2">
                    {langData.pieceInventoryEdit.size}:
                    <p className="mt-2">
                      {formatSize(
                        DocumentsNew &&
                          DocumentsNew[currentDocNewIndex]?.file?.size
                          ? DocumentsNew[currentDocNewIndex].file.size
                          : 0,
                      )}
                    </p>
                  </label>
                </div>

                {/* Pagination Controls */}
                <div className="d-flex justify-content-between">
                  <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    onClick={handlePrevNewDoc}
                  >
                    ← {langData.pieceInventoryEdit.previous}
                  </Button>
                  <span>
                    {currentDocNewIndex + 1} /{" "}
                    {DocumentsNew?.length ? DocumentsNew.length : null}
                  </span>{" "}
                  {/* Paginación */}
                  <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    onClick={handleNextNewDoc}
                  >
                    {langData.pieceInventoryEdit.next} →
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para mostrar "sin cambios" */}

      <div
        className="modal fade"
        id="noChangesModal"
        tabIndex="-1"
        aria-labelledby="noChangesModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="noChangesModalLabel">
                Sin cambios detectados
              </h5>
              <button
                type="button"
                className="btn-close m-1"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="ChangesModal"
        tabIndex="-1"
        aria-labelledby="ChangesModalLabel"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ChangesModalLabel">
                Cambios detectados
              </h5>
              <button
                type="button"
                className="btn-close m-1"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <p>Se han detectado cambios en la información de la pieza.</p>
              <p>¿Deseas guardar los cambios?</p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={sendSave}
              >
                Guardar cambios
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ModalPictures = ({ IDmodal, picFileName = null, ObjectImg = null }) => {
  let ImageModal;

  if (ObjectImg === null) {
    ImageModal =
      SETTINGS.URL_ADDRESS.server_url +
      SETTINGS.URL_ADDRESS.inventory_full_size +
      picFileName;
  } else {
    ImageModal = ObjectImg;
  }

  return (
    <div
      className="modal fade"
      id={IDmodal}
      tabIndex="-1"
      aria-labelledby={`${IDmodal}Label`}
    >
      <div className="modal-dialog modal-lg modal-fullscreen-md-down bg-secondary">
        <div className="modal-content">
          <div className="modal-body bg-secondary">
            <button
              type="button"
              className="btn-close mt-1 me-1"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <div
              id={`carousel${IDmodal}Fade`}
              className="carousel slide carousel-fade"
            >
              <div className="carousel-inner">
                <img
                  src={ImageModal}
                  className="d-block w-100 mt-3"
                  alt="..."
                />
                <hr className="my-4" />
                {/* Otros detalles */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
