import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { API_DownloadReportPdf, API_RequestReportPreview } from "./api";
import SETTINGS from "../Config/settings";

const renderSelectType = (value) => {
  if (value === "all") return "Todas";
  if (value === "all_except") return "Todas excepto";
  return "Personalizada";
};

export const ViewReport = ({ accessToken, refreshToken, permissions = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [payload, setPayload] = useState(null);
  const [selectedPieceIds, setSelectedPieceIds] = useState([]);

  const canEdit = useMemo(
    () => permissions?.includes("editar_reportes"),
    [permissions],
  );

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
      setSelectedPieceIds(
        (response?.pieces || []).map((piece) => String(piece._id || piece.id)),
      );
      setLoading(false);
    };

    loadReport();
  }, [accessToken, refreshToken, id]);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    setErrorMsg("");

    const response = await API_DownloadReportPdf({
      accessToken,
      refreshToken,
      reportId: id,
      selectedPieceIds,
    });

    setDownloading(false);

    if (!response || response?.error || !response?.blob) {
      setErrorMsg(response?.error || "No fue posible descargar el PDF.");
      return;
    }

    const objectUrl = window.URL.createObjectURL(response.blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = response.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(objectUrl);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorMsg || !payload?.report) {
    return (
      <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 2 }}>
        <Alert severity="error">{errorMsg || "No fue posible cargar el reporte."}</Alert>
      </Box>
    );
  }

  const { report, pieces = [] } = payload;
  const previewColumns = payload.columns || [];
  const inventoryThumbnailBase =
    SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.inventory_thumbnails;

  const tableRows = pieces.map((piece) => {
    const fieldsMap = Object.fromEntries(
      (piece.fields || []).map((field) => [field.id, field]),
    );
    return { ...piece, fieldsMap };
  });

  const allSelected =
    tableRows.length > 0 && selectedPieceIds.length === tableRows.length;

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
                onClick={handleDownloadPdf}
                disabled={downloading || !selectedPieceIds.length}
              >
                {downloading ? "Generando PDF..." : "Generar PDF"}
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
                      <TableCell>Foto inventario</TableCell>
                      <TableCell>No. inventario</TableCell>
                      <TableCell>No. catalogo</TableCell>
                      <TableCell>No. procedencia</TableCell>
                      {previewColumns.map((column) => (
                        <TableCell key={column.id}>{column.label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableRows.map((piece) => (
                      <TableRow key={piece._id || piece.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedPieceIds.includes(String(piece._id || piece.id))}
                            onChange={() => togglePiece(String(piece._id || piece.id))}
                          />
                        </TableCell>
                        <TableCell>
                          {piece.inventory_photo_file_name ? (
                            <Box
                              component="img"
                              src={`${inventoryThumbnailBase}${piece.inventory_photo_file_name}`}
                              alt={piece.title || "Foto inventario"}
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
                            "N/D"
                          )}
                        </TableCell>
                        <TableCell>{piece.inventory_number || "N/D"}</TableCell>
                        <TableCell>{piece.catalog_number || "N/D"}</TableCell>
                        <TableCell>{piece.origin_number || "N/D"}</TableCell>
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
                                    src={field.preview_url}
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
            </Paper>
          ) : null}

          {pieces.map((piece, index) => (
            <Paper key={piece._id || piece.id || index} variant="outlined" sx={{ padding: 2.5 }}>
              <Stack spacing={1.5}>
                <Typography variant="h6">
                  {index + 1}. {piece.title || "Sin titulo"}
                </Typography>
                <Typography color="text.secondary">
                  Inventario: {piece.inventory_number || "N/D"} | Catalogo: {piece.catalog_number || "N/D"} | Procedencia: {piece.origin_number || "N/D"}
                </Typography>
                <Divider />
                <Stack spacing={1}>
                  {(piece.fields || []).map((field) => (
                    field.type === "image" ? (
                      <Box key={field.id}>
                        <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
                          {field.label}
                        </Typography>
                        {field.preview_url ? (
                          <Box
                            component="img"
                            src={field.preview_url}
                            alt={field.label}
                            sx={{
                              maxWidth: "100%",
                              maxHeight: 260,
                              objectFit: "contain",
                              border: "1px solid #ddd",
                              borderRadius: 1,
                              backgroundColor: "#fff",
                            }}
                          />
                        ) : (
                          <Typography color="text.secondary">
                            Imagen disponible solo para exportacion PDF.
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography key={field.id}>
                        <strong>{field.label}:</strong> {field.value}
                      </Typography>
                    )
                  ))}
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
};
