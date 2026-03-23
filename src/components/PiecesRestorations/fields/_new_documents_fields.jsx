import { getTranslations } from "../../Languages/i18n";
//import { SETTINGS } from "../../settings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import SETTINGS from "../../Config/settings";
import { useState } from "react";
import {  faBan } from "@fortawesome/free-solid-svg-icons";
import Dropzone from "react-dropzone";
import { Button } from "@mui/material";
//import { formatSize } from "../../LocalTools/tools";

import {
  formatSize,
  fileTypes,
  mimeIcons,
  colorFile,
} from "../../LocalTools/tools";



import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { pink } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";




const langData = getTranslations();
export const NewDocumentsField = ({DocumentsNew, setDocumentsNew}) => {
const [currentDocNewIndex, setCurrentDocNewIndex] = useState(0);
const [isExpandedDoc, setIsExpandedDoc] = useState(true);


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

  const deleteDocument = (index) => {
    setDocumentsNew(DocumentsNew.filter((_, i) => i !== index));
    setCurrentDocNewIndex(0); // Actualiza el índice al primer elemento
  };

  const toggleExpandNewDoc = () => {
    setIsExpandedDoc(!isExpandedDoc);
  };
  

    const addDocument = () => {
    const newDocument = { name: "", file: null };
    setDocumentsNew([...DocumentsNew, newDocument]);
    setCurrentDocNewIndex(DocumentsNew.length); // Actualiza el índice al último elemento nuevo
  };


    const handleDocumentDrop = (acceptedFiles) => {
    const updatedDocs = [...DocumentsNew];
    updatedDocs[currentDocNewIndex] = {
      ...updatedDocs[currentDocNewIndex],
      file: acceptedFiles[0],
      name: acceptedFiles[0].name.split(".").slice(0, -1).join("."),
      size: acceptedFiles[0].size,
      mime_type: acceptedFiles[0].type,
    };
    setDocumentsNew(updatedDocs);
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
                                    ? DocumentsNew[currentDocNewIndex]["file"]
                                        .type
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
                                      DocumentsNew[currentDocNewIndex]["file"]
                                        .type
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
                                <div
                                  {...getRootProps({ className: "dropzone" })}
                                >
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
                                : 0
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
         


    )

}