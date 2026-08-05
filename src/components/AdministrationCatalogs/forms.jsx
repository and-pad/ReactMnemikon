import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  API_CreateCatalog,
  API_CreateCatalogElement,
  API_CreateGender,
  API_CreateSubgender,
  API_UpdateCatalog,
  API_UpdateCatalogElement,
  API_UpdateGender,
  API_UpdateSubgender,
} from "./api";

const toSlug = (value) =>
  (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const FormShell = ({
  title,
  subtitle = "",
  errorMsg,
  onSubmit,
  children,
  submitting,
  cancelPath,
  submitLabel,
}) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 900, margin: "0 auto", padding: 2 }}>
      <Paper elevation={4} sx={{ padding: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: 1 }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
            {subtitle}
          </Typography>
        ) : null}
        {errorMsg ? (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errorMsg}
          </Alert>
        ) : null}
        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={2}>
            {children}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate(cancelPath)}>
                Cancelar
              </Button>
              <Button variant="contained" type="submit" disabled={submitting}>
                {submitLabel}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export const CatalogFormPage = ({
  accessToken,
  refreshToken,
  mode = "create",
  catalogId = null,
  initialCatalog = null,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: initialCatalog?.code || "",
    title: initialCatalog?.title || "",
    description: initialCatalog?.description || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [codeTouched, setCodeTouched] = useState(Boolean(initialCatalog?.code));

  useEffect(() => {
    setFormData({
      code: initialCatalog?.code || "",
      title: initialCatalog?.title || "",
      description: initialCatalog?.description || "",
    });
    setCodeTouched(Boolean(initialCatalog?.code));
  }, [initialCatalog]);

  const handleTitleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      code: codeTouched ? prev.code : toSlug(value),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setFieldErrors({});

    const payload = {
      code: formData.code.trim(),
      title: formData.title.trim(),
      description: formData.description.trim(),
    };

    const response = mode === "edit"
      ? await API_UpdateCatalog({
          accessToken,
          refreshToken,
          catalogId,
          payload,
        })
      : await API_CreateCatalog({
          accessToken,
          refreshToken,
          payload,
        });

    setSubmitting(false);

    if (!response || response === true || response?.error) {
      setErrorMsg(response?.error || "No fue posible guardar el catalogo.");
      setFieldErrors(response?.errors || {});
      return;
    }

    navigate("/mnemosine/administration/catalogs_manage");
  };

  return (
    <FormShell
      title={mode === "edit" ? "Editar catalogo" : "Nuevo catalogo"}
      subtitle="Mantiene el esquema actual de catálogos basado en code, title y description."
      errorMsg={errorMsg}
      onSubmit={handleSubmit}
      submitting={submitting}
      cancelPath="/mnemosine/administration/catalogs_manage"
      submitLabel={mode === "edit" ? "Guardar cambios" : "Crear catalogo"}
    >
      <TextField
        label="Codigo"
        value={formData.code}
        onChange={(event) => {
          setCodeTouched(true);
          setFormData((prev) => ({ ...prev, code: toSlug(event.target.value) }));
        }}
        helperText={fieldErrors.code || "Se usa para referencias internas del sistema."}
        error={Boolean(fieldErrors.code)}
        fullWidth
        required
      />
      <TextField
        label="Titulo"
        value={formData.title}
        onChange={(event) => handleTitleChange(event.target.value)}
        helperText={fieldErrors.title || ""}
        error={Boolean(fieldErrors.title)}
        fullWidth
        required
      />
      <TextField
        label="Descripcion"
        value={formData.description}
        onChange={(event) =>
          setFormData((prev) => ({ ...prev, description: event.target.value }))
        }
        helperText={fieldErrors.description || ""}
        error={Boolean(fieldErrors.description)}
        fullWidth
        multiline
        minRows={3}
      />
    </FormShell>
  );
};

export const CatalogElementFormPage = ({
  accessToken,
  refreshToken,
  mode = "create",
  catalog = null,
  catalogId = null,
  elementId = null,
  initialElement = null,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: initialElement?.code || "",
    title: initialElement?.title || "",
    description: initialElement?.description || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    setFormData({
      code: initialElement?.code || "",
      title: initialElement?.title || "",
      description: initialElement?.description || "",
    });
  }, [initialElement]);

  const currentCatalogId = catalogId || catalog?._id || catalog?.id;
  const cancelPath = `/mnemosine/administration/catalogs_manage/${currentCatalogId}/elements`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setFieldErrors({});

    const payload = {
      code: formData.code.trim(),
      title: formData.title.trim(),
      description: formData.description.trim(),
    };

    const response = mode === "edit"
      ? await API_UpdateCatalogElement({
          accessToken,
          refreshToken,
          elementId,
          payload,
        })
      : await API_CreateCatalogElement({
          accessToken,
          refreshToken,
          catalogId: currentCatalogId,
          payload,
        });

    setSubmitting(false);

    if (!response || response === true || response?.error) {
      setErrorMsg(response?.error || "No fue posible guardar el elemento.");
      setFieldErrors(response?.errors || {});
      return;
    }

    navigate(cancelPath);
  };

  return (
    <FormShell
      title={mode === "edit" ? "Editar elemento de catalogo" : "Nuevo elemento de catalogo"}
      subtitle={`Catalogo padre: ${catalog?.title || "N/D"}`}
      errorMsg={errorMsg}
      onSubmit={handleSubmit}
      submitting={submitting}
      cancelPath={cancelPath}
      submitLabel={mode === "edit" ? "Guardar cambios" : "Crear elemento"}
    >
      <TextField
        label="Codigo"
        value={formData.code}
        onChange={(event) =>
          setFormData((prev) => ({ ...prev, code: event.target.value }))
        }
        helperText={fieldErrors.code || "Opcional. Solo usar si el catálogo lo requiere."}
        error={Boolean(fieldErrors.code)}
        fullWidth
      />
      <TextField
        label="Titulo"
        value={formData.title}
        onChange={(event) =>
          setFormData((prev) => ({ ...prev, title: event.target.value }))
        }
        helperText={fieldErrors.title || ""}
        error={Boolean(fieldErrors.title)}
        fullWidth
        required
      />
      <TextField
        label="Descripcion"
        value={formData.description}
        onChange={(event) =>
          setFormData((prev) => ({ ...prev, description: event.target.value }))
        }
        helperText={fieldErrors.description || ""}
        error={Boolean(fieldErrors.description)}
        fullWidth
        multiline
        minRows={3}
      />
    </FormShell>
  );
};

export const GenderFormPage = ({
  accessToken,
  refreshToken,
  mode = "create",
  genderId = null,
  initialGender = null,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: initialGender?.title || "",
    description: initialGender?.description || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    setFormData({
      title: initialGender?.title || "",
      description: initialGender?.description || "",
    });
  }, [initialGender]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setFieldErrors({});

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
    };

    const response = mode === "edit"
      ? await API_UpdateGender({
          accessToken,
          refreshToken,
          genderId,
          payload,
        })
      : await API_CreateGender({
          accessToken,
          refreshToken,
          payload,
        });

    setSubmitting(false);

    if (!response || response === true || response?.error) {
      setErrorMsg(response?.error || "No fue posible guardar el genero.");
      setFieldErrors(response?.errors || {});
      return;
    }

    navigate("/mnemosine/administration/catalog_genders");
  };

  return (
    <FormShell
      title={mode === "edit" ? "Editar genero" : "Nuevo genero"}
      errorMsg={errorMsg}
      onSubmit={handleSubmit}
      submitting={submitting}
      cancelPath="/mnemosine/administration/catalog_genders"
      submitLabel={mode === "edit" ? "Guardar cambios" : "Crear genero"}
    >
      <TextField
        label="Titulo"
        value={formData.title}
        onChange={(event) =>
          setFormData((prev) => ({ ...prev, title: event.target.value }))
        }
        helperText={fieldErrors.title || ""}
        error={Boolean(fieldErrors.title)}
        fullWidth
        required
      />
      <TextField
        label="Descripcion"
        value={formData.description}
        onChange={(event) =>
          setFormData((prev) => ({ ...prev, description: event.target.value }))
        }
        helperText={fieldErrors.description || ""}
        error={Boolean(fieldErrors.description)}
        fullWidth
        multiline
        minRows={3}
      />
    </FormShell>
  );
};

export const SubgenderFormPage = ({
  accessToken,
  refreshToken,
  mode = "create",
  gender = null,
  genderId = null,
  subgenderId = null,
  initialSubgender = null,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: initialSubgender?.title || "",
    description: initialSubgender?.description || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    setFormData({
      title: initialSubgender?.title || "",
      description: initialSubgender?.description || "",
    });
  }, [initialSubgender]);

  const currentGenderId = genderId || gender?._id || gender?.id;
  const cancelPath = `/mnemosine/administration/catalog_genders/${currentGenderId}/subgenders`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setFieldErrors({});

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
    };

    const response = mode === "edit"
      ? await API_UpdateSubgender({
          accessToken,
          refreshToken,
          subgenderId,
          payload,
        })
      : await API_CreateSubgender({
          accessToken,
          refreshToken,
          genderId: currentGenderId,
          payload,
        });

    setSubmitting(false);

    if (!response || response === true || response?.error) {
      setErrorMsg(response?.error || "No fue posible guardar el subgenero.");
      setFieldErrors(response?.errors || {});
      return;
    }

    navigate(cancelPath);
  };

  return (
    <FormShell
      title={mode === "edit" ? "Editar subgenero" : "Nuevo subgenero"}
      subtitle={`Genero padre: ${gender?.title || "N/D"}`}
      errorMsg={errorMsg}
      onSubmit={handleSubmit}
      submitting={submitting}
      cancelPath={cancelPath}
      submitLabel={mode === "edit" ? "Guardar cambios" : "Crear subgenero"}
    >
      <TextField
        label="Titulo"
        value={formData.title}
        onChange={(event) =>
          setFormData((prev) => ({ ...prev, title: event.target.value }))
        }
        helperText={fieldErrors.title || ""}
        error={Boolean(fieldErrors.title)}
        fullWidth
        required
      />
      <TextField
        label="Descripcion"
        value={formData.description}
        onChange={(event) =>
          setFormData((prev) => ({ ...prev, description: event.target.value }))
        }
        helperText={fieldErrors.description || ""}
        error={Boolean(fieldErrors.description)}
        fullWidth
        multiline
        minRows={3}
      />
    </FormShell>
  );
};
