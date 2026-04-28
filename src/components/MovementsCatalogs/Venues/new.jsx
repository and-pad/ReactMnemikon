import { useEffect, useState } from "react";
import { Alert, Box, Typography } from "@mui/material";

import { API_RequestVenues } from "./api";
import { VenueFormPage } from "./form";

export const NewVenue = ({ accessToken, refreshToken }) => {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [catalogs, setCatalogs] = useState({
    institutions: [],
  });

  useEffect(() => {
    let active = true;

    API_RequestVenues({ accessToken, refreshToken })
      .then((response) => {
        if (!active) return;
        if (!response || response?.error) {
          setErrorMsg(
            response?.error || "No fue posible cargar los catalogos de la sede.",
          );
          setLoading(false);
          return;
        }

        setCatalogs({
          institutions: response?.institutions || [],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar catalogos de sedes", error);
        if (!active) return;
        setErrorMsg("No fue posible cargar los catalogos de la sede.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accessToken, refreshToken]);

  if (loading) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography>Cargando formulario de sede...</Typography>
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
    <VenueFormPage
      accessToken={accessToken}
      refreshToken={refreshToken}
      mode="create"
      institutions={catalogs.institutions}
      initialContacts={[]}
    />
  );
};
