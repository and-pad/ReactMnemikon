import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { API_RequestReportPreview } from "./api";
import { canEditReports } from "./reportPermissions";
import SETTINGS from "../Config/settings";

const renderSelectType = (value) => {
  if (value === "all") return "Todas";
  if (value === "all_except") return "Todas excepto";
  return "Personalizada";
};

export const ViewReport = ({ accessToken, refreshToken, permissions = [] }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [payload, setPayload] = useState(null);
  const [selectedPieceIds, setSelectedPieceIds] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const canEdit = useMemo(
    () => canEditReports(permissions),
    [permissions],
  );

  const selectedIdsFromQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("selected_piece_ids") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [location.search]);

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      setErrorMsg("");

      const response = await API_RequestReportPreview({
        accessToken,
        refreshToken,
        reportId: id,
      });

      if (!response || response?.error) {
        setErrorMsg(response?.error || "No fue posible cargar el reporte.");
        setLoading(false);
        return;
      }

      setPayload(response);
      const allIds = (response?.pieces || []).map((piece) => String(piece._id || piece.id));
      setSelectedPieceIds(
        selectedIdsFromQuery.length
          ? selectedIdsFromQuery.filter((pieceId) => allIds.includes(pieceId))
          : allIds,
      );
      setLoading(false);
    };

    loadReport();
  }, [accessToken, refreshToken, id, selectedIdsFromQuery]);

  const handlePreviewPdf = () => {
    const params = new URLSearchParams();
    params.set("selected_piece_ids", selectedPieceIds.join(","));
    navigate(`/mnemosine/reports/view/${id}/pdf-preview?${params.toString()}`);
  };

  const report = payload?.report || null;
  const pieces = payload?.pieces || [];

  const previewColumns = useMemo(() => {
    const seen = new Set();

    return (payload?.columns || []).filter((column) => {
      const columnId = String(column?.id || "").trim();
      if (!columnId || seen.has(columnId)) {
        return false;
      }

      seen.add(columnId);
      return true;
    });
  }, [payload]);

  const tableRows = useMemo(
    () =>
      pieces.map((piece) => {
        const fieldsMap = Object.fromEntries(
          (piece.fields || []).map((field) => [field.id, field]),
        );
        return { ...piece, fieldsMap };
      }),
    [pieces],
  );

  const allSelected =
    tableRows.length > 0 && selectedPieceIds.length === tableRows.length;

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return tableRows.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage, tableRows]);

  const togglePiece = (pieceId) => {
    setSelectedPieceIds((prev) =>
      prev.includes(pieceId)
        ? prev.filter((item) => item !== pieceId)
        : [...prev, pieceId],
    );
  };

  const toggleAllPieces = () => {
    setSelectedPieceIds((prev) =>
      prev.length === tableRows.length
        ? []
        : tableRows.map((piece) => String(piece._id || piece.id)),
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorMsg || !report) {
    return (
      <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 2 }}>
        <Alert severity="error">{errorMsg || "No fue posible cargar el reporte."}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 2 }}>
      <Paper elevation={4} sx={{ padding: 3 }}>
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <Box>
              <Typography variant="h4">{report.name || "Reporte"}</Typography>
              {report.description ? (
                <Typography color="text.secondary">{report.description}</Typography>
              ) : null}
            </Box>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <Button
                variant="contained"
                startIcon={<PictureAsPdfOutlinedIcon />}
                onClick={handlePreviewPdf}
                disabled={!selectedPieceIds.length}
              >
                Previsualizar PDF
              </Button>
              {canEdit ? (
                <Button
                  variant="outlined"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() => navigate(`/mnemosine/reports/edit/${report._id || report.id}`)}
                >
                  Editar
                </Button>
              ) : null}
            </Stack>
          </Stack>

          {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}

          <Paper variant="outlined" sx={{ padding: 2, backgroundColor: "#f7f7f7" }}>
            <Stack spacing={1}>
              <Typography><strong>Seleccion:</strong> {renderSelectType(report.select_type)}</Typography>
              <Typography><strong>Columnas:</strong> {report.columns_list?.length || 0}</Typography>
              <Typography><strong>Piezas renderizadas:</strong> {pieces.length}</Typography>
              <Typography><strong>Piezas seleccionadas para PDF:</strong> {selectedPieceIds.length}</Typography>
              {report.lending_list ? (
                <>
                  <Typography><strong>Institucion:</strong> {report.institution_name || report.institution || "N/D"}</Typography>
                  <Typography><strong>Exposicion:</strong> {report.exhibition_name || report.exhibition || "N/D"}</Typography>
                  <Typography>
                    <strong>Fechas:</strong> {report.exhibition_date_start || "N/D"} a {report.exhibition_date_end || "N/D"}
                  </Typography>
                </>
              ) : null}
            </Stack>
          </Paper>

          {!pieces.length ? (
            <Alert severity="warning">
              Este reporte no tiene piezas renderizadas con la configuracion actual.
            </Alert>
          ) : null}

          {pieces.length ? (
            <Paper variant="outlined" sx={{ overflow: "hidden" }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={allSelected}
                          indeterminate={
                            selectedPieceIds.length > 0 &&
                            selectedPieceIds.length < tableRows.length
                          }
                          onChange={toggleAllPieces}
                        />
                      </TableCell>
                      {previewColumns.map((column) => (
                        <TableCell key={column.id}>{column.label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedRows.map((piece) => (
                      <TableRow key={piece._id || piece.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedPieceIds.includes(String(piece._id || piece.id))}
                            onChange={() => togglePiece(String(piece._id || piece.id))}
                          />
                        </TableCell>
                        {previewColumns.map((column) => {
                          const field = piece.fieldsMap?.[column.id];
                          if (!field) {
                            return <TableCell key={column.id}>N/D</TableCell>;
                          }

                          if (field.type === "image") {
                            return (
                              <TableCell key={column.id}>
                                {field.preview_url ? (
                                  <Box
                                    component="img"
                                    src={SETTINGS.URL_ADDRESS.server_url + field.preview_url}
                                    alt={field.label}
                                    sx={{
                                      width: 88,
                                      height: 88,
                                      objectFit: "contain",
                                      border: "1px solid #ddd",
                                      borderRadius: 1,
                                      backgroundColor: "#fff",
                                    }}
                                  />
                                ) : (
                                  "Imagen"
                                )}
                              </TableCell>
                            );
                          }

                          return <TableCell key={column.id}>{field.value}</TableCell>;
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={tableRows.length}
                page={page}
                onPageChange={(event, nextPage) => setPage(nextPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[10, 20, 50]}
                labelRowsPerPage="Filas por pagina"
              />
            </Paper>
          ) : null}
        </Stack>
      </Paper>
    </Box>
  );
};
