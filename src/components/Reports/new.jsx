import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";

import { API_RequestReportsMeta } from "./api";
import { ReportFormPage } from "./form";

export const NewReport = ({ accessToken, refreshToken }) => {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    const loadMeta = async () => {
      setLoading(true);
      setErrorMsg("");

      const response = await API_RequestReportsMeta({ accessToken, refreshToken });

      if (!response || response?.error) {
        setErrorMsg(response?.error || "No fue posible cargar el formulario.");
        setLoading(false);
        return;
      }

      setMeta(response);
      setLoading(false);
    };

    loadMeta();
  }, [accessToken, refreshToken]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorMsg || !meta) {
    return (
      <Box sx={{ maxWidth: 1000, margin: "0 auto", padding: 2 }}>
        <Alert severity="error">{errorMsg || "No fue posible cargar el modulo."}</Alert>
      </Box>
    );
  }

  return (
    <ReportFormPage
      accessToken={accessToken}
      refreshToken={refreshToken}
      mode="create"
      columnsCatalog={meta.columns_catalog || []}
      institutions={meta.institutions || []}
      exhibitions={meta.exhibitions || []}
      initialTemplates={meta.templates || []}
    />
  );
};
