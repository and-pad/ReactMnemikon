import { useEffect, useState } from "react";
import { Alert, Box, Typography } from "@mui/material";

import { InstitutionFormPage } from "./form";
import { API_RequestInstitutions } from "./api";

export const NewInstitution = ({ accessToken, refreshToken }) => {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [catalogs, setCatalogs] = useState({ countries: [], states: [] });

  useEffect(() => {
    let active = true;

    API_RequestInstitutions({ accessToken, refreshToken })
      .then((response) => {
        if (!active) return;
        if (!response || response?.error) {
          setErrorMsg(response?.error || "No fue posible cargar paises y estados.");
          setLoading(false);
          return;
        }

        setCatalogs({
          countries: response?.countries || [],
          states: response?.states || [],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar catalogos de instituciones", error);
        if (!active) return;
        setErrorMsg("No fue posible cargar paises y estados.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accessToken, refreshToken]);

  if (loading) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography>Cargando formulario de institucion...</Typography>
      </Box>
    );
  }

  if (errorMsg) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="error">{errorMsg}</Alert>
      </Box>
    );
  }

  return (
    <InstitutionFormPage
      accessToken={accessToken}
      refreshToken={refreshToken}
      mode="create"
      countries={catalogs.countries}
      states={catalogs.states}
    />
  );
};
