import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";

import SETTINGS from "../Config/settings";
import { API_DownloadReportPdf, API_RequestReportPreview } from "./api";

const getReportSelectionStorageKey = (reportId) =>
  `report-preview-selection:${reportId}`;

const renderSelectType = (value) => {
  if (value === "all") return "Todas";
  if (value === "all_except") return "Todas excepto";
  return "Personalizada";
};

export const ReportPdfPreview = ({ accessToken, refreshToken }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [payload, setPayload] = useState(null);

  const selectedPieceIds = useMemo(() => {
    const stateIds = Array.isArray(location.state?.selectedPieceIds)
      ? location.state.selectedPieceIds
      : [];
    if (stateIds.length) {
      return stateIds.map((item) => String(item).trim()).filter(Boolean);
    }

    try {
      const saved = sessionStorage.getItem(getReportSelectionStorageKey(id));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) {
          return parsed.map((item) => String(item).trim()).filter(Boolean);
        }
      }
    } catch (error) {
      console.error("No fue posible recuperar la seleccion guardada del reporte", error);
    }
    return [];
  }, [id, location.state]);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        getReportSelectionStorageKey(id),
        JSON.stringify(selectedPieceIds),
      );
    } catch (error) {
      console.error("No fue posible guardar la seleccion del reporte", error);
    }
  }, [id, selectedPieceIds]);

  useEffect(() => {
    const loadPreview = async () => {
      setLoading(true);
      setErrorMsg("");

      const response = await API_RequestReportPreview({
        accessToken,
        refreshToken,
        reportId: id,
        selectedPieceIds,
      });

      if (!response || response?.error) {
        setErrorMsg(response?.error || "No fue posible cargar la previsualizacion.");
        setLoading(false);
        return;
      }

      setPayload(response);
      setLoading(false);
    };

    loadPreview();
  }, [accessToken, refreshToken, id, selectedPieceIds]);

  const handleGeneratePdf = async () => {
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
        <Alert severity="error">
          {errorMsg || "No fue posible cargar la previsualizacion del PDF."}
        </Alert>
      </Box>
    );
  }

  const { report, pieces = [] } = payload;
  
  const getFileName = (path) => {
  return path.split("/").pop();
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
              <Typography variant="h4">
                Previsualizacion PDF: {report.name || "Reporte"}
              </Typography>
              {report.description ? (
                <Typography color="text.secondary">{report.description}</Typography>
              ) : null}
            </Box>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackOutlinedIcon />}
                onClick={() =>
                  navigate(`/mnemosine/reports/view/${id}`, {
                    state: { selectedPieceIds },
                  })
                }
              >
                Volver
              </Button>
              <Button
                variant="contained"
                startIcon={<PictureAsPdfOutlinedIcon />}
                onClick={handleGeneratePdf}
                disabled={downloading || !selectedPieceIds.length}
              >
                {downloading ? "Generando PDF..." : "Generar PDF"}
              </Button>
            </Stack>
          </Stack>

          {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}

          <Paper variant="outlined" sx={{ padding: 2, backgroundColor: "#f7f7f7" }}>
            <Stack spacing={1}>
              <Typography><strong>Seleccion:</strong> {renderSelectType(report.select_type)}</Typography>
              <Typography><strong>Piezas incluidas:</strong> {pieces.length}</Typography>
              <Typography><strong>Columnas:</strong> {report.columns_list?.length || 0}</Typography>
            </Stack>
          </Paper>

          {!pieces.length ? (
            <Alert severity="warning">
              No hay piezas para previsualizar con la seleccion actual.
            </Alert>
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
                            src={
                              SETTINGS.URL_ADDRESS.server_url +
                              SETTINGS.URL_ADDRESS.inventory_thumbnails +
                              getFileName(field.preview_url)
                            }
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
