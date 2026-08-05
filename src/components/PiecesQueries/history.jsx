import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import moment from "moment";
import "moment/locale/es-mx";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import SETTINGS from "../Config/settings";
import { API_RequestInventoryHistory } from "./APICalls";

const IMAGE_THUMBNAIL_PATH =
  SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.inventory_thumbnails;
const IMAGE_FULL_PATH =
  SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.inventory_full_size;
const DOCUMENT_PATH =
  SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.inventory_documents;
const TEMP_FILE_PATH =
  SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.temporary_upload_documents;

const renderValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "N/D";
  }

  return String(value);
};

const FileMetaList = ({ items }) => {
  if (!items?.length) {
    return null;
  }

  return (
    <ul className="list-group list-group-flush">
      {items.map((item) => (
        <li key={item.label} className="list-group-item px-0">
          <strong>{item.label}:</strong> {renderValue(item.value)}
        </li>
      ))}
    </ul>
  );
};

const PieceSnapshotSection = ({ items }) => {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header bg-light">
        <strong>Estado previo de la pieza</strong>
      </div>
      <div className="card-body">
        <div className="row g-3">
          {items.map((item) => (
            <div className="col-md-6" key={item.field}>
              <div className="border rounded p-2 h-100 bg-white">
                <div className="small text-muted">{item.label}</div>
                <div style={{ whiteSpace: "pre-wrap" }}>{renderValue(item.value)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FieldChangesSection = ({ changes }) => {
  if (!changes?.length) {
    return (
      <div className="alert alert-secondary mb-3">
        No hay cambios detallados disponibles.
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header bg-light">
        <strong>Cambios en campos</strong>
      </div>
      <div className="table-responsive">
        <table className="table table-sm table-bordered align-middle bg-white mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: "25%" }}>Campo</th>
              <th style={{ width: "37.5%" }}>Valor anterior</th>
              <th style={{ width: "37.5%" }}>Valor nuevo</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((change, index) => (
              <tr key={`${change.field}-${index}`}>
                <td>
                  <strong>{change.label}</strong>
                </td>
                <td style={{ whiteSpace: "pre-wrap" }}>
                  {renderValue(change.old_value)}
                </td>
                <td style={{ whiteSpace: "pre-wrap" }}>
                  {renderValue(change.new_value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InventoryImageCard = ({ item, title, fileName, fileBasePath }) => {
  const imageUrl = fileName ? `${fileBasePath}${fileName}` : null;
  const fullImageUrl = fileName ? `${IMAGE_FULL_PATH}${fileName}` : null;

  return (
    <div className="col-lg-4 col-md-6">
      <div className="card shadow-sm h-100">
        {imageUrl ? (
          <a href={fullImageUrl || imageUrl} target="_blank" rel="noreferrer">
            <img
              src={imageUrl}
              alt={title}
              className="card-img-top"
              style={{ objectFit: "cover", height: "180px" }}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </a>
        ) : null}
        <div className="card-body">
          <h6 className="card-title">{title}</h6>
          <FileMetaList
            items={[
              { label: "Archivo", value: fileName },
              { label: "Descripción", value: item.description },
              { label: "Fotógrafo", value: item.photographer },
              { label: "Fecha", value: item.photographed_at },
              { label: "Tamaño", value: item.size },
              { label: "Tipo MIME", value: item.mime_type },
              { label: "Archivo anterior", value: item.old_file_name },
              { label: "Archivo nuevo", value: item.new_file_name },
              { label: "Tamaño anterior", value: item.old_size },
              { label: "Tamaño nuevo", value: item.new_size },
              { label: "MIME anterior", value: item.old_mime_type },
              { label: "MIME nuevo", value: item.new_mime_type },
            ].filter((meta) => meta.value)}
          />
        </div>
      </div>
    </div>
  );
};

const InventoryDocumentCard = ({ item, title, fileName, fileBasePath }) => {
  const fileUrl = fileName ? `${fileBasePath}${fileName}` : null;

  return (
    <div className="col-lg-4 col-md-6">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h6 className="card-title">{title}</h6>
          <FileMetaList
            items={[
              { label: "Archivo", value: fileName },
              { label: "Tamaño", value: item.size },
              { label: "Tipo MIME", value: item.mime_type },
              { label: "Archivo anterior", value: item.old_file_name },
              { label: "Archivo nuevo", value: item.new_file_name },
              { label: "Tamaño anterior", value: item.old_size },
              { label: "Tamaño nuevo", value: item.new_size },
              { label: "MIME anterior", value: item.old_mime_type },
              { label: "MIME nuevo", value: item.new_mime_type },
            ].filter((meta) => meta.value)}
          />
        </div>
        {fileUrl ? (
          <div className="card-footer bg-white border-0 pt-0">
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-primary btn-sm"
            >
              Ver documento
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const InfoChangeSection = ({ title, items, type }) => {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header bg-light">
        <strong>{title}</strong>
      </div>
      <div className="card-body">
        {items.map((item, index) => (
          <div
            className="border rounded p-3 mb-3 bg-white"
            key={`${item.file_name}-${index}`}
          >
            <h6 className="mb-3">{item.file_name}</h6>
            <div className="row g-3">
              {type === "image" && item.file_name ? (
                <div className="col-md-4">
                  <div className="border rounded p-2 bg-light h-100 text-center">
                    <a
                      href={`${IMAGE_FULL_PATH}${item.file_name}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={`${IMAGE_THUMBNAIL_PATH}${item.file_name}`}
                        alt={item.file_name}
                        className="img-fluid rounded"
                        style={{
                          width: "100%",
                          maxHeight: "220px",
                          objectFit: "contain",
                        }}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    </a>
                  </div>
                </div>
              ) : null}
              <div
                className={
                  type === "image" && item.file_name ? "col-md-8" : "col-12"
                }
              >
                <div className="table-responsive">
                  <table className="table table-sm table-bordered align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Campo</th>
                        <th>Valor anterior</th>
                        <th>Valor nuevo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.fields?.map((field, fieldIndex) => (
                        <tr key={`${field.field}-${fieldIndex}`}>
                          <td>{field.label}</td>
                          <td>{renderValue(field.old_value)}</td>
                          <td>{renderValue(field.new_value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MediaSection = ({ title, items, type, isPending }) => {
  if (!items?.length) {
    return null;
  }

  const fileBasePath = isPending ? TEMP_FILE_PATH : DOCUMENT_PATH;
  const imageBasePath = isPending ? TEMP_FILE_PATH : IMAGE_THUMBNAIL_PATH;

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header bg-light">
        <strong>{title}</strong>
      </div>
      <div className="card-body">
        <div className="row g-3">
          {items.map((item, index) => {
            const fileName = item.new_file_name || item.file_name;
            const itemTitle = item.title || fileName || `${title} ${index + 1}`;

            if (type === "image") {
              return (
                <InventoryImageCard
                  key={`${fileName || itemTitle}-${index}`}
                  item={item}
                  title={itemTitle}
                  fileName={fileName}
                  fileBasePath={imageBasePath}
                />
              );
            }

            return (
              <InventoryDocumentCard
                key={`${fileName || itemTitle}-${index}`}
                item={item}
                title={itemTitle}
                fileName={fileName}
                fileBasePath={fileBasePath}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const InventoryHistory = ({ accessToken, refreshToken }) => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      setLoading(true);
      setErrorMsg("");

      const response = await API_RequestInventoryHistory({
        accessToken,
        refreshToken,
        pieceId: _id,
      });

      if (!isMounted) {
        return;
      }

      setLoading(false);

      if (!response || response?.error) {
        setErrorMsg(response?.error || "No fue posible obtener el historial.");
        setHistory([]);
        return;
      }

      setHistory(response?.history || []);
    };

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [_id, accessToken, refreshToken]);

  return (
    <div className="container-fluid py-3">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h3 className="mb-1">Historial de inventario</h3>
          <div className="text-muted">Pieza: {_id}</div>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            Regresar
          </button>
          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(`/mnemosine/inventory_queries/actions/${_id}/edit`)
            }
          >
            Ir a edición
          </button>
        </div>
      </div>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : null}

      {!loading && errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}

      {!loading && !errorMsg && history.length === 0 ? (
        <Alert severity="info">No existe historial para esta pieza</Alert>
      ) : null}

      {!loading && !errorMsg && history.length > 0 ? (
        <div style={{ maxHeight: "calc(100vh - 180px)", overflowY: "auto", paddingRight: "4px" }}>
          {history.map((entry, index) => {
            const isPending = entry.status === "Pendiente";

            return (
              <Accordion
                key={entry.id || `${_id}-${index}`}
                sx={{ backgroundColor: "#f7f7f7", mb: 2 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ width: "100%" }}>
                    <Typography sx={{ fontWeight: 600 }}>
                      #{history.length - index} - {entry.action_type} - {entry.status}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {entry.created_at
                        ? moment(entry.created_at).locale("es-mx").format("DD [de] MMMM [de] YYYY, HH:mm")
                        : "Fecha no disponible"}
                      {" · "}
                      {entry.created_by?.username || "Usuario no disponible"}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="card shadow-sm mb-3">
                    <div className="card-body bg-white">
                      <div className="row g-3">
                        <div className="col-md-4">
                          <strong>Solicitado por:</strong>
                          <div>
                            {entry.created_by?.username || "N/D"}
                            {entry.created_by?.email
                              ? ` «${entry.created_by.email}»`
                              : ""}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <strong>Autorizado por:</strong>
                          <div>
                            {entry.approved_rejected_by?.username || "N/D"}
                            {entry.approved_rejected_by?.email
                              ? ` «${entry.approved_rejected_by.email}»`
                              : ""}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <strong>Fecha de actualización:</strong>
                          <div>
                            {entry.updated_at
                              ? moment(entry.updated_at)
                                  .locale("es-mx")
                                  .format("DD [de] MMMM [de] YYYY, HH:mm")
                              : "N/D"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <FieldChangesSection changes={entry.changes} />
                  <PieceSnapshotSection items={entry.piece_before_changes} />
                  <MediaSection
                    title="Fotografías nuevas"
                    items={entry.media_changes?.new_pics}
                    type="image"
                    isPending={isPending}
                  />
                  <MediaSection
                    title="Fotografías reemplazadas"
                    items={entry.media_changes?.changed_pics}
                    type="image"
                    isPending={isPending}
                  />
                  <InfoChangeSection
                    title="Cambios en información de fotografías"
                    items={entry.media_changes?.changed_pics_info}
                    type="image"
                  />
                  <MediaSection
                    title="Documentos nuevos"
                    items={entry.media_changes?.new_docs}
                    type="document"
                    isPending={isPending}
                  />
                  <MediaSection
                    title="Documentos reemplazados"
                    items={entry.media_changes?.changed_docs}
                    type="document"
                    isPending={isPending}
                  />
                  <InfoChangeSection
                    title="Cambios en información de documentos"
                    items={entry.media_changes?.changed_docs_info}
                    type="document"
                  />
                </AccordionDetails>
              </Accordion>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
