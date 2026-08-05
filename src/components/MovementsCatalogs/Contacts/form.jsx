import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
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

import { API_CreateContact, API_UpdateContact } from "./api";

const createDefaultFormData = () => ({
  name: "",
  last_name: "",
  m_last_name: "",
  treatment_title: "",
  position: "",
  departament: "",
  phone: "",
  phone2: "",
  email: "",
  institution_id: "",
});

const normalizeCatalogItem = (item) => {
  if (!item) return null;

  return {
    ...item,
    _id: String(item._id ?? item.id ?? ""),
    id: String(item._id ?? item.id ?? ""),
    name: item.name ?? item.title ?? item.description ?? "",
  };
};

const normalizeContact = (contact) => {
  if (!contact) return createDefaultFormData();

  return {
    name: contact.name ?? "",
    last_name: contact.last_name ?? "",
    m_last_name: contact.m_last_name ?? "",
    treatment_title: contact.treatment_title ? String(contact.treatment_title) : "",
    position: contact.position ?? "",
    departament: contact.departament ?? "",
    phone: contact.phone ?? "",
    phone2: contact.phone2 ?? "",
    email: contact.email ?? "",
    institution_id: contact.institution_id ? String(contact.institution_id) : "",
  };
};

export const ContactFormPage = ({
  accessToken,
  refreshToken,
  mode = "create",
  contactId = null,
  initialContact = null,
  institutions = [],
  treatmentTitles = [],
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(normalizeContact(initialContact));
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const normalizedInstitutions = useMemo(
    () => (institutions || []).map(normalizeCatalogItem).filter(Boolean),
    [institutions],
  );
  const normalizedTreatmentTitles = useMemo(
    () => (treatmentTitles || []).map(normalizeCatalogItem).filter(Boolean),
    [treatmentTitles],
  );

  const selectedInstitution =
    normalizedInstitutions.find(
      (institution) =>
        String(institution._id) === String(formData.institution_id),
    ) || null;

  const selectedTreatmentTitle =
    normalizedTreatmentTitles.find(
      (title) => String(title._id) === String(formData.treatment_title),
    ) || null;

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
      treatment_title: formData.treatment_title || null,
      institution_id: formData.institution_id || null,
    };

    const request = mode === "edit"
      ? API_UpdateContact({
          accessToken,
          refreshToken,
          contactId,
          payload,
        })
      : API_CreateContact({
          accessToken,
          refreshToken,
          payload,
        });

    const response = await request;
    setSubmitting(false);

    if (!response || response === true || response?.error) {
      setErrorMsg(response?.error || "No fue posible guardar el contacto.");
      setFieldErrors(response?.errors || {});
      return;
    }

    navigate("/mnemosine/movements/contacts");
  };

  return (
    <Box sx={{ maxWidth: 1100, margin: "0 auto", padding: 2 }}>
      <Paper elevation={4} sx={{ padding: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          {mode === "edit" ? "Editar contacto" : "Nuevo contacto"}
        </Typography>

        {errorMsg ? (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errorMsg}
          </Alert>
        ) : null}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Nombre"
                value={formData.name}
                onChange={(event) => setField("name", event.target.value)}
                fullWidth
                required
                error={Boolean(fieldErrors.name)}
                helperText={fieldErrors.name || ""}
              />
              <TextField
                label="Apellido paterno"
                value={formData.last_name}
                onChange={(event) => setField("last_name", event.target.value)}
                fullWidth
                required
                error={Boolean(fieldErrors.last_name)}
                helperText={fieldErrors.last_name || ""}
              />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Apellido materno"
                value={formData.m_last_name}
                onChange={(event) => setField("m_last_name", event.target.value)}
                fullWidth
              />
              <Autocomplete
                options={normalizedTreatmentTitles}
                value={selectedTreatmentTitle}
                onChange={(event, value) =>
                  setField("treatment_title", value?._id || "")
                }
                isOptionEqualToValue={(option, value) => option._id === value._id}
                getOptionLabel={(option) => option?.name || ""}
                renderInput={(params) => (
                  <TextField {...params} label="Titulo" />
                )}
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Telefono"
                value={formData.phone}
                onChange={(event) => setField("phone", event.target.value)}
                fullWidth
              />
              <TextField
                label="Telefono 2"
                value={formData.phone2}
                onChange={(event) => setField("phone2", event.target.value)}
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Correo"
                value={formData.email}
                onChange={(event) => setField("email", event.target.value)}
                fullWidth
                required
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email || ""}
              />
              <Autocomplete
                options={normalizedInstitutions}
                value={selectedInstitution}
                onChange={(event, value) =>
                  setField("institution_id", value?._id || "")
                }
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
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Cargo"
                value={formData.position}
                onChange={(event) => setField("position", event.target.value)}
                fullWidth
              />
              <TextField
                label="Departamento"
                value={formData.departament}
                onChange={(event) => setField("departament", event.target.value)}
                fullWidth
              />
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate("/mnemosine/movements/contacts")}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting
                  ? "Guardando..."
                  : mode === "edit"
                    ? "Guardar cambios"
                    : "Crear contacto"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};
