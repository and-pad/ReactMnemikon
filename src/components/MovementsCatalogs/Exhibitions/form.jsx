import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  API_CreateExhibition,
  API_RequestContactsByInstitution,
  API_UpdateExhibition,
} from "./api";

const createDefaultFormData = () => ({
  name: "",
  institution_id: "",
  contact_id: "",
});

const normalizeCatalogItem = (item) => {
  if (!item) return null;

  return {
    ...item,
    _id: String(item._id ?? item.id ?? ""),
    id: String(item._id ?? item.id ?? ""),
    name: item.name ?? item.title ?? item.description ?? "",
    last_name: item.last_name ?? "",
    full_name:
      item.full_name ??
      [item.name, item.last_name].filter(Boolean).join(" ").trim() ??
      "",
  };
};

const normalizeExhibition = (exhibition) => {
  if (!exhibition) return createDefaultFormData();

  return {
    name: exhibition.name ?? "",
    institution_id: exhibition.institution_id
      ? String(exhibition.institution_id)
      : "",
    contact_id: exhibition.contact_id ? String(exhibition.contact_id) : "",
  };
};

export const ExhibitionFormPage = ({
  accessToken,
  refreshToken,
  mode = "create",
  exhibitionId = null,
  initialExhibition = null,
  institutions = [],
  initialContacts = [],
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(normalizeExhibition(initialExhibition));
  const [contacts, setContacts] = useState(initialContacts || []);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const normalizedInstitutions = useMemo(
    () => (institutions || []).map(normalizeCatalogItem).filter(Boolean),
    [institutions],
  );
  const normalizedContacts = useMemo(
    () => (contacts || []).map(normalizeCatalogItem).filter(Boolean),
    [contacts],
  );

  const selectedInstitution =
    normalizedInstitutions.find(
      (institution) =>
        String(institution._id) === String(formData.institution_id),
    ) || null;

  const selectedContact =
    normalizedContacts.find(
      (contact) => String(contact._id) === String(formData.contact_id),
    ) || null;

  useEffect(() => {
    let active = true;

    if (!formData.institution_id) {
      setContacts([]);
      setFormData((prev) => ({ ...prev, contact_id: "" }));
      return undefined;
    }

    API_RequestContactsByInstitution({
      accessToken,
      refreshToken,
      institutionId: formData.institution_id,
    })
      .then((response) => {
        if (!active) return;
        const nextContacts = Array.isArray(response) ? response : [];
        setContacts(nextContacts);
        setFormData((prev) => {
          const exists = nextContacts.some(
            (item) => String(item._id ?? item.id) === String(prev.contact_id),
          );
          return exists ? prev : { ...prev, contact_id: "" };
        });
      })
      .catch((error) => {
        console.error("Error al cargar contactos por institucion", error);
        if (!active) return;
        setContacts([]);
        setErrorMsg("No fue posible cargar los contactos de la institucion.");
      });

    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, formData.institution_id]);

  const setField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setFieldErrors({});

    const payload = {
      ...formData,
      institution_id: formData.institution_id || null,
      contact_id: formData.contact_id || null,
    };

    const request = mode === "edit"
      ? API_UpdateExhibition({
          accessToken,
          refreshToken,
          exhibitionId,
          payload,
        })
      : API_CreateExhibition({
          accessToken,
          refreshToken,
          payload,
        });

    const response = await request;
    setSubmitting(false);

    if (!response || response === true || response?.error) {
      setErrorMsg(response?.error || "No fue posible guardar la exposicion.");
      setFieldErrors(response?.errors || {});
      return;
    }

    navigate("/mnemosine/movements/exhibitions");
  };

  return (
    <Box sx={{ maxWidth: 900, margin: "0 auto", padding: 2 }}>
      <Paper elevation={4} sx={{ padding: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          {mode === "edit" ? "Editar exposicion" : "Nueva exposicion"}
        </Typography>

        {errorMsg ? (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errorMsg}
          </Alert>
        ) : null}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Nombre"
              value={formData.name}
              onChange={(event) => setField("name", event.target.value)}
              fullWidth
              required
              error={Boolean(fieldErrors.name)}
              helperText={fieldErrors.name || ""}
            />

            <Autocomplete
              options={normalizedInstitutions}
              value={selectedInstitution}
              onChange={(event, value) => {
                setField("institution_id", value?._id || "");
                setField("contact_id", "");
              }}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              getOptionLabel={(option) => option?.name || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Institucion"
                  required
                  error={Boolean(fieldErrors.institution_id)}
                  helperText={fieldErrors.institution_id || ""}
                />
              )}
            />

            <Autocomplete
              options={normalizedContacts}
              value={selectedContact}
              onChange={(event, value) => setField("contact_id", value?._id || "")}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              getOptionLabel={(option) =>
                option?.full_name || [option?.name, option?.last_name].filter(Boolean).join(" ")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Contacto"
                  required
                  error={Boolean(fieldErrors.contact_id)}
                  helperText={fieldErrors.contact_id || ""}
                />
              )}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate("/mnemosine/movements/exhibitions")}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting
                  ? "Guardando..."
                  : mode === "edit"
                    ? "Guardar cambios"
                    : "Crear exposicion"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};
