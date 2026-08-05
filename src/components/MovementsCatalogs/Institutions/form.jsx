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

import {
  API_CreateInstitution,
  API_UpdateInstitution,
} from "./api";

const createDefaultFormData = () => ({
  name: "",
  address: "",
  city: "",
  country_id: "",
  state_id: "",
  zip_code: "",
  phone: "",
  phone2: "",
  fax: "",
  email: "",
  web_site: "",
  business_activity: "",
  rfc: "",
});

const normalizeCatalogItem = (item) => {
  if (!item) return null;

  return {
    ...item,
    _id: String(item._id ?? item.id ?? ""),
    id: String(item._id ?? item.id ?? ""),
    name: item.name ?? item.description ?? item.title ?? "",
    country_id: item.country_id ? String(item.country_id) : "",
  };
};

const normalizeInstitution = (institution) => {
  if (!institution) {
    return createDefaultFormData();
  }

  return {
    name: institution.name ?? "",
    address: institution.address ?? "",
    city: institution.city ?? "",
    country_id: institution.country_id ? String(institution.country_id) : "",
    state_id: institution.state_id ? String(institution.state_id) : "",
    zip_code: institution.zip_code ?? "",
    phone: institution.phone ?? "",
    phone2: institution.phone2 ?? "",
    fax: institution.fax ?? "",
    email: institution.email ?? "",
    web_site: institution.web_site ?? "",
    business_activity: institution.business_activity ?? "",
    rfc: institution.rfc ?? "",
  };
};

export const InstitutionFormPage = ({
  accessToken,
  refreshToken,
  mode = "create",
  institutionId = null,
  initialInstitution = null,
  countries = [],
  states = [],
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    normalizeInstitution(initialInstitution),
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const normalizedCountries = useMemo(
    () => (countries || []).map(normalizeCatalogItem).filter(Boolean),
    [countries],
  );
  const normalizedStates = useMemo(
    () => (states || []).map(normalizeCatalogItem).filter(Boolean),
    [states],
  );

  const filteredStates = useMemo(() => {
    if (!formData.country_id) return [];
    return normalizedStates.filter(
      (state) => String(state.country_id) === String(formData.country_id),
    );
  }, [formData.country_id, normalizedStates]);

  const selectedCountry =
    normalizedCountries.find(
      (country) => String(country._id) === String(formData.country_id),
    ) || null;

  const selectedState =
    filteredStates.find(
      (state) => String(state._id) === String(formData.state_id),
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
      country_id: formData.country_id || null,
      state_id: formData.state_id || null,
    };

    const request = mode === "edit"
      ? API_UpdateInstitution({
          accessToken,
          refreshToken,
          institutionId,
          payload,
        })
      : API_CreateInstitution({
          accessToken,
          refreshToken,
          payload,
        });

    const response = await request;
    setSubmitting(false);

    if (!response || response === true || response?.error) {
      setErrorMsg(response?.error || "No fue posible guardar la institucion.");
      setFieldErrors(response?.errors || {});
      return;
    }

    navigate("/mnemosine/movements/institutions");
  };

  return (
    <Box sx={{ maxWidth: 1100, margin: "0 auto", padding: 2 }}>
      <Paper elevation={4} sx={{ padding: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          {mode === "edit" ? "Editar institucion" : "Nueva institucion"}
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
                label="Direccion"
                value={formData.address}
                onChange={(event) => setField("address", event.target.value)}
                fullWidth
                required
                error={Boolean(fieldErrors.address)}
                helperText={fieldErrors.address || ""}
              />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Autocomplete
                options={normalizedCountries}
                value={selectedCountry}
                onChange={(event, value) => {
                  setField("country_id", value?._id || "");
                  setField("state_id", "");
                }}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                getOptionLabel={(option) => option?.name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Pais"
                    required
                    error={Boolean(fieldErrors.country_id)}
                    helperText={fieldErrors.country_id || ""}
                  />
                )}
                fullWidth
              />
              <Autocomplete
                options={filteredStates}
                value={selectedState}
                onChange={(event, value) => setField("state_id", value?._id || "")}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                getOptionLabel={(option) => option?.name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Estado"
                    error={Boolean(fieldErrors.state_id)}
                    helperText={fieldErrors.state_id || ""}
                  />
                )}
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Ciudad"
                value={formData.city}
                onChange={(event) => setField("city", event.target.value)}
                fullWidth
              />
              <TextField
                label="Codigo postal"
                value={formData.zip_code}
                onChange={(event) => setField("zip_code", event.target.value)}
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Telefono"
                value={formData.phone}
                onChange={(event) => setField("phone", event.target.value)}
                fullWidth
                required
                error={Boolean(fieldErrors.phone)}
                helperText={fieldErrors.phone || ""}
              />
              <TextField
                label="Telefono 2"
                value={formData.phone2}
                onChange={(event) => setField("phone2", event.target.value)}
                fullWidth
              />
              <TextField
                label="Fax"
                value={formData.fax}
                onChange={(event) => setField("fax", event.target.value)}
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Correo"
                value={formData.email}
                onChange={(event) => setField("email", event.target.value)}
                fullWidth
              />
              <TextField
                label="Sitio web"
                value={formData.web_site}
                onChange={(event) => setField("web_site", event.target.value)}
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Giro"
                value={formData.business_activity}
                onChange={(event) =>
                  setField("business_activity", event.target.value)
                }
                fullWidth
              />
              <TextField
                label="RFC"
                value={formData.rfc}
                onChange={(event) => setField("rfc", event.target.value)}
                fullWidth
              />
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate("/mnemosine/movements/institutions")}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting
                  ? "Guardando..."
                  : mode === "edit"
                    ? "Guardar cambios"
                    : "Crear institucion"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};
