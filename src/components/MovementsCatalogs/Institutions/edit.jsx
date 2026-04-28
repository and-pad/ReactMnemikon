import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box, Typography } from "@mui/material";

import { InstitutionFormPage } from "./form";
import { API_RequestInstitution } from "./api";

export const EditInstitution = ({ accessToken, refreshToken }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [institution, setInstitution] = useState(null);
  const [catalogs, setCatalogs] = useState({ countries: [], states: [] });

  useEffect(() => {
    let active = true;

    API_RequestInstitution({
      accessToken,
      refreshToken,
      institutionId: id,
    })
      .then((response) => {
        if (!active) return;

        if (!response || response?.error) {
          setErrorMsg(response?.error || "No fue posible cargar la institucion.");
          setLoading(false);
          return;
        }

        setInstitution(response?.institution || null);
        setCatalogs({
          countries: response?.countries || [],
          states: response?.states || [],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar institucion", error);
        if (!active) return;
        setErrorMsg("No fue posible cargar la institucion.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, id]);

  if (loading) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography>Cargando institucion...</Typography>
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
      mode="edit"
      institutionId={id}
      initialInstitution={institution}
      countries={catalogs.countries}
      states={catalogs.states}
    />
  );
};
