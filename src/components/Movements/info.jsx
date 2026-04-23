import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import "moment/locale/es-mx";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  API_AuthorizeMovement,
  API_RejectMovement,
  API_RequestMovementInfo,
  API_UpdateMovementProrogation,
} from "./APICalls";
import SETTINGS from "../Config/settings";

moment.locale("es-mx");

const formatDate = (value) => (value ? moment(value).format("LL") : "N/A");

const getMovementTypeLabel = (value) => {
  switch (value) {
    case "external":
      return "Externo";
    case "restoration":
      return "Restauración externa";
    default:
      return "Interno";
  }
};

const getContactLabel = (contact) =>
  [contact?.name, contact?.last_name].filter(Boolean).join(" ").trim() || "N/A";

const joinUrl = (base, path) => {
  const normalizedBase = `${base || ""}`.replace(/\/+$/, "");
  const normalizedPath = `${path || ""}`.replace(/^\/+/, "");
  return normalizedPath ? `${normalizedBase}/${normalizedPath}` : normalizedBase;
};

const getPiecePhotos = (piece) => {
  if (Array.isArray(piece?.photography) && piece.photography.length > 0) {
    return piece.photography;
  }

 /* if (Array.isArray(piece?.photos) && piece.photos.length > 0) {
    return piece.photos;
  }*/
/*
  if (Array.isArray(piece?.photo_info) && piece.photo_info.length > 0) {
    return piece.photo_info;
  }
*/
  return [];
};

const getPieceImageUrls = (piece) => {
  const photograph = getPiecePhotos(piece)[0];

  if (!photograph?.file_name) {
    return {
      thumbnailUrl: null,
      fullSizeUrl: null,
    };
  }

  return {
    thumbnailUrl: joinUrl(
      SETTINGS.URL_ADDRESS.server_url,
      `${SETTINGS.URL_ADDRESS.inventory_thumbnails}${photograph.file_name}`,
    ),
    fullSizeUrl: joinUrl(
      SETTINGS.URL_ADDRESS.server_url,
      `${SETTINGS.URL_ADDRESS.inventory_full_size}${photograph.file_name}`,
    ),
  };
};

const attachPhotosToPieces = (pieces, photos = []) => {
  const photosByPieceId = (Array.isArray(photos) ? photos : []).reduce(
    (accumulator, photo) => {
      const pieceId = String(photo?.piece_id || "");

      if (!pieceId) {
        return accumulator;
      }

      if (!accumulator[pieceId]) {
        accumulator[pieceId] = [];
      }

      accumulator[pieceId].push(photo);
      return accumulator;
    },
    {},
  );

  return (Array.isArray(pieces) ? pieces : []).map((piece) => {
    const pieceId = String(piece?._id ?? piece?.id ?? "");
    const existingPhotos = getPiecePhotos(piece);

    if (existingPhotos.length > 0 || !photosByPieceId[pieceId]) {
      return piece;
    }

    return {
      ...piece,
      photography: photosByPieceId[pieceId],
    };
  });
};

const SummaryItem = ({ label, value }) => (
  <div className="col-12 col-md-6 mb-3">
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1">{value || "N/A"}</Typography>
  </div>
);

const PieceTable = ({ title, pieces }) => (
  <Paper sx={{ p: 0, mb: 2, overflow: "hidden" }}>
    <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
      <Typography variant="h6">
        {title} ({pieces.length})
      </Typography>
    </Box>
    <div className="table-responsive">
      <table className="table table-striped m-0">
        <thead>
          <tr>
            <th>No. inventario</th>
            <th>No. catálogo</th>
            <th>No. procedencia</th>
            <th>Descripción de origen</th>
            <th>Ubicación</th>
            <th>Foto de inventario</th>
          </tr>
        </thead>
        <tbody>
          {pieces.length > 0 ? (
            pieces.map((piece) => {
              const { thumbnailUrl, fullSizeUrl } = getPieceImageUrls(piece);

              return (
                <tr key={String(piece?._id ?? piece?.id)}>
                  <td>{piece?.inventory_number || "N/A"}</td>
                  <td>{piece?.catalog_number || "N/A"}</td>
                  <td>{piece?.origin_number || "N/A"}</td>
                  <td>{piece?.description_origin || "N/A"}</td>
                  <td>{piece?.location_info?.name || "En préstamo"}</td>
                  <td>
                    {thumbnailUrl ? (
                      <a
                        href={fullSizeUrl || thumbnailUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={thumbnailUrl}
                          alt={piece?.catalog_number || "Foto de inventario"}
                          style={{ width: 72, height: 72, objectFit: "cover" }}
                        />
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">
                <Typography variant="body2" sx={{ py: 2 }}>
                  No hay piezas para mostrar.
                </Typography>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </Paper>
);

const ProrogationDialog = ({
  open,
  prorogation,
  formValues,
  onClose,
  onChange,
  onSave,
  saving,
}) => (
  <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
    <DialogTitle>Actualizar prórroga</DialogTitle>
    <DialogContent>
      <Box sx={{ display: "grid", gap: 2, pt: 1 }}>
        <TextField
          label="Fecha de devolución"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formValues.new_arrival_date || ""}
          onChange={(event) => onChange("new_arrival_date", event.target.value)}
        />
        <TextField
          label="Fecha inicio exhibición"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formValues.new_start_exhibition_date || ""}
          onChange={(event) =>
            onChange("new_start_exhibition_date", event.target.value)
          }
        />
        <TextField
          label="Fecha fin exhibición"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formValues.new_end_exhibition_date || ""}
          onChange={(event) => onChange("new_end_exhibition_date", event.target.value)}
        />
        <Typography variant="body2" color="text.secondary">
          Prórroga {prorogation?.id}
        </Typography>
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={saving}>
        Cancelar
      </Button>
      <Button onClick={onSave} disabled={saving} variant="contained">
        {saving ? "Guardando..." : "Guardar"}
      </Button>
    </DialogActions>
  </Dialog>
);

export const InfoMovement = ({ accessToken, refreshToken }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [preauthorizeChecked, setPreauthorizeChecked] = useState(false);
  const [movementInfo, setMovementInfo] = useState(null);
  const [editingProrogation, setEditingProrogation] = useState(null);
  const [prorogationForm, setProrogationForm] = useState({
    new_arrival_date: "",
    new_start_exhibition_date: "",
    new_end_exhibition_date: "",
  });

  const loadMovementInfo = async () => {
    const data = await API_RequestMovementInfo({
      accessToken,
      refreshToken,
      movementId: id,
    });

    if (!data || data?.error) {
      throw new Error(data?.error || "No fue posible cargar la información del movimiento.");
    }

    setMovementInfo(data);
    setErrorMsg("");
  };

  useEffect(() => {
    let active = true;

    loadMovementInfo()
      .then(() => {
        if (!active) return;
      })
      .catch((error) => {
        console.error("Error al cargar la información del movimiento", error);
        if (!active) return;
        setErrorMsg(
          error?.message || "No fue posible cargar la información del movimiento.",
        );
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, id]);

  const movement = movementInfo?.movement;
  const pieces = useMemo(
    () => attachPhotosToPieces(movementInfo?.pieces || [], movementInfo?.photos || []),
    [movementInfo],
  );
  const returnedPieces = useMemo(
    () =>
      attachPhotosToPieces(
        movementInfo?.returned_pieces || [],
        movementInfo?.returned_photos || [],
      ),
    [movementInfo],
  );
  const prorogations = useMemo(
    () =>
      (movementInfo?.prorogations || []).map((prorogation) => ({
        ...prorogation,
        pieces: attachPhotosToPieces(
          prorogation?.pieces || [],
          prorogation?.photos || [],
        ),
      })),
    [movementInfo],
  );
  const isAuthorized = Boolean(movement?.authorized_by_movements);

  const summaryValues = useMemo(
    () => ({
      institutions: (movement?.institutions || []).map((item) => item?.name).join(", "),
      contacts: (movement?.contacts || []).map(getContactLabel).join(", "),
      guardContacts: (movement?.guard_contacts || []).map(getContactLabel).join(", "),
      venues: (movement?.venues || []).map((item) => item?.name).join(", "),
    }),
    [movement],
  );

  const handleAuthorize = async () => {
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const result = await API_AuthorizeMovement({
      accessToken,
      refreshToken,
      movementId: id,
    });

    setSubmitting(false);

    if (!result || result?.error) {
      setErrorMsg(result?.error || "No fue posible autorizar el movimiento.");
      return;
    }

    setSuccessMsg("El movimiento fue autorizado correctamente.");
    navigate("/mnemosine/movements/manage");
    //await loadMovementInfo();
  };

  const handleReject = async () => {
    const confirmed = window.confirm(
      `¿Realmente desea rechazar el movimiento ${id}?`,
    );
    if (!confirmed) {
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const result = await API_RejectMovement({
      accessToken,
      refreshToken,
      movementId: id,
    });

    setSubmitting(false);

    if (!result || result?.error) {
      setErrorMsg(result?.error || "No fue posible rechazar el movimiento.");
      return;
    }

    navigate("/mnemosine/movements/manage");
  };

  const openProrogationDialog = (prorogation) => {
    setEditingProrogation(prorogation);
    setProrogationForm({
      new_arrival_date: prorogation?.new_arrival_date || "",
      new_start_exhibition_date: prorogation?.new_start_exhibition_date || "",
      new_end_exhibition_date: prorogation?.new_end_exhibition_date || "",
    });
  };

  const handleSaveProrogation = async () => {
    if (!editingProrogation) {
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const result = await API_UpdateMovementProrogation({
      accessToken,
      refreshToken,
      prorogationId: editingProrogation.id,
      payload: prorogationForm,
    });

    setSubmitting(false);

    if (!result || result?.error) {
      setErrorMsg(result?.error || "No fue posible actualizar la prórroga.");
      return;
    }

    setMovementInfo((previous) => ({
      ...previous,
      prorogations: (previous?.prorogations || []).map((item) =>
        item.id === editingProrogation.id ? result.prorogation : item,
      ),
    }));
    setSuccessMsg("La prórroga se actualizó correctamente.");
    setEditingProrogation(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!movement) {
    return (
      <div className="container mt-3 mb-5">
        <Alert severity="warning">{errorMsg || "Movimiento no disponible."}</Alert>
      </div>
    );
  }

  return (
    <div className="container mt-3 mb-5">
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Paso 3 - Información del movimiento
        </Typography>
        <Typography variant="body2">
          Revisa la información consolidada del movimiento {id} antes de autorizarlo.
        </Typography>
        {errorMsg ? <Alert severity="warning" sx={{ mt: 2 }}>{errorMsg}</Alert> : null}
        {successMsg ? <Alert severity="success" sx={{ mt: 2 }}>{successMsg}</Alert> : null}
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Información general
        </Typography>
        <div className="row">
          <SummaryItem
            label="Tipo de movimiento"
            value={getMovementTypeLabel(movement?.movement_type)}
          />
          <SummaryItem
            label="Itinerante"
            value={movement?.movement_type === "external" ? (movement?.itinerant ? "Sí" : "No") : "N/A"}
          />
          <SummaryItem label="Institución(es)" value={summaryValues.institutions} />
          <SummaryItem label="Contacto(s)" value={summaryValues.contacts} />
          <SummaryItem
            label="Contactos de resguardo"
            value={summaryValues.guardContacts}
          />
          <SummaryItem
            label="Ubicación / Exposición"
            value={movement?.exhibition?.name || "N/A"}
          />
          <SummaryItem label="Sede(s)" value={summaryValues.venues} />
          <SummaryItem
            label="Fecha de salida"
            value={formatDate(movement?.departure_date)}
          />
          {movement?.movement_type !== "restoration" ? (
            <SummaryItem
              label="Fechas de exhibición"
              value={`${formatDate(movement?.start_exposure)} al ${formatDate(
                movement?.end_exposure,
              )}`}
            />
          ) : null}
          <SummaryItem label="Observaciones" value={movement?.observations || "N/A"} />
          <SummaryItem
            label="Autorizado por"
            value={movement?.authorized_by_name || "N/A"}
          />
        </div>
      </Paper>

      <PieceTable title="Piezas cargadas" pieces={pieces} />

      {returnedPieces.length > 0 ? (
        <PieceTable title="Piezas regresadas" pieces={returnedPieces} />
      ) : null}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Prórrogas registradas
        </Typography>
        {prorogations.length > 0 ? (
          prorogations.map((prorogation) => (
            <Paper
              key={prorogation.id}
              variant="outlined"
              sx={{ p: 2, mb: 2, borderColor: "success.main" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1">
                  Fecha de devolución: {formatDate(prorogation.new_arrival_date)}
                </Typography>
                <Button onClick={() => openProrogationDialog(prorogation)}>
                  Editar prórroga
                </Button>
              </Box>
              <div className="row">
                <SummaryItem
                  label="Fecha inicio de exhibición"
                  value={formatDate(prorogation.new_start_exhibition_date)}
                />
                <SummaryItem
                  label="Fecha final de exhibición"
                  value={formatDate(prorogation.new_end_exhibition_date)}
                />
              </div>
              <PieceTable title="Piezas de la prórroga" pieces={prorogation.pieces || []} />
            </Paper>
          ))
        ) : (
          <Typography variant="body2">Ninguna</Typography>
        )}
      </Paper>

      {!isAuthorized ? (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Antes de autorizar este movimiento verifique que toda la información
            registrada es correcta.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Checkbox
              checked={preauthorizeChecked}
              onChange={(event) => setPreauthorizeChecked(event.target.checked)}
            />
            <Typography variant="body2">
              Confirmo que la información es correcta y deseo autorizar el movimiento {id}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              color="success"
              disabled={!preauthorizeChecked || submitting}
              onClick={handleAuthorize}
            >
              {submitting ? "Autorizando..." : "Autorizar movimiento"}
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={submitting}
              onClick={handleReject}
            >
              Rechazar movimiento
            </Button>
          </Box>
        </Paper>
      ) : (
        <Alert severity="warning" sx={{ mb: 2 }}>
          El movimiento ha sido autorizado.
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {!isAuthorized ? (
          <>
            <Button
              variant="outlined"
              onClick={() => navigate(`/mnemosine/movements/manage/edit/${id}`)}
            >
              Volver a Paso 1
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/mnemosine/movements/manage/select-pieces/${id}`)}
            >
              Volver a Paso 2
            </Button>
          </>
        ) : null}
        <Button variant="contained" onClick={() => navigate("/mnemosine/movements/manage")}>
          Volver al listado
        </Button>
      </Box>

      <ProrogationDialog
        open={Boolean(editingProrogation)}
        prorogation={editingProrogation}
        formValues={prorogationForm}
        onClose={() => setEditingProrogation(null)}
        onChange={(field, value) =>
          setProrogationForm((previous) => ({ ...previous, [field]: value }))
        }
        onSave={handleSaveProrogation}
        saving={submitting}
      />
    </div>
  );
};
