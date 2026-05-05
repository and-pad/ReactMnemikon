import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  API_CreateReport,
  API_CreateReportTemplate,
  API_DeleteReportTemplate,
  API_RequestReportPieces,
  API_UpdateReport,
} from "./api";

const steps = [
  "Columnas",
  "Prestamo",
  "Piezas",
];

const createDefaultFormData = () => ({
  name: "",
  description: "",
  selectedColumns: [],
  custom_order: false,
  ordered_columns: [],
  lending_list: false,
  institution: "",
  exhibition: "",
  exhibition_date_start: "",
  exhibition_date_end: "",
  select_type: "custom",
  pieces_ids: [],
});

const normalizeOption = (item) => ({
  ...item,
  id: String(item?.id ?? item?._id ?? ""),
  _id: String(item?.id ?? item?._id ?? ""),
  label: item?.label ?? item?.name ?? "",
  institution_id: item?.institution_id ? String(item.institution_id) : "",
});

const normalizeReport = (report) => {
  if (!report) return createDefaultFormData();

  const columnsList = (report.columns_list || []).map(String);

  return {
    name: report.name ?? "",
    description: report.description ?? "",
    selectedColumns: columnsList,
    custom_order: Boolean(report.custom_order),
    ordered_columns: columnsList,
    lending_list: Boolean(report.lending_list),
    institution: report.institution ? String(report.institution) : "",
    exhibition: report.exhibition ? String(report.exhibition) : "",
    exhibition_date_start: report.exhibition_date_start
      ? String(report.exhibition_date_start).slice(0, 10)
      : "",
    exhibition_date_end: report.exhibition_date_end
      ? String(report.exhibition_date_end).slice(0, 10)
      : "",
    select_type: report.select_type ?? "custom",
    pieces_ids: (report.pieces_ids || []).map(String),
  };
};

const reorderList = (list, draggedId, targetId) => {
  if (!draggedId || !targetId || draggedId === targetId) {
    return list;
  }

  const next = [...list];
  const fromIndex = next.indexOf(draggedId);
  const toIndex = next.indexOf(targetId);

  if (fromIndex === -1 || toIndex === -1) {
    return list;
  }

  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

export const ReportFormPage = ({
  accessToken,
  refreshToken,
  mode = "create",
  reportId = null,
  initialReport = null,
  columnsCatalog = [],
  institutions = [],
  exhibitions = [],
  initialTemplates = [],
}) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(normalizeReport(initialReport));
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [templates, setTemplates] = useState(initialTemplates || []);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateSaving, setTemplateSaving] = useState(false);
  const [piecesLoading, setPiecesLoading] = useState(false);
  const [piecesError, setPiecesError] = useState("");
  const [piecesSearch, setPiecesSearch] = useState("");
  const [piecesRows, setPiecesRows] = useState([]);
  const [piecesPage, setPiecesPage] = useState(0);
  const [piecesRowsPerPage, setPiecesRowsPerPage] = useState(10);
  const [piecesTotal, setPiecesTotal] = useState(0);
  const [draggedColumnId, setDraggedColumnId] = useState(null);

  const normalizedColumns = useMemo(
    () => (columnsCatalog || []).map(normalizeOption),
    [columnsCatalog],
  );
  const normalizedInstitutions = useMemo(
    () => (institutions || []).map(normalizeOption),
    [institutions],
  );
  const normalizedExhibitions = useMemo(
    () => (exhibitions || []).map(normalizeOption),
    [exhibitions],
  );

  const selectedColumnsSet = useMemo(
    () => new Set(formData.selectedColumns),
    [formData.selectedColumns],
  );

  const availableColumns = useMemo(
    () => normalizedColumns.filter((column) => !selectedColumnsSet.has(column.id)),
    [normalizedColumns, selectedColumnsSet],
  );

  const selectedColumnOptions = useMemo(
    () =>
      normalizedColumns.filter((column) => selectedColumnsSet.has(column.id)).sort(
        (a, b) => a.label.localeCompare(b.label),
      ),
    [normalizedColumns, selectedColumnsSet],
  );

  const orderedColumnOptions = useMemo(
    () =>
      formData.ordered_columns
        .map((columnId) => normalizedColumns.find((column) => column.id === columnId))
        .filter(Boolean),
    [formData.ordered_columns, normalizedColumns],
  );

  const filteredExhibitions = useMemo(() => {
    if (!formData.institution) return [];
    return normalizedExhibitions.filter(
      (item) => String(item.institution_id) === String(formData.institution),
    );
  }, [formData.institution, normalizedExhibitions]);

  const pieceSelectionLabel = formData.select_type === "all_except"
    ? "Piezas excluidas"
    : "Piezas seleccionadas";

  useEffect(() => {
    setTemplates(initialTemplates || []);
  }, [initialTemplates]);

  useEffect(() => {
    setFormData(normalizeReport(initialReport));
  }, [initialReport]);

  useEffect(() => {
    setFormData((prev) => {
      const nextOrdered = prev.ordered_columns.filter((id) =>
        prev.selectedColumns.includes(id),
      );
      const missing = prev.selectedColumns.filter((id) => !nextOrdered.includes(id));

      return {
        ...prev,
        ordered_columns: [...nextOrdered, ...missing],
      };
    });
  }, [formData.selectedColumns.length]);

  useEffect(() => {
    if (formData.select_type === "all") return;

    const loadPieces = async () => {
      setPiecesLoading(true);
      setPiecesError("");

      const response = await API_RequestReportPieces({
        accessToken,
        refreshToken,
        page: piecesPage + 1,
        pageSize: piecesRowsPerPage,
        search: piecesSearch,
      });

      if (!response || response?.error) {
        setPiecesError(response?.error || "No fue posible cargar las piezas.");
        setPiecesLoading(false);
        return;
      }

      setPiecesRows(response?.data || []);
      setPiecesTotal(response?.total || 0);
      setPiecesLoading(false);
    };

    loadPieces();
  }, [
    accessToken,
    refreshToken,
    formData.select_type,
    piecesPage,
    piecesRowsPerPage,
    piecesSearch,
  ]);

  const setField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const syncColumnLists = (nextSelectedColumns) => {
    setFormData((prev) => {
      const cleanedOrder = prev.ordered_columns.filter((id) =>
        nextSelectedColumns.includes(id),
      );
      const missing = nextSelectedColumns.filter((id) => !cleanedOrder.includes(id));

      return {
        ...prev,
        selectedColumns: nextSelectedColumns,
        ordered_columns: [...cleanedOrder, ...missing],
      };
    });
  };

  const addColumn = (columnId) => {
    if (!columnId || selectedColumnsSet.has(columnId)) return;
    syncColumnLists([...formData.selectedColumns, columnId]);
  };

  const removeColumn = (columnId) => {
    syncColumnLists(formData.selectedColumns.filter((item) => item !== columnId));
  };

  const applyTemplate = () => {
    const template = templates.find(
      (item) => String(item._id || item.id) === String(selectedTemplateId),
    );
    if (!template) return;

    const columns = (template.columns_list || []).map(String);
    setFormData((prev) => ({
      ...prev,
      selectedColumns: columns,
      ordered_columns: columns,
      custom_order: Boolean(template.is_custom),
    }));
  };

  const handleSaveTemplate = async () => {
    setTemplateSaving(true);
    setFieldErrors((prev) => ({ ...prev, template_name: undefined }));

    const payload = {
      name: templateName,
      is_custom: formData.custom_order,
      columns: formData.custom_order ? formData.ordered_columns : formData.selectedColumns,
    };

    const response = await API_CreateReportTemplate({
      accessToken,
      refreshToken,
      payload,
    });

    setTemplateSaving(false);

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible guardar la plantilla.");
      setFieldErrors((prev) => ({
        ...prev,
        template_name: response?.errors?.name || response?.errors?.clm_ord,
      }));
      return;
    }

    const createdTemplate = response?.template;
    const nextTemplates = [...templates, createdTemplate].sort((a, b) =>
      String(a.name || "").localeCompare(String(b.name || "")),
    );

    setTemplates(nextTemplates);
    setSelectedTemplateId(String(createdTemplate?._id || createdTemplate?.id || ""));
    setTemplateName("");
    setTemplateDialogOpen(false);
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplateId) return;

    const confirmed = window.confirm("Se eliminara la plantilla seleccionada. Deseas continuar?");
    if (!confirmed) return;

    const response = await API_DeleteReportTemplate({
      accessToken,
      refreshToken,
      templateId: selectedTemplateId,
    });

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible eliminar la plantilla.");
      return;
    }

    setTemplates((prev) =>
      prev.filter((item) => String(item._id || item.id) !== String(selectedTemplateId)),
    );
    setSelectedTemplateId("");
  };

  const togglePiece = (pieceId) => {
    setFormData((prev) => {
      const exists = prev.pieces_ids.includes(pieceId);
      return {
        ...prev,
        pieces_ids: exists
          ? prev.pieces_ids.filter((item) => item !== pieceId)
          : [...prev.pieces_ids, pieceId],
      };
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMsg("");
    setFieldErrors({});

    const payload = {
      name: formData.name,
      description: formData.description,
      columns: formData.selectedColumns,
      ordered_columns: formData.ordered_columns,
      custom_order: formData.custom_order,
      lending_list: formData.lending_list,
      institution: formData.lending_list ? formData.institution : null,
      exhibition: formData.lending_list ? formData.exhibition : null,
      exhibition_date_start: formData.lending_list
        ? formData.exhibition_date_start || null
        : null,
      exhibition_date_end: formData.lending_list
        ? formData.exhibition_date_end || null
        : null,
      select_type: formData.select_type,
      pieces_ids: formData.select_type === "all" ? [] : formData.pieces_ids,
    };

    const request = mode === "edit"
      ? API_UpdateReport({
          accessToken,
          refreshToken,
          reportId,
          payload,
        })
      : API_CreateReport({
          accessToken,
          refreshToken,
          payload,
        });

    const response = await request;
    setSubmitting(false);

    if (!response || response === true || response?.error) {
      setErrorMsg(response?.error || "No fue posible guardar el reporte.");
      setFieldErrors(response?.errors || {});
      return;
    }

    navigate("/mnemosine/reports");
  };

  return (
    <Box sx={{ maxWidth: 1280, margin: "0 auto", padding: 2 }}>
      <Paper elevation={4} sx={{ padding: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          {mode === "edit" ? "Editar reporte" : "Nuevo reporte"}
        </Typography>

        {errorMsg ? (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errorMsg}
          </Alert>
        ) : null}

        <Stepper activeStep={activeStep} sx={{ marginBottom: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box>
          <Stack spacing={3}>
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
                label="Descripcion"
                value={formData.description}
                onChange={(event) => setField("description", event.target.value)}
                fullWidth
                multiline
                minRows={2}
              />
            </Stack>

            {activeStep === 0 ? (
              <Stack spacing={2}>
                <Stack
                  direction={{ xs: "column", lg: "row" }}
                  spacing={2}
                  alignItems="stretch"
                >
                  <Paper variant="outlined" sx={{ flex: 1, padding: 2 }}>
                    <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                      Columnas disponibles
                    </Typography>
                    <Stack spacing={1} sx={{ maxHeight: 360, overflowY: "auto" }}>
                      {availableColumns.map((column) => (
                        <Button
                          type="button"
                          key={column.id}
                          variant="outlined"
                          onClick={() => addColumn(column.id)}
                          sx={{ justifyContent: "space-between" }}
                        >
                          <span>{column.label}</span>
                          <span>+</span>
                        </Button>
                      ))}
                      {!availableColumns.length ? (
                        <Typography variant="body2" color="text.secondary">
                          No hay mas columnas disponibles.
                        </Typography>
                      ) : null}
                    </Stack>
                  </Paper>

                  <Paper variant="outlined" sx={{ flex: 1, padding: 2 }}>
                    <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                      Columnas seleccionadas
                    </Typography>
                    <Stack spacing={1} sx={{ maxHeight: 360, overflowY: "auto" }}>
                      {selectedColumnOptions.map((column) => (
                        <Button
                          type="button"
                          key={column.id}
                          color="secondary"
                          variant="outlined"
                          onClick={() => removeColumn(column.id)}
                          sx={{ justifyContent: "space-between" }}
                        >
                          <span>{column.label}</span>
                          <span>-</span>
                        </Button>
                      ))}
                      {!selectedColumnOptions.length ? (
                        <Typography variant="body2" color="text.secondary">
                          Aun no has seleccionado columnas.
                        </Typography>
                      ) : null}
                    </Stack>
                  </Paper>
                </Stack>

                {fieldErrors.columns ? (
                  <Alert severity="error">{fieldErrors.columns}</Alert>
                ) : null}

                <Stack
                  direction={{ xs: "column", lg: "row" }}
                  spacing={2}
                  alignItems={{ xs: "stretch", lg: "center" }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.custom_order}
                        onChange={(event) => setField("custom_order", event.target.checked)}
                      />
                    }
                    label="Usar orden personalizado"
                  />

                  <TextField
                    select
                    label="Plantillas"
                    value={selectedTemplateId}
                    onChange={(event) => setSelectedTemplateId(event.target.value)}
                    sx={{ minWidth: 260 }}
                  >
                    <MenuItem value="">Selecciona una plantilla</MenuItem>
                    {templates.map((template) => (
                      <MenuItem
                        key={template._id || template.id}
                        value={String(template._id || template.id)}
                      >
                        {template.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Button
                    type="button"
                    variant="outlined"
                    onClick={applyTemplate}
                    disabled={!selectedTemplateId}
                  >
                    Aplicar plantilla
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => setTemplateDialogOpen(true)}
                    disabled={!formData.selectedColumns.length}
                  >
                    Guardar plantilla
                  </Button>
                  <Button
                    type="button"
                    color="error"
                    variant="outlined"
                    onClick={handleDeleteTemplate}
                    disabled={!selectedTemplateId}
                  >
                    Eliminar plantilla
                  </Button>
                </Stack>

                {formData.custom_order ? (
                  <Paper variant="outlined" sx={{ padding: 2 }}>
                    <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                      Orden de columnas
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                      Arrastra las filas para definir el orden final del reporte.
                    </Typography>
                    <Stack spacing={1}>
                      {orderedColumnOptions.map((column) => (
                        <Paper
                          key={column.id}
                          variant="outlined"
                          draggable
                          onDragStart={() => setDraggedColumnId(column.id)}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={() =>
                            setField(
                              "ordered_columns",
                              reorderList(formData.ordered_columns, draggedColumnId, column.id),
                            )
                          }
                          sx={{
                            padding: 1.5,
                            cursor: "grab",
                            backgroundColor: "#f4f4f4",
                          }}
                        >
                          {column.label}
                        </Paper>
                      ))}
                    </Stack>
                  </Paper>
                ) : null}
              </Stack>
            ) : null}

            {activeStep === 1 ? (
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.lending_list}
                      onChange={(event) => setField("lending_list", event.target.checked)}
                    />
                  }
                  label="Lista de prestamo"
                />

                {formData.lending_list ? (
                  <>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <TextField
                        select
                        label="Institucion"
                        value={formData.institution}
                        onChange={(event) => {
                          setField("institution", event.target.value);
                          setField("exhibition", "");
                        }}
                        fullWidth
                        required
                        error={Boolean(fieldErrors.institution)}
                        helperText={fieldErrors.institution || ""}
                      >
                        <MenuItem value="">Selecciona una institucion</MenuItem>
                        {normalizedInstitutions.map((institution) => (
                          <MenuItem key={institution.id} value={institution.id}>
                            {institution.label}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        select
                        label="Exposicion"
                        value={formData.exhibition}
                        onChange={(event) => setField("exhibition", event.target.value)}
                        fullWidth
                        required
                        error={Boolean(fieldErrors.exhibition)}
                        helperText={fieldErrors.exhibition || ""}
                      >
                        <MenuItem value="">Selecciona una exposicion</MenuItem>
                        {filteredExhibitions.map((exhibition) => (
                          <MenuItem key={exhibition.id} value={exhibition.id}>
                            {exhibition.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Stack>

                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <TextField
                        label="Fecha inicio"
                        type="date"
                        value={formData.exhibition_date_start}
                        onChange={(event) =>
                          setField("exhibition_date_start", event.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                      <TextField
                        label="Fecha fin"
                        type="date"
                        value={formData.exhibition_date_end}
                        onChange={(event) => setField("exhibition_date_end", event.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Stack>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Este paso es opcional. Activa la lista de prestamo si el reporte debe quedar asociado a una institucion y exposicion.
                  </Typography>
                )}
              </Stack>
            ) : null}

            {activeStep === 2 ? (
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>Tipo de seleccion</FormLabel>
                  <RadioGroup
                    row
                    value={formData.select_type}
                    onChange={(event) => setField("select_type", event.target.value)}
                  >
                    <FormControlLabel value="custom" control={<Radio />} label="Personalizada" />
                    <FormControlLabel value="all" control={<Radio />} label="Todas" />
                    <FormControlLabel value="all_except" control={<Radio />} label="Todas excepto" />
                  </RadioGroup>
                </FormControl>

                <Typography variant="body2" color="text.secondary">
                  {pieceSelectionLabel}: {formData.pieces_ids.length}
                </Typography>

                {formData.select_type !== "all" ? (
                  <Paper variant="outlined" sx={{ overflow: "hidden" }}>
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={2}
                      sx={{ padding: 2 }}
                    >
                      <TextField
                        label="Buscar pieza"
                        value={piecesSearch}
                        onChange={(event) => {
                          setPiecesSearch(event.target.value);
                          setPiecesPage(0);
                        }}
                        fullWidth
                      />
                    </Stack>

                    {piecesError ? (
                      <Alert severity="error" sx={{ marginX: 2, marginBottom: 2 }}>
                        {piecesError}
                      </Alert>
                    ) : null}

                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell>No. inventario</TableCell>
                          <TableCell>No. catalogo</TableCell>
                          <TableCell>Titulo</TableCell>
                          <TableCell>Ubicacion</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {piecesRows.map((piece) => {
                          const checked = formData.pieces_ids.includes(String(piece._id || piece.id));
                          return (
                            <TableRow key={piece._id || piece.id} hover>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={checked}
                                  onChange={() => togglePiece(String(piece._id || piece.id))}
                                />
                              </TableCell>
                              <TableCell>{piece.inventory_number || "N/D"}</TableCell>
                              <TableCell>{piece.catalog_number || "N/D"}</TableCell>
                              <TableCell>{piece.title || "N/D"}</TableCell>
                              <TableCell>{piece.location_name || "N/D"}</TableCell>
                            </TableRow>
                          );
                        })}
                        {!piecesLoading && !piecesRows.length ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              No se encontraron piezas.
                            </TableCell>
                          </TableRow>
                        ) : null}
                      </TableBody>
                    </Table>

                    <TablePagination
                      component="div"
                      page={piecesPage}
                      count={piecesTotal}
                      onPageChange={(event, nextPage) => setPiecesPage(nextPage)}
                      rowsPerPage={piecesRowsPerPage}
                      onRowsPerPageChange={(event) => {
                        setPiecesRowsPerPage(parseInt(event.target.value, 10));
                        setPiecesPage(0);
                      }}
                      rowsPerPageOptions={[10, 20, 50]}
                      labelRowsPerPage="Filas por pagina"
                    />
                  </Paper>
                ) : (
                  <Alert severity="info">
                    El reporte se aplicara a todas las piezas. En este modo no es necesario seleccionar registros.
                  </Alert>
                )}
              </Stack>
            ) : null}

            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <Button
                type="button"
                variant="outlined"
                onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                disabled={activeStep === 0 || submitting}
              >
                Anterior
              </Button>

              <Stack direction="row" spacing={2}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate("/mnemosine/reports")}
                  disabled={submitting}
                >
                  Cancelar
                </Button>

                {activeStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))}
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="contained"
                    disabled={submitting}
                    onClick={handleSubmit}
                  >
                    {submitting ? "Guardando..." : "Guardar reporte"}
                  </Button>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      <Dialog open={templateDialogOpen} onClose={templateSaving ? undefined : () => setTemplateDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Guardar plantilla</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la plantilla"
            value={templateName}
            onChange={(event) => setTemplateName(event.target.value)}
            fullWidth
            error={Boolean(fieldErrors.template_name)}
            helperText={fieldErrors.template_name || ""}
          />
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            onClick={() => setTemplateDialogOpen(false)}
            disabled={templateSaving}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleSaveTemplate} disabled={templateSaving}>
            {templateSaving ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
