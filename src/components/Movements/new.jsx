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
import { API_CreateMovement, API_RequestMovementNew } from "./APICalls";

const normalizeItem = (item) => {
  if (!item) return null;
  return {
    ...item,
    _id: item._id ?? item.id ?? item.value ?? null,
    id: item.id ?? item._id ?? item.value ?? null,
    name: item.name ?? item.title ?? item.label ?? "",
    title: item.title ?? item.name ?? item.label ?? "",
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
}) => {
  return (
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
            const { key, ...itemProps } = getItemProps({ index });
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
          />
        )}
      />
    </SectionPaper>
  );
};

const MovementOptionField = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  optionLabel = "name",
}) => {
  return (
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
          />
        )}
      />
    </SectionPaper>
  );
};

export const NewMovement = ({ accessToken, refreshToken, permissions }) => {
  const navigate = useNavigate();
  const [catalogs, setCatalogs] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    API_RequestMovementNew({ accessToken, refreshToken })
      .then((data) => {
        const institutions = normalizeList(
          data?.institutions || data?.instituciones || [],
        );
        const contacts = normalizeList(data?.contacts || data?.contactos || []);
        const exhibitions = normalizeList(data?.exhibitions || data?.expos || []);
        const venues = normalizeList(data?.venues || data?.sedes || []);
        const internalInstitution = normalizeItem(
          data?.internal_institution ||
          data?.internalInstitution ||
          institutions.find((item) => Number(item.id ?? item._id) === 1) || {
            id: 1,
            name: "Institución interna",
          },
        );

        setCatalogs({
          institutions,
          contacts,
          exhibitions,
          venues,
          internalInstitution,
        });

        setFormData({
          movement_type: "external",
          itinerant: true,
          institution_ids: [],
          internal_institution_id: internalInstitution,
          contact_ids: [],
          guard_contact_ids: [],
          exhibition_id: null,
          venues: [],
          departure_date: today(),
          start_exposure: today(),
          end_exposure: "",
          observations: "",
          paso2: true,
          p1: 1,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar catálogos de movimientos", error);
        setCatalogs({
          institutions: [],
          contacts: [],
          exhibitions: [],
          venues: [],
          internalInstitution: { id: 1, _id: 1, name: "Institución interna" },
        });
        setFormData({
          movement_type: "external",
          itinerant: true,
          institution_ids: [],
          internal_institution_id: {
            id: 1,
            _id: 1,
            name: "Institución interna",
          },
          contact_ids: [],
          guard_contact_ids: [],
          exhibition_id: null,
          venues: [],
          departure_date: today(),
          start_exposure: today(),
          end_exposure: "",
          observations: "",
          paso2: true,
          p1: 1,
        });
        setErrorMsg(
          "No fue posible cargar los catálogos del formulario. Puedes revisar la API de movimientos.",
        );
        setLoading(false);
      });
  }, [accessToken, refreshToken]);

  const selectedInstitutionIds = useMemo(() => {
    if (!formData || !catalogs) return [];
    if (formData.movement_type === "internal") {
      return [
        String(
          formData.internal_institution_id?._id ??
          formData.internal_institution_id?.id ??
          "",
        ),
      ];
    }
    return (formData.institution_ids || []).map((item) =>
      String(item?._id ?? item?.id ?? ""),
    );
  }, [formData, catalogs]);

  const filteredContacts = useMemo(() => {
    if (!catalogs) return [];
    if (selectedInstitutionIds.length === 0) return catalogs.contacts;
    return catalogs.contacts.filter((item) =>
      selectedInstitutionIds.includes(String(item.institution_id ?? "")),
    );
  }, [catalogs, selectedInstitutionIds]);

  const filteredExhibitions = useMemo(() => {
    if (!catalogs) return [];
    if (selectedInstitutionIds.length === 0) return catalogs.exhibitions;
    return catalogs.exhibitions.filter((item) =>
      selectedInstitutionIds.includes(String(item.institution_id ?? "")),
    );
  }, [catalogs, selectedInstitutionIds]);

  const filteredVenues = useMemo(() => {
    if (!catalogs) return [];
    if (selectedInstitutionIds.length === 0) return catalogs.venues;
    return catalogs.venues.filter((item) =>
      selectedInstitutionIds.includes(String(item.institution_id ?? "")),
    );
  }, [catalogs, selectedInstitutionIds]);

  useEffect(() => {
    if (!formData) return;

    if (formData.movement_type === "internal") {
      setFormData((prev) => ({
        ...prev,
        itinerant: false,
        institution_ids: [],
        venues: [],
      }));
      return;
    }

    if (formData.movement_type === "restoration") {
      setFormData((prev) => ({
        ...prev,
        itinerant: false,
      }));
    }
  }, [formData?.movement_type]);

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

  const setField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMovementTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      movement_type: value,
      institution_ids: value === "internal" ? [] : prev.institution_ids,
      contact_ids: [],
      guard_contact_ids: [],
      exhibition_id: null,
      venues: [],
      start_exposure: value === "restoration" ? "" : prev.start_exposure || today(),
      end_exposure: value === "restoration" ? "" : prev.end_exposure,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const payload = {
      movement_type: formData.movement_type,
      itinerant: formData.movement_type === "external" && formData.itinerant ? "1" : "0",
      institution_ids:
        formData.movement_type === "internal"
          ? []
          : (formData.institution_ids || []).map((item) => item._id ?? item.id),
      internal_institution_id:
        formData.internal_institution_id?._id ??
        formData.internal_institution_id?.id ??
        null,
      contact_ids: (formData.contact_ids || []).map((item) => item._id ?? item.id),
      guard_contact_ids: (formData.guard_contact_ids || []).map(
        (item) => item._id ?? item.id,
      ),
      exhibition_id: formData.exhibition_id?._id ?? formData.exhibition_id?.id ?? null,
      venues:
        formData.movement_type === "internal"
          ? ["9"]
          : (formData.venues || []).map((item) => item._id ?? item.id),
      departure_date: formData.departure_date,
      start_exposure: showExposureDates ? formData.start_exposure : "",
      end_exposure: showExposureDates ? formData.end_exposure : "",
      observations: formData.observations,
      paso2: formData.paso2 ? "1" : "0",
      p1: 1,
    };

    const result = await API_CreateMovement({
      accessToken,
      refreshToken,
      payload,
    });

    setSubmitting(false);

    if (!result || result === true) {
      setErrorMsg("No fue posible guardar el movimiento.");
      return;
    }

    const movementId = result?.id ?? result?._id ?? result?.movement_id ?? null;
    if (formData.paso2 && movementId) {
      navigate(`/mnemosine/movements/select-pieces/${movementId}`);
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
                    value={formData.institution_ids}
                    onChange={(newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        institution_ids: newValue,
                        contact_ids: [],
                        guard_contact_ids: [],
                        exhibition_id: null,
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
                  options={filteredContacts}
                  value={formData.contact_ids}
                  onChange={(newValue) => setField("contact_ids", newValue)}
                />
              </div>
              <div className="col-12">
                <MovementMultiSelectField
                  label="Resguardo"
                  placeholder="Selecciona contactos"
                  options={filteredContacts}
                  value={formData.guard_contact_ids}
                  onChange={(newValue) => setField("guard_contact_ids", newValue)}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <MovementOptionField
                  label="Ubicación / Exposición"
                  placeholder="Selecciona una exposición"
                  options={filteredExhibitions}
                  value={formData.exhibition_id}
                  onChange={(newValue) => setField("exhibition_id", newValue)}
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
                      options={filteredVenues}
                      value={formData.venues}
                      onChange={(newValue) => setField("venues", newValue)}
                    />
                  ) : (
                    <MovementOptionField
                      label="Sede"
                      placeholder="Selecciona una sede"
                      options={filteredVenues}
                      value={(formData.venues || [])[0] || null}
                      onChange={(newValue) =>
                        setField("venues", newValue ? [newValue] : [])
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
                        onChange={(event) =>
                          setField("end_exposure", event.target.value)
                        }
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
                Crear movimiento
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
