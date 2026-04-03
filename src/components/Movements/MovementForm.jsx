import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Autocomplete,
  Button,
  Chip,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  API_CreateMovement,
  API_RequestMovementEdit,
  API_RequestMovementNew,
  API_RequestMovementContacts,
  API_RequestMovementExhibitions,
  API_RequestMovementVenues,
  API_UpdateMovement,
} from "./APICalls";

const normalizeItem = (item) => {
  if (!item) return null;

  const id = item._id ?? item.id ?? item.value ?? null;

  return {
    ...item,
    _id: id,
    id,
    name: item.name ?? item.title ?? item.label ?? "",
    title: item.title ?? item.name ?? item.label ?? "",
    fullName:
      item.fullName ??
      [item.name, item.last_name].filter(Boolean).join(" ").trim() ??
      "",
    institution_id:
      item.institution_id ??
      item.institutionId ??
      item.institution?._id ??
      item.institution?.id ??
      null,
  };
};

const normalizeList = (list) =>
  Array.isArray(list) ? list.map(normalizeItem).filter(Boolean) : [];

const today = () => new Date().toISOString().split("T")[0];

const createDefaultFormData = (internalInstitutionId = "") => ({
  movement_type: "external",
  itinerant: true,
  institution_ids: [],
  internal_institution_id: internalInstitutionId,
  contact_ids: [],
  guard_contact_ids: [],
  exhibition_id: "",
  venues: [],
  departure_date: today(),
  start_exposure: today(),
  end_exposure: "",
  observations: "",
  paso2: true,
  p1: 1,
});

const normalizeMovementResponse = (movement, internalInstitutionId = "") => {
  if (!movement) {
    return createDefaultFormData(internalInstitutionId);
  }

  return {
    movement_type: movement.movement_type ?? "external",
    itinerant: Boolean(movement.itinerant),
    institution_ids: (movement.institution_ids ?? []).map(String),
    internal_institution_id: String(
      movement.internal_institution_id ?? internalInstitutionId ?? "",
    ),
    contact_ids: (movement.contact_ids ?? []).map(String),
    guard_contact_ids: (movement.guard_contact_ids ?? []).map(String),
    exhibition_id: movement.exhibition_id ? String(movement.exhibition_id) : "",
    venues: (movement.venues ?? []).map(String),
    departure_date: movement.departure_date ?? today(),
    start_exposure:
      movement.start_exposure ??
      (movement.movement_type === "restoration" ? "" : today()),
    end_exposure: movement.end_exposure ?? "",
    observations: movement.observations ?? "",
    paso2: movement.paso2 ?? true,
    p1: 1,
  };
};

const SectionPaper = ({ children, sx = {} }) => (
  <Paper
    elevation={6}
    sx={{
      paddingLeft: 1,
      paddingRight: 1,
      paddingTop: 1,
      paddingBottom: 1,
      marginBottom: 1.5,
      ...sx,
    }}
  >
    {children}
  </Paper>
);

const MovementMultiSelectField = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  optionLabel = "name",
  required = false,
}) => (
  <SectionPaper>
    <Autocomplete
      multiple
      options={options || []}
      value={value || []}
      onChange={(event, newValue) => onChange(newValue)}
      isOptionEqualToValue={(option, selected) =>
        (option?._id ?? option?.id) === (selected?._id ?? selected?.id)
      }
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option?.[optionLabel] || ""
      }
      renderValue={(selected, getItemProps) =>
        selected.map((item, index) => {
          const { ...itemProps } = getItemProps({ index });
          return (
            <Chip
              key={item?._id ?? item?.id ?? `${label}-${index}`}
              label={item?.[optionLabel] || ""}
              {...itemProps}
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
  {...params}
  label={label}
  placeholder={placeholder}
  size="small"
  error={required && (!value || value.length === 0)}
  helperText={
    required && (!value || value.length === 0)
      ? "Este campo es obligatorio"
      : ""
  }
/>
      )}
    />
  </SectionPaper>
);

const MovementOptionField = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  optionLabel = "name",
  required = false,
}) => (
  <SectionPaper>
    <Autocomplete
      options={options || []}
      value={value || null}
      onChange={(event, newValue) => onChange(newValue)}
      isOptionEqualToValue={(option, selected) =>
        (option?._id ?? option?.id) === (selected?._id ?? selected?.id)
      }
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option?.[optionLabel] || ""
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          size="small"
          required={required}
        />
      )}
    />
  </SectionPaper>
);

const findSelectedItems = (options, selectedIds) => {
  const ids = new Set((selectedIds || []).map(String));
  return (options || []).filter((item) => ids.has(String(item._id ?? item.id)));
};

const findSelectedItem = (options, selectedId) => {
  if (!selectedId) return null;
  return (
    (options || []).find(
      (item) => String(item._id ?? item.id) === String(selectedId),
    ) ?? null
  );
};

export const MovementFormPage = ({
  accessToken,
  refreshToken,
  mode = "create",
  movementId = null,
}) => {
  const navigate = useNavigate();
  const [catalogs, setCatalogs] = useState(null);
  const [dynamicCatalogs, setDynamicCatalogs] = useState({
    contacts: [],
    exhibitions: [],
    venues: [],
  });
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let active = true;

    const requestFn =
      mode === "edit" && movementId
        ? API_RequestMovementEdit({
            accessToken,
            refreshToken,
            movementId,
          })
        : API_RequestMovementNew({
            accessToken,
            refreshToken,
          });

    requestFn
      .then((data) => {
        if (!active) return;

        const institutions = normalizeList(
          data?.institutions || data?.instituciones || [],
        );
        const internalInstitution = normalizeItem(
          data?.internal_institution ||
            data?.internalInstitution ||
            institutions.find((item) => item?.is_internal) || {
              id: "",
              name: "Institución interna",
            },
        );

        setCatalogs({
          institutions: institutions.filter(
            (item) =>
              String(item._id ?? item.id) !==
              String(internalInstitution?._id ?? internalInstitution?.id ?? ""),
          ),
          internalInstitution,
        });

        setDynamicCatalogs({
          contacts: normalizeList(data?.contacts || []),
          exhibitions: normalizeList(data?.exhibitions || []),
          venues: normalizeList(data?.venues || []),
        });

        setFormData(
          normalizeMovementResponse(
            data?.movement,
            String(internalInstitution?._id ?? internalInstitution?.id ?? ""),
          ),
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar formulario de movimiento", error);
        if (!active) return;

        const internalInstitution = { _id: "", id: "", name: "Institución interna" };
        setCatalogs({
          institutions: [],
          internalInstitution,
        });
        setDynamicCatalogs({ contacts: [], exhibitions: [], venues: [] });
        setFormData(
          createDefaultFormData(String(internalInstitution._id ?? internalInstitution.id)),
        );
        setErrorMsg("No fue posible cargar los catálogos del formulario.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, mode, movementId]);

  const selectedInstitutionIds = useMemo(() => {
    if (!formData || !catalogs) return [];
    if (formData.movement_type === "internal") {
      const internalId =
        formData.internal_institution_id ??
        catalogs.internalInstitution?._id ??
        catalogs.internalInstitution?.id ??
        "";
      return internalId ? [String(internalId)] : [];
    }
    return (formData.institution_ids || []).map(String);
  }, [catalogs, formData]);

  const selectedInstitutionIdsKey = useMemo(
    () => selectedInstitutionIds.join(","),
    [selectedInstitutionIds],
  );

  useEffect(() => {
    let active = true;
    const institutionIds = selectedInstitutionIdsKey
      ? selectedInstitutionIdsKey.split(",").filter(Boolean)
      : [];

    if (institutionIds.length === 0) {
      return;
    }

    Promise.all([
      API_RequestMovementContacts({
        accessToken,
        refreshToken,
        institutionIds,
      }),
      API_RequestMovementExhibitions({
        accessToken,
        refreshToken,
        institutionIds,
      }),
      API_RequestMovementVenues({
        accessToken,
        refreshToken,
        institutionIds,
      }),
    ])
      .then(([contacts, exhibitions, venues]) => {
        if (!active) return;

        const normalizedContacts = normalizeList(contacts);
        const normalizedExhibitions = normalizeList(exhibitions);
        const normalizedVenues = normalizeList(venues);

        setDynamicCatalogs({
          contacts: normalizedContacts,
          exhibitions: normalizedExhibitions,
          venues: normalizedVenues,
        });

        setFormData((prev) => {
          if (!prev) return prev;

          const validContactIds = new Set(
            normalizedContacts.map((item) => String(item._id ?? item.id)),
          );
          const validExhibitionIds = new Set(
            normalizedExhibitions.map((item) => String(item._id ?? item.id)),
          );
          const validVenueIds = new Set(
            normalizedVenues.map((item) => String(item._id ?? item.id)),
          );

          return {
            ...prev,
            contact_ids: (prev.contact_ids || []).filter((id) =>
              validContactIds.has(String(id)),
            ),
            guard_contact_ids: (prev.guard_contact_ids || []).filter((id) =>
              validContactIds.has(String(id)),
            ),
            exhibition_id: validExhibitionIds.has(String(prev.exhibition_id))
              ? prev.exhibition_id
              : "",
            venues: (prev.venues || []).filter((id) =>
              validVenueIds.has(String(id)),
            ),
          };
        });
      })
      .catch((error) => {
        console.error("Error al cargar catálogos dependientes", error);
        if (!active) return;
        setDynamicCatalogs({ contacts: [], exhibitions: [], venues: [] });
        setErrorMsg("No fue posible cargar contactos, exposiciones y sedes.");
      });

    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, selectedInstitutionIdsKey]);

  if (loading || !formData || !catalogs) {
    return (
      <div className="container mt-3">
        <Typography variant="body1">Cargando formulario de movimiento...</Typography>
      </div>
    );
  }

  const showInternalInstitution = formData.movement_type === "internal";
  const showExternalInstitutions = formData.movement_type !== "internal";
  const showItinerant = formData.movement_type === "external";
  const showExposureDates = formData.movement_type !== "restoration";
  const showVenue = formData.movement_type !== "internal";

  const contactsValue = findSelectedItems(dynamicCatalogs.contacts, formData.contact_ids);
  const guardContactsValue = findSelectedItems(
    dynamicCatalogs.contacts,
    formData.guard_contact_ids,
  );
  const institutionsValue = findSelectedItems(
    catalogs.institutions,
    formData.institution_ids,
  );
  const exhibitionValue = findSelectedItem(
    dynamicCatalogs.exhibitions,
    formData.exhibition_id,
  );
  const venuesValue = findSelectedItems(dynamicCatalogs.venues, formData.venues);

  const setField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMovementTypeChange = (value) => {
    setErrorMsg("");
    setDynamicCatalogs({ contacts: [], exhibitions: [], venues: [] });
    setFormData((prev) => ({
      ...prev,
      movement_type: value,
      itinerant: value === "external" ? prev.itinerant : false,
      institution_ids: [],
      contact_ids: [],
      guard_contact_ids: [],
      exhibition_id: "",
      venues: [],
      start_exposure: value === "restoration" ? "" : prev.start_exposure || today(),
      end_exposure: value === "restoration" ? "" : prev.end_exposure,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    console.log("formData a enviar", formData);

    const payload = {
      movement_type: formData.movement_type,
      itinerant: formData.movement_type === "external" && formData.itinerant ? "1" : "0",
      institution_ids:
        formData.movement_type === "internal" ? [] : (formData.institution_ids || []),
      internal_institution_id:
        formData.internal_institution_id ||
        catalogs.internalInstitution?._id ||
        catalogs.internalInstitution?.id ||
        null,
      contact_ids: formData.contact_ids || [],
      guard_contact_ids: formData.guard_contact_ids || [],
      exhibition_id: formData.exhibition_id || null,
      venues: formData.movement_type === "internal" ? [] : formData.venues || [],
      departure_date: formData.departure_date,
      start_exposure: showExposureDates ? formData.start_exposure : "",
      end_exposure: showExposureDates ? formData.end_exposure : "",
      observations: formData.observations,
      paso2: formData.paso2 ? "1" : "0",
      p1: 1,
    };

    const requestFn =
      mode === "edit"
        ? API_UpdateMovement({
            accessToken,
            refreshToken,
            movementId,
            payload,
          })
        : API_CreateMovement({
            accessToken,
            refreshToken,
            payload,
          });

    const result = await requestFn;
    setSubmitting(false);

    if (!result || result === true || result?.error) {
      setErrorMsg(result?.error || "No fue posible guardar el movimiento.");
      return;
    }

    const savedMovementId =
      result?.id ?? result?._id ?? result?.movement_id ?? movementId ?? null;

    if (formData.paso2 && savedMovementId) {
      navigate(`/mnemosine/movements/manage/select-pieces/${savedMovementId}`);
      return;
    }

    navigate("/mnemosine/movements/manage");
  };

  return (
    <div className="container mt-3 mb-5">
      <div className="card card-accent-info" style={{ background: "#abcc" }}>
        <h5 className="card-header bg-primary text-white">
          Paso 1 - Datos generales
        </h5>
        <div className="card-body">
          {errorMsg ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          ) : null}

          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-sm-12 col-md-7">
                <SectionPaper>
                  <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
                    Tipo de movimiento
                  </Typography>
                  <div className="d-flex flex-wrap gap-3">
                    <label>
                      <input
                        type="radio"
                        name="movement_type"
                        value="external"
                        checked={formData.movement_type === "external"}
                        onChange={() => handleMovementTypeChange("external")}
                      />{" "}
                      Externo
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="movement_type"
                        value="internal"
                        checked={formData.movement_type === "internal"}
                        onChange={() => handleMovementTypeChange("internal")}
                      />{" "}
                      Interno
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="movement_type"
                        value="restoration"
                        checked={formData.movement_type === "restoration"}
                        onChange={() => handleMovementTypeChange("restoration")}
                      />{" "}
                      Restauración externa
                    </label>
                  </div>
                </SectionPaper>
              </div>

              <div className="col-sm-12 col-md-5">
                {showItinerant ? (
                  <SectionPaper>
                    <div className="d-flex align-items-center justify-content-between">
                      <Typography variant="body2">Itinerante</Typography>
                      <Switch
                        checked={Boolean(formData.itinerant)}
                        onChange={(event) => setField("itinerant", event.target.checked)}
                      />
                    </div>
                  </SectionPaper>
                ) : null}
              </div>
            </div>

            {showInternalInstitution ? (
              <div className="row mb-3">
                <div className="col">
                  <SectionPaper>
                    <Typography variant="caption">Institución</Typography>
                    <Typography variant="body1">
                      {catalogs.internalInstitution?.name || "Institución interna"}
                    </Typography>
                  </SectionPaper>
                </div>
              </div>
            ) : null}

            {showExternalInstitutions ? (
              <div className="row mb-3">
                <div className="col">
                  <MovementMultiSelectField
                    label="Institución"
                    placeholder="Selecciona una o varias instituciones"
                    options={catalogs.institutions}
                    value={institutionsValue}
                    onChange={(newValue) => {
                      setDynamicCatalogs({ contacts: [], exhibitions: [], venues: [] });
                      setFormData((prev) => ({
                        ...prev,
                        institution_ids: newValue.map((item) =>
                          String(item._id ?? item.id),
                        ),
                        contact_ids: [],
                        guard_contact_ids: [],
                        exhibition_id: "",
                        venues: [],
                      }));
                    }}
                  />
                </div>
              </div>
            ) : null}

            <div className="row border border-primary mb-3 mx-0">
              <div className="col-12 bg-primary text-white py-1 mb-3">
                <strong>Contactos responsables</strong>
              </div>
              <div className="col-12">
                <MovementMultiSelectField
                  label="Movimiento"
                  placeholder="Selecciona contactos"
                  options={dynamicCatalogs.contacts}
                  value={contactsValue}
                  optionLabel="fullName"
                  onChange={(newValue) =>
                    setField(
                      "contact_ids",
                      newValue.map((item) => String(item._id ?? item.id)),
                    )
                  }
                  required
                />
              </div>
              <div className="col-12">
                <MovementMultiSelectField
                  label="Resguardo"
                  placeholder="Selecciona contactos"
                  options={dynamicCatalogs.contacts}
                  value={guardContactsValue}
                  optionLabel="fullName"
                  onChange={(newValue) =>
                    setField(
                      "guard_contact_ids",
                      newValue.map((item) => String(item._id ?? item.id)),
                    )
                  }
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <MovementOptionField
                  label="Ubicación / Exposición"
                  placeholder="Selecciona una exposición"
                  options={dynamicCatalogs.exhibitions}
                  value={exhibitionValue}
                  onChange={(newValue) =>
                    setField("exhibition_id", newValue ? String(newValue._id ?? newValue.id) : "")
                  }
                  required
                />
              </div>
            </div>

            {showVenue ? (
              <div className="row mb-3">
                <div className="col">
                  {formData.itinerant ? (
                    <MovementMultiSelectField
                      label="Sede"
                      placeholder="Selecciona una o varias sedes"
                      options={dynamicCatalogs.venues}
                      value={venuesValue}
                      onChange={(newValue) =>
                        setField(
                          "venues",
                          newValue.map((item) => String(item._id ?? item.id)),
                        )
                      }
                    />
                  ) : (
                    <MovementOptionField
                      label="Sede"
                      placeholder="Selecciona una sede"
                      options={dynamicCatalogs.venues}
                      value={venuesValue[0] || null}
                      onChange={(newValue) =>
                        setField(
                          "venues",
                          newValue ? [String(newValue._id ?? newValue.id)] : [],
                        )
                      }
                    />
                  )}
                </div>
              </div>
            ) : null}

            <div className="row mb-3">
              <div className="col">
                <SectionPaper>
                  <TextField
                    fullWidth
                    type="date"
                    size="small"
                    label="Fecha de salida"
                    InputLabelProps={{ shrink: true }}
                    value={formData.departure_date || ""}
                    onChange={(event) => setField("departure_date", event.target.value)}
                  />
                </SectionPaper>
              </div>
            </div>

            {showExposureDates ? (
              <>
                <div className="row mb-3">
                  <div className="col">
                    <SectionPaper>
                      <TextField
                        fullWidth
                        type="date"
                        size="small"
                        label="Fecha inicial de exhibición"
                        InputLabelProps={{ shrink: true }}
                        value={formData.start_exposure || ""}
                        onChange={(event) =>
                          setField("start_exposure", event.target.value)
                        }
                      />
                    </SectionPaper>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <SectionPaper>
                      <TextField
                        fullWidth
                        type="date"
                        size="small"
                        label="Fecha final de exhibición"
                        InputLabelProps={{ shrink: true }}
                        value={formData.end_exposure || ""}
                        onChange={(event) => setField("end_exposure", event.target.value)}
                      />
                    </SectionPaper>
                  </div>
                </div>
              </>
            ) : null}

            <div className="row mb-3">
              <div className="col">
                <SectionPaper>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    size="small"
                    label="Observaciones"
                    value={formData.observations || ""}
                    onChange={(event) => setField("observations", event.target.value)}
                  />
                </SectionPaper>
              </div>
            </div>

            <div className="text-center mb-3">
              <label className="d-inline-flex align-items-center gap-2 text-danger">
                <input
                  type="checkbox"
                  checked={Boolean(formData.paso2)}
                  onChange={(event) => setField("paso2", event.target.checked)}
                />
                Ir al paso 2
              </label>
            </div>

            <div className="text-center mb-3">
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mr: 1 }}
                onClick={() => navigate("/mnemosine/movements/manage")}
              >
                Cancelar
              </Button>
              <Button variant="contained" color="primary" type="submit" disabled={submitting}>
                {mode === "edit" ? "Guardar movimiento" : "Crear movimiento"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
