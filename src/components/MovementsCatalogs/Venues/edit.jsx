import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box, Typography } from "@mui/material";

import { API_RequestVenue } from "./api";
import { VenueFormPage } from "./form";

export const EditVenue = ({ accessToken, refreshToken }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [venue, setVenue] = useState(null);
  const [catalogs, setCatalogs] = useState({
    institutions: [],
    contacts: [],
  });

  useEffect(() => {
    let active = true;

    API_RequestVenue({
      accessToken,
      refreshToken,
      venueId: id,
    })
      .then((response) => {
        if (!active) return;

        if (!response || response?.error) {
          setErrorMsg(response?.error || "No fue posible cargar la sede.");
          setLoading(false);
          return;
        }

        setVenue(response?.venue || null);
        setCatalogs({
          institutions: response?.institutions || [],
          contacts: response?.contacts || [],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar sede", error);
        if (!active) return;
        setErrorMsg("No fue posible cargar la sede.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, id]);

  if (loading) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography>Cargando sede...</Typography>
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
      mode="edit"
      venueId={id}
      initialVenue={venue}
      institutions={catalogs.institutions}
      initialContacts={catalogs.contacts}
    />
  );
};
