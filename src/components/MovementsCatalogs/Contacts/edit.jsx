import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Alert, Box, Typography } from "@mui/material";

import { API_RequestContact } from "./api";
import { ContactFormPage } from "./form";

export const EditContact = ({ accessToken, refreshToken }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [contact, setContact] = useState(null);
  const [catalogs, setCatalogs] = useState({
    institutions: [],
    treatmentTitles: [],
  });

  useEffect(() => {
    let active = true;

    API_RequestContact({
      accessToken,
      refreshToken,
      contactId: id,
    })
      .then((response) => {
        if (!active) return;

        if (!response || response?.error) {
          setErrorMsg(response?.error || "No fue posible cargar el contacto.");
          setLoading(false);
          return;
        }

        setContact(response?.contact || null);
        setCatalogs({
          institutions: response?.institutions || [],
          treatmentTitles: response?.treatment_titles || [],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar contacto", error);
        if (!active) return;
        setErrorMsg("No fue posible cargar el contacto.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, id]);

  if (loading) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography>Cargando contacto...</Typography>
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
      mode="edit"
      contactId={id}
      initialContact={contact}
      institutions={catalogs.institutions}
      treatmentTitles={catalogs.treatmentTitles}
    />
  );
};
