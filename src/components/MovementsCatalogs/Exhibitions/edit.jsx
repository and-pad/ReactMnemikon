import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box, Typography } from "@mui/material";

import { API_RequestExhibition } from "./api";
import { ExhibitionFormPage } from "./form";

export const EditExhibition = ({ accessToken, refreshToken }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [exhibition, setExhibition] = useState(null);
  const [catalogs, setCatalogs] = useState({
    institutions: [],
    contacts: [],
  });

  useEffect(() => {
    let active = true;

    API_RequestExhibition({
      accessToken,
      refreshToken,
      exhibitionId: id,
    })
      .then((response) => {
        if (!active) return;

        if (!response || response?.error) {
          setErrorMsg(response?.error || "No fue posible cargar la exposicion.");
          setLoading(false);
          return;
        }

        setExhibition(response?.exhibition || null);
        setCatalogs({
          institutions: response?.institutions || [],
          contacts: response?.contacts || [],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar exposicion", error);
        if (!active) return;
        setErrorMsg("No fue posible cargar la exposicion.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, id]);

  if (loading) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography>Cargando exposicion...</Typography>
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
    <ExhibitionFormPage
      accessToken={accessToken}
      refreshToken={refreshToken}
      mode="edit"
      exhibitionId={id}
      initialExhibition={exhibition}
      institutions={catalogs.institutions}
      initialContacts={catalogs.contacts}
    />
  );
};
