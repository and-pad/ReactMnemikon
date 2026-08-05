import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import moment from "moment";
import "moment/locale/es-mx";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { BaseDatatable } from "../Datatables/datatableStructurer";
import { loadRawDatatableData } from "../Datatables/datatableDataCache";
import {
  API_RequestMovementReturnPieces,
  API_SaveMovementReturnPieces,
} from "./APICalls";

moment.locale("es-mx");

const formatDate = (value) => (value ? moment(value).format("LL") : "N/A");

const getPieceRowId = (row) => {
  if (Array.isArray(row?._id)) {
    return String(row._id[0] ?? "");
  }

  return String(row?._id ?? row?.id ?? "");
};

const getPieceLabel = (piece) =>
  piece?.catalog_number ||
  piece?.inventory_number ||
  piece?.origin_number ||
  piece?.title ||
  piece?._id;

const today = () => new Date().toISOString().split("T")[0];

export const ReturnMovementPieces = ({ accessToken, refreshToken }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pieces, setPieces] = useState([]);
  const [availablePieceIds, setAvailablePieceIds] = useState([]);
  const [selectedPieceIds, setSelectedPieceIds] = useState({});
  const [locations, setLocations] = useState([]);
  const [movement, setMovement] = useState(null);
  const [previousArrivals, setPreviousArrivals] = useState([]);
  const [formData, setFormData] = useState({
    location_id: "",
    arrival_date: today(),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    let active = true;

    if (!accessToken) {
      return () => {
        active = false;
      };
    }

    Promise.all([
      API_RequestMovementReturnPieces({
        accessToken,
        refreshToken,
        movementId: id,
      }),
      loadRawDatatableData({
        accessToken,
        refreshToken,
      }),
    ])
      .then(([returnData, rawPieces]) => {
        if (!active) return;

        const nextAvailablePieceIds = Array.isArray(returnData?.available_piece_ids)
          ? returnData.available_piece_ids.map(String)
          : [];
        const availableIdsSet = new Set(nextAvailablePieceIds);
        const nextPieces = Array.isArray(rawPieces?.data)
          ? rawPieces.data.filter((piece) =>
              availableIdsSet.has(String(piece?._id ?? piece?.id)),
            )
          : [];

        setMovement(returnData?.movement || null);
        setLocations(Array.isArray(returnData?.locations) ? returnData.locations : []);
        setPreviousArrivals(
          Array.isArray(returnData?.previous_arrivals)
            ? returnData.previous_arrivals
            : [],
        );
        setAvailablePieceIds(nextAvailablePieceIds);
        setPieces(nextPieces);
        setSelectedPieceIds({});
        setFormData((previous) => ({
          ...previous,
          location_id:
            returnData?.locations?.[0]?._id ??
            returnData?.locations?.[0]?.id ??
            previous.location_id,
        }));
        setErrorMsg("");
      })
      .catch((error) => {
        console.error("Error al cargar el paso 4 del movimiento", error);
        if (!active) return;
        setErrorMsg("No fue posible cargar la información para regresar piezas.");
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

  const selectedPieces = useMemo(() => {
    const selectedIds = new Set(
      Object.entries(selectedPieceIds)
        .filter(([, isSelected]) => Boolean(isSelected))
        .map(([pieceId]) => pieceId),
    );

    return pieces.filter((piece) => selectedIds.has(String(piece?._id ?? piece?.id)));
  }, [pieces, selectedPieceIds]);

  const togglePiece = (pieceId) => {
    setSuccessMsg("");
    setSelectedPieceIds((previousState) => ({
      ...previousState,
      [pieceId]: !previousState[pieceId],
    }));
  };

  const selectionColumn = useMemo(
    () => [
      {
        id: "movement_return_piece_selector",
        name: "",
        width: "72px",
        sortable: false,
        show: true,
        omit: false,
        excludeFromSearch: true,
        excludeFromColumnSelector: true,
        cell: (row) => {
          const pieceId = getPieceRowId(row);

          return (
            <Checkbox
              checked={Boolean(selectedPieceIds[pieceId])}
              onChange={() => togglePiece(pieceId)}
              slotProps={{
                input: {
                  "aria-label": `Seleccionar pieza ${pieceId}`,
                },
              }}
            />
          );
        },
      },
    ],
    [selectedPieceIds],
  );

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const result = await API_SaveMovementReturnPieces({
      accessToken,
      refreshToken,
      movementId: id,
      payload: {
        location_id: formData.location_id,
        arrival_date: formData.arrival_date,
        piece_ids: Object.entries(selectedPieceIds)
          .filter(([, isSelected]) => Boolean(isSelected))
          .map(([pieceId]) => pieceId),
      },
    });

    setSaving(false);

    if (!result || result?.error) {
      setErrorMsg(result?.error || "No fue posible registrar el regreso de las piezas.");
      return;
    }

    setSuccessMsg(result?.message || "El regreso de piezas se registró correctamente.");
    setTimeout(() => {
      navigate("/mnemosine/movements/manage");
    }, 2000);
  };

  const headerActions = (
    <>
      <Button
        sx={{ textTransform: "none" }}
        variant="outlined"
        onClick={() => navigate(`/mnemosine/movements/manage/info/${id}`)}
      >
        Volver a Paso 3
      </Button>
      <Button
        sx={{ textTransform: "none" }}
        variant="contained"
        color="success"
        onClick={handleSave}
        disabled={
          saving ||
          !formData.location_id ||
          !formData.arrival_date ||
          selectedPieces.length === 0
        }
      >
        {saving ? "Guardando..." : "Registrar regreso"}
      </Button>
      <Button
        sx={{ textTransform: "none" }}
        variant="contained"
        onClick={() => navigate("/mnemosine/movements/manage")}
      >
        Volver al listado
      </Button>
    </>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="container mt-3 mb-5">
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Paso 4 - Regresar piezas
        </Typography>
        <Typography variant="body2">
          Registra el regreso de piezas del movimiento {id}.
        </Typography>
        {errorMsg ? <Alert severity="warning" sx={{ mt: 2 }}>{errorMsg}</Alert> : null}
        {successMsg ? <Alert severity="success" sx={{ mt: 2 }}>{successMsg}</Alert> : null}
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Información del movimiento
        </Typography>
        <div className="row">
          <div className="col-12 col-md-6 mb-3">
            <Typography variant="caption" color="text.secondary">
              Fecha de salida
            </Typography>
            <Typography variant="body1">
              {formatDate(movement?.departure_date)}
            </Typography>
          </div>
          <div className="col-12 col-md-6 mb-3">
            <Typography variant="caption" color="text.secondary">
              Ubicación / Exposición
            </Typography>
            <Typography variant="body1">
              {movement?.exhibition_name || "N/A"}
            </Typography>
          </div>
          <div className="col-12 col-md-6 mb-3">
            <Typography variant="caption" color="text.secondary">
              Institución(es)
            </Typography>
            <Typography variant="body1">
              {(movement?.institution_names || []).join(", ") || "N/A"}
            </Typography>
          </div>
          <div className="col-12 col-md-6 mb-3">
            <Typography variant="caption" color="text.secondary">
              Responsable de movimiento
            </Typography>
            <Typography variant="body1">
              {(movement?.contact_names || []).join(", ") || "N/A"}
            </Typography>
          </div>
        </div>
      </Paper>

      {previousArrivals.length > 0 ? (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Previamente regresadas
          </Typography>
          {previousArrivals.map((arrival, index) => (
            <Paper key={`${arrival.arrival_date}-${index}`} variant="outlined" sx={{ p: 2, mb: 2 }}>
              <div className="row">
                <div className="col-12 col-md-6 mb-2">
                  <Typography variant="caption" color="text.secondary">
                    Ubicación
                  </Typography>
                  <Typography variant="body1">
                    {arrival.location_name || "En préstamo"}
                  </Typography>
                </div>
                <div className="col-12 col-md-6 mb-2">
                  <Typography variant="caption" color="text.secondary">
                    Fecha de regreso
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(arrival.arrival_date)}
                  </Typography>
                </div>
                <div className="col-12">
                  <Typography variant="caption" color="text.secondary">
                    Piezas
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                    {(arrival.pieces || []).map((piece) => (
                      <Chip
                        key={piece._id}
                        label={`${piece.catalog_number || "N/A"} / ${piece.inventory_number || "N/A"}`}
                      />
                    ))}
                  </Box>
                </div>
              </div>
            </Paper>
          ))}
        </Paper>
      ) : null}

      {availablePieceIds.length === 0 ? (
        <Alert severity="info">Se han regresado todas las piezas de este movimiento.</Alert>
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Registrar regreso
            </Typography>
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Ubicación"
                  value={formData.location_id || ""}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      location_id: event.target.value,
                    }))
                  }
                >
                  {locations.map((location) => (
                    <MenuItem
                      key={location._id ?? location.id}
                      value={location._id ?? location.id}
                    >
                      {location.name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Fecha de regreso"
                  InputLabelProps={{ shrink: true }}
                  value={formData.arrival_date || ""}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      arrival_date: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Piezas cargadas: {selectedPieces.length}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedPieces.length > 0 ? (
                selectedPieces.map((piece) => (
                  <Chip
                    key={String(piece._id)}
                    label={getPieceLabel(piece)}
                    onDelete={() => togglePiece(String(piece._id))}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hay piezas seleccionadas todavía.
                </Typography>
              )}
            </Box>
          </Paper>

          <BaseDatatable
            accessToken={accessToken}
            refreshToken={refreshToken}
            module="MovementPieces"
            title="Piezas pendientes por regresar"
            customData={pieces}
            prependColumns={selectionColumn}
            headerActions={headerActions}
            columnStorageKey={`showColumnsMovementReturnPieces-${id}`}
          />
        </>
      )}
    </div>
  );
};
