import { useEffect, useState } from "react";
import { Alert, Box, Typography } from "@mui/material";

import { API_RequestContacts } from "./api";
import { ContactFormPage } from "./form";

export const NewContact = ({ accessToken, refreshToken }) => {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [catalogs, setCatalogs] = useState({
    institutions: [],
    treatmentTitles: [],
  });

  useEffect(() => {
    let active = true;

    API_RequestContacts({ accessToken, refreshToken })
      .then((response) => {
        if (!active) return;
        if (!response || response?.error) {
          setErrorMsg(
            response?.error || "No fue posible cargar los catalogos del contacto.",
          );
          setLoading(false);
          return;
        }

        setCatalogs({
          institutions: response?.institutions || [],
          treatmentTitles: response?.treatment_titles || [],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar catalogos de contactos", error);
        if (!active) return;
        setErrorMsg("No fue posible cargar los catalogos del contacto.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accessToken, refreshToken]);

  if (loading) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography>Cargando formulario de contacto...</Typography>
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
    <ContactFormPage
      accessToken={accessToken}
      refreshToken={refreshToken}
      mode="create"
      institutions={catalogs.institutions}
      treatmentTitles={catalogs.treatmentTitles}
    />
  );
};
