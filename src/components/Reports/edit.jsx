import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box, CircularProgress } from "@mui/material";

import { API_RequestReport } from "./api";
import { ReportFormPage } from "./form";

export const EditReport = ({ accessToken, refreshToken }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      setErrorMsg("");

      const response = await API_RequestReport({
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
      setLoading(false);
    };

    loadReport();
  }, [accessToken, refreshToken, id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorMsg || !payload?.report) {
    return (
      <Box sx={{ maxWidth: 1000, margin: "0 auto", padding: 2 }}>
        <Alert severity="error">{errorMsg || "No fue posible cargar el reporte."}</Alert>
      </Box>
    );
  }

  return (
    <ReportFormPage
      accessToken={accessToken}
      refreshToken={refreshToken}
      mode="edit"
      reportId={id}
      initialReport={payload.report}
      columnsCatalog={payload.columns_catalog || []}
      institutions={payload.institutions || []}
      exhibitions={payload.exhibitions || []}
      initialTemplates={payload.templates || []}
    />
  );
};
