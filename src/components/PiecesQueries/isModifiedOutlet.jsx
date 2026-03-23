import React from "react";
import { getTranslations } from "../Languages/i18n";
import SETTINGS from "../Config/settings";
import {
  formatSize,
  fileTypes,
  mimeIcons,
  colorFile,
} from "../LocalTools/tools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { API_SendApprovralDecision } from "./APICalls";
import "./ismodified.css";

const image_path_uploads =
  SETTINGS.URL_ADDRESS.server_url +
  SETTINGS.URL_ADDRESS.temporary_upload_documents;

const image_path =
  SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.inventory_full_size;

const docs_path =
  SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.inventory_documents;

const langData = getTranslations();

const ModifiedOutlet = ({ Data, accessToken, refreshToken, setIsModified }) => {
  const [newImgSizes, setNewImgSizes] = useState({});
  const [oldImgSizes, setOldImgSizes] = useState({});
  const [changedImgSizes, setChangedImgSizes] = useState({});

  const handleNewImgSizeClick = (index) => {
    setNewImgSizes((prevSizes) => {
      const newSizes = { ...prevSizes };
      if (newSizes[index]) {
        delete newSizes[index];
      } else {
        newSizes[index] = true;
      }
      return newSizes;
    });
  };

  const handleOldImgSizeClick = (index) => {
    setOldImgSizes((prevSizes) => {
      const newSizes = { ...prevSizes };
      if (newSizes[index]) {
        delete newSizes[index];
      } else {
        newSizes[index] = true;
      }
      return newSizes;
    });
  };

  const handleChangedImgSizeClick = (index) => {
    setChangedImgSizes((prevSizes) => {
      const newSizes = { ...prevSizes };
      if (newSizes[index]) {
        delete newSizes[index];
      } else {
        newSizes[index] = true;
      }
      return newSizes;
    });
  };

  const handleApprovalDecision = (isApproved) => {
    const ID = Data.piece_id;
    var data;
    if (ID !== undefined) {
      API_SendApprovralDecision({
        accessToken,
        refreshToken,
        ID,
        isApproved,
      }).then((response) => {
        if (response.ok) {
          setIsModified(false);
        }
      });
      //console.log(data);
    }
  };
const visibleFieldChanges = Object.entries(Data || {}).filter(([key]) => {
    return ![
      "piece_id",
      "changes",
      "fields_changes",
      "new_pics",
      "new_docs",
      "changed_pics",
      "changed_pics_info",
      "changed_docs",
      "changed_docs_info",
      "changed_by_module_id",
      "action",
    ].includes(key);
  });
  return (
    <>
      <div className="container">        
        {console.log("visibleFieldChanges",visibleFieldChanges)}
        {visibleFieldChanges.length > 0 && (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>{langData.pieceInventoryEdit.field}</th>
              <th>{langData.pieceInventoryEdit.oldValue}</th>
              <th>{langData.pieceInventoryEdit.newValue}</th>
            </tr>
          </thead>
          <tbody>
            {visibleFieldChanges.map(([key, value]) => {
              const name_descriptor =
                langData.pieceDetailDescriptors.inventory[key];
              const exceptions = [
                "gender_id",
                "subgender_id",
                "type_object_id",
                "dominant_material_id"
              ];

              return exceptions.includes(key) ? (
                <tr key={key}>
                  <td>{name_descriptor}</td>
                  <td>{value?.oldValue?.title || "No disponible"}</td>
                  <td>{value?.newValue?.title || "No disponible"}</td>
                </tr>
              ) : (
                <tr key={key}>
                  <td>{name_descriptor}</td>
                  <td>{value?.oldValue || "No disponible"}</td>
                  <td>{value?.newValue || "No disponible"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

        {(Data?.changed_pics?.length > 0 || Data?.changed_pics_info) && (
          <div className="card bg-custom-gray mb-3 mt-3 p-1">
            <div className="card-body ">
              <h4 className="text-white text-center mb-3">
                Imágenes Modificadas
              </h4>

              {(Data?.changed_pics || Data?.changed_pics_info) &&
                (Data.changed_pics || Data.changed_pics_info).map(
                  (pic, index) => {
                    const isChanged = !!Data.changed_pics; // Verifica si hay cambios
                    const oldFileName = isChanged
                      ? pic.old_file_name
                      : pic.file_name;
                    const newFileName = isChanged ? pic.new_file_name : null;
                    const oldSize = isChanged ? pic.old_size : "";
                    const oldMimeType = isChanged ? pic.old_mime_type : "";

                    return (
                      <div
                        key={index}
                        className="border rounded p-3 mb-4 bg-dark text-white"
                      >
                        <div className="row justify-content-center align-items-center text-center">
                          {/* Imagen actual */}
                          <div className="col-md-5">
                            <h6 className="text-warning">Foto Actual</h6>
                            <div className="bg-warning rounded border p-1 d-inline-block">
                              <img
                                onClick={() => handleOldImgSizeClick(index)}
                                className="rounded border"
                                src={image_path + oldFileName}
                                style={{
                                  width: oldImgSizes[index] ? "100%" : "120px",
                                }}
                                alt={oldFileName}
                              />
                            </div>
                            {isChanged && (
                              <p className="mt-2 small">
                                Tamaño: {formatSize(oldSize)} | Tipo:{" "}
                                {fileTypes[oldMimeType]}
                              </p>
                            )}
                          </div>

                          {/* Nueva imagen si existe */}
                          {newFileName && (
                            <div className="col-md-5">
                              <h6 className="text-warning">Nueva Foto</h6>
                              <div className="bg-warning rounded border p-1 d-inline-block">
                                <img
                                  onClick={() =>
                                    handleChangedImgSizeClick(index)
                                  }
                                  className="rounded border"
                                  src={image_path_uploads + newFileName}
                                  style={{
                                    width: changedImgSizes[index]
                                      ? "100%"
                                      : "120px",
                                  }}
                                  alt={newFileName}
                                />
                              </div>
                              <p className="mt-2 small">
                                Tamaño: {formatSize(pic.new_size)} | Tipo:{" "}
                                {fileTypes[pic.new_mime_type]}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}

              {/* Mapeo de changed_pics_info */}
              {Data.changed_pics_info && (
                <div className="mt-3 p-3 border-top">
                  <h6 className="text-info">Detalles del Cambio</h6>
                  <div className="table-responsive">
                    <table className="table table-bordered table-dark text-white">
                      <thead>
                        <tr>
                          <th>Campo</th>
                          <th>Valor Anterior</th>
                          <th>Nuevo Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(Data.changed_pics_info).map(
                          (info, idx) =>
                            Object.entries(info).map(([field, values]) => {
                              if (field !== "file_name") {
                                return (
                                  <tr key={idx + field}>
                                    <td className="text-warning">{field}</td>
                                    <td>{values.oldValue ?? "N/A"}</td>
                                    <td>{values.newValue}</td>
                                  </tr>
                                );
                              } else {
                                return null;
                              }
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {Data.new_pics && (
          <div className={"card bg-custom-gray"}>
            <div className={"card-body"}>
              <h4 className="text-white">Imágenes nuevas</h4>
              {Object.entries(Data || {}).map(([key, value]) => {
                if (key === "new_pics" && Array.isArray(value)) {
                  return (
                    <div key={key}>
                      {value.map((pic, index) => (
                        <div key={index} className="mb-3">
                          <div
                            onClick={() => handleNewImgSizeClick(index)}
                            className="d-inline-block bg-warning rounded border p-1 me-1"
                          >
                            <img
                              className={"rounded border"}
                              src={image_path_uploads + pic.file_name}
                              style={{
                                width: newImgSizes[index] ? "100%" : "100px",
                              }}
                              alt={pic.file_name}
                            />
                          </div>
                          <div className="mt-2 text-white">
                            <strong>Fotógrafo:</strong>{" "}
                            {pic.photographer || "No disponible"}
                            <br />
                            <strong>Fecha de fotografía:</strong>{" "}
                            {pic.photographed_at || "No disponible"}
                            <br />
                            <strong>Descripción:</strong>{" "}
                            {pic.description || "No disponible"}
                            <br />
                            <strong>Tamaño:</strong>{" "}
                            {formatSize(pic.size) || "No disponible"}
                            <br />
                            <strong>Tipo de archivo:</strong>{" "}
                            {fileTypes[pic.mime_type] || "No disponible"}
                            <br />
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </div>
        )}

        {(Data?.changed_docs?.length > 0 || Data?.changed_docs_info) && (
          <div className="card bg-custom-gray mb-3 mt-3 p-1">
            <div className="card-body ">
              <h4 className="text-white text-center mb-3">
                Documentos Modificados
              </h4>

              {(Data?.changed_docs || Data?.changed_docs_info) &&
                (Data.changed_docs || Data.changed_docs_info).map(
                  (doc, index) => {
                    const isChanged = !!Data.changed_docs; // Verifica si hay cambios
                    const oldFileName = isChanged
                      ? doc.old_file_name
                      : doc.file_name;
                    const newFileName = isChanged ? doc.new_file_name : null;
                    const oldSize = isChanged ? doc.old_size : "";
                    const oldMimeType = isChanged ? doc.old_mime_type : "";
                    const newSize = isChanged ? doc.new_size : "";
                    const newMimeType = isChanged ? doc.new_mime_type : "";

                    return (
                      <div
                        key={index}
                        className="border rounded p-3 mb-4 bg-dark text-white"
                      >
                        <div className="row justify-content-center align-items-center text-center">
                          {/* Documento actual */}
                          <div className="col-md-5">
                            <h6 className="text-warning">Documento Actual</h6>
                            <div className="bg-warning rounded border p-1 d-inline-block">
                              <a
                                className="rounded border"
                                href={docs_path + oldFileName}
                              >
                                <FontAwesomeIcon
                                  icon={mimeIcons[oldMimeType]}
                                />
                              </a>
                            </div>
                            {isChanged && (
                              <p className="mt-2 small">
                                Tamaño: {formatSize(oldSize)} | Tipo:{" "}
                                {fileTypes[oldMimeType]}
                              </p>
                            )}
                          </div>

                          {/* Nuevo documento si existe */}
                          {newFileName && (
                            <div className="col-md-5">
                              <h6 className="text-warning">Nuevo Documento</h6>
                              <div className="bg-warning rounded border p-1 d-inline-block">
                                <a
                                  className="rounded border"
                                  href={image_path_uploads + newFileName}
                                >
                                  <FontAwesomeIcon
                                    icon={mimeIcons[newMimeType]}
                                  />
                                </a>
                              </div>
                              <p className="mt-2 small">
                                Tamaño: {formatSize(newSize)} | Tipo:{" "}
                                {fileTypes[newMimeType]}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Mapeo de changed_docs_info */}
                        {Data.changed_docs_info && (
                          <div className="mt-3 p-3 border-top">
                            <h6 className="text-info">Detalles del Cambio</h6>
                            <div className="table-responsive">
                              <table className="table table-bordered table-dark text-white">
                                <thead>
                                  <tr>
                                    <th>Campo</th>
                                    <th>Valor Anterior</th>
                                    <th>Nuevo Valor</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Object.values(Data.changed_docs_info).map(
                                    (info, idx) =>
                                      Object.entries(info).map(
                                        ([field, values]) => {
                                          if (field !== "file_name") {
                                            return (
                                              <tr key={idx}>
                                                <td>{field}</td>
                                                <td>{values.oldValue}</td>
                                                <td>{values.newValue}</td>
                                              </tr>
                                            );
                                          } else {
                                            return null;
                                          }
                                        }
                                      )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
            </div>
          </div>
        )}
        {Data.new_docs && (
          <div className={"card bg-custom-gray mt-3"}>
            <div className={"card-body"}>
              <h4>Documentos nuevos</h4>
              {Object.entries(Data || {}).map(([key, value]) => {
                if (key === "new_docs" && Array.isArray(value)) {
                  return (
                    <div key={key}>
                      {value.map((doc, index) => (
                        <div
                          key={index}
                          className="mb-3 d-flex justify-content-center"
                        >
                          <div className="doc-card p-3 text-center">
                            <div
                              className={`icon-container text-${
                                colorFile[fileTypes[doc.mime_type]]
                              }`}
                            >
                              <a
                                href={image_path_uploads + doc.file_name}
                                download={`${doc.title}.${doc.file_name
                                  .split(".")
                                  .pop()}`}
                                target="_blank"
                                rel="noreferrer"
                                className="icon-link"
                              >
                                <FontAwesomeIcon
                                  icon={mimeIcons[doc.mime_type] || faBan}
                                  size="3x"
                                />
                              </a>
                            </div>
                            <div className="doc-info mt-2">
                              <p className="doc-title">
                                {doc.title || "No disponible"}
                              </p>
                              <p className="doc-type">
                                {fileTypes[doc.mime_type] || "No disponible"}
                              </p>
                              <p className="doc-size">
                                {formatSize(doc.size) ||
                                  doc.size ||
                                  "No disponible"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </div>
        )}

        <button
          className="btn btn-primary btn-sm me-3"
          onClick={() => handleApprovalDecision(true)}
        >
          Aprobar cambios
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => handleApprovalDecision(false)}
        >
          Descartar cambios
        </button>
      </div>
    </>
  );
};

export default ModifiedOutlet;
