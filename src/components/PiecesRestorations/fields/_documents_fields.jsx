import { getTranslations } from "../../Languages/i18n";
//import { SETTINGS } from "../../settings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SETTINGS from "../../Config/settings";
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


const langData = getTranslations();
export const DocumentsField = ({Documents, setDocuments, actualDocs    }) => {



    const [currentDocIndex, setCurrentDocIndex] = useState(0);

  
  const handleChangeDocumentStatus = ({ file }) => {
    const copyFile = new File([file], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    });

    setDocuments((prevDocs) =>
      prevDocs.map((doc, index) =>
        index === currentDocIndex
          ? {
              ...doc,
              _id: doc._id, // o Documents[currentDocIndex]._id si lo necesitas fijo
              file: copyFile,
              name: file.name.split(".").slice(0, -1).join("."),
              size: file.size,
              mime_type: file.type,
            }
          : doc
      )
    );
  };

  const handlePrevDoc = () => {
    setCurrentDocIndex((prevIndex) =>
      prevIndex === 0 ? Documents.length - 1 : prevIndex - 1
    );
  };
  const handleNextDoc = () => {
    setCurrentDocIndex((prevIndex) =>
      prevIndex === Documents.length - 1 ? 0 : prevIndex + 1
    );
  };

    const handleInputDoc = (e) => {
    const { id, value } = e.target;
    //console.log("e.target",value, " id", id);
    setDocuments((prevData) => {
      //console.log("prevData", prevData);
      return prevData.map((doc, index) => {
        /*console.log("return", index === currentDocIndex
            ? { ...doc, [id]: value } 
            : doc );*/
        return index === currentDocIndex
          ? { ...doc, [id]: value } // Crea una copia del objeto actual con el campo actualizado
          : doc; // Retorna el objeto sin cambios si el índice no coincide
      });
    });
  };



    return(
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
                                        Documents &&
                                        Documents[currentDocIndex]?.mime_type
                                          ? Documents[currentDocIndex].mime_type
                                          : "primary"
                                      ]
                                    ]
                                  } mt-3`}
                                >
                                  {Documents &&
                                  Documents[currentDocIndex]?.file_name ? (
                                    <>
                                      <a
                                        href={
                                          SETTINGS.URL_ADDRESS.server_url +
                                          SETTINGS.URL_ADDRESS.restoration_documents +
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
                              )}
        
                              <div
                                className={`col-4 text-${
                                  colorFile[
                                    fileTypes[
                                      actualDocs?.[currentDocIndex]?.file?.type ||
                                        "primary"
                                    ]
                                  ]
                                } mt-3`}
                              >
                                {Documents &&
                                Documents[currentDocIndex] &&
                                Documents[currentDocIndex]["file"] ? (
                                  <div>
                                    <FontAwesomeIcon
                                      icon={
                                        Documents &&
                                        Documents[currentDocIndex]["file"]?.type
                                          ? mimeIcons[
                                              Documents[currentDocIndex]["file"].type
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
                                  onChange={(e) => {
                                    handleInputDoc(e);
                                  }}
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
                                      : 0
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
    )

}