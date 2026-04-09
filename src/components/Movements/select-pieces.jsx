import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { BaseDatatable } from "../Datatables/datatableStructurer";
import {
  API_RequestMovementPieces,
  API_SaveMovementPieces,
} from "./APICalls";

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

export const SelectMovementPieces = ({ accessToken, refreshToken }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pieces, setPieces] = useState([]);
  const [selectedPieceIds, setSelectedPieceIds] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const selectedPieceIdsRef = useRef({});

  useEffect(() => {
    selectedPieceIdsRef.current = selectedPieceIds;
  }, [selectedPieceIds]);

  useEffect(() => {
    let active = true;

    API_RequestMovementPieces({
      accessToken,
      refreshToken,
      movementId: id,
    })
      .then((data) => {
        if (!active) return;

        const nextPieces = Array.isArray(data?.pieces) ? data.pieces : [];
        const nextSelectedIds = Array.isArray(data?.selected_piece_ids)
          ? data.selected_piece_ids.reduce((accumulator, pieceId) => {
              accumulator[String(pieceId)] = true;
              return accumulator;
            }, {})
          : {};

        setPieces(nextPieces);
        setSelectedPieceIds(nextSelectedIds);
        setErrorMsg("");
      })
      .catch((error) => {
        console.error("Error al cargar las piezas del movimiento", error);
        if (!active) return;
        setErrorMsg("No fue posible cargar las piezas disponibles.");
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

    return pieces.filter((piece) => selectedIds.has(String(piece._id)));
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
        id: "movement_piece_selector",
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
              checked={Boolean(selectedPieceIdsRef.current[pieceId])}
              onChange={() => togglePiece(pieceId)}
              inputProps={{
                "aria-label": `Seleccionar pieza ${pieceId}`,
              }}
            />
          );
        },
      },
    ],
    [],
  );

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const result = await API_SaveMovementPieces({
      accessToken,
      refreshToken,
      movementId: id,
      pieceIds: Object.entries(selectedPieceIds)
        .filter(([, isSelected]) => Boolean(isSelected))
        .map(([pieceId]) => pieceId),
    });

    setSaving(false);

    if (!result || result?.error) {
      setErrorMsg(result?.error || "No fue posible guardar la selección de piezas.");
      return;
    }

    const normalizedIds = Array.isArray(result?.selected_piece_ids)
      ? result.selected_piece_ids
      : [];

    setSelectedPieceIds(
      normalizedIds.reduce((accumulator, pieceId) => {
        accumulator[String(pieceId)] = true;
        return accumulator;
      }, {}),
    );
    setSuccessMsg("La selección de piezas se guardó correctamente.");
  };

  const headerActions = (
    <>
      <Button
        sx={{ textTransform: "none" }}
        variant="outlined"
        onClick={() => navigate(`/mnemosine/movements/manage/edit/${id}`)}
      >
        Volver a Paso 1
      </Button>
      <Button
        sx={{ textTransform: "none" }}
        variant="contained"
        color="success"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Guardando..." : "Guardar piezas"}
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
          Paso 2 - Selección de piezas
        </Typography>
        <Typography variant="body2">
          Movimiento {id}. La selección se mantiene aunque cambie la paginación.
        </Typography>

        {errorMsg ? <Alert severity="warning" sx={{ mt: 2 }}>{errorMsg}</Alert> : null}
        {successMsg ? <Alert severity="success" sx={{ mt: 2 }}>{successMsg}</Alert> : null}
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Piezas seleccionadas: {selectedPieces.length}
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
        title="Listado de piezas"
        customData={pieces}
        prependColumns={selectionColumn}
        headerActions={headerActions}
        columnStorageKey={`showColumnsMovementPieces-${id}`}
      />
    </div>
  );
};
