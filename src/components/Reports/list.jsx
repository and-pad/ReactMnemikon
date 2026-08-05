import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { IconButton, Tooltip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { CatalogTable } from "../MovementsCatalogs/shared/CatalogTable";
import { API_DeleteReport, API_RequestReports } from "./api";
import {
  canCreateReports as canCreate,
  canDeleteReports as canDelete,
  canEditReports as canEdit,
  canViewReports as canView,
} from "./reportPermissions";

const formatReportDate = (value, userName) => {
  if (!value) return "N/D";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return userName ? `${value} por ${userName}` : String(value);
  }

  const formattedDate = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
  }).format(parsedDate);

  return userName ? `${formattedDate} por ${userName}` : formattedDate;
};

export const ReportsList = ({
  accessToken,
  refreshToken,
  permissions = [],
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [reports, setReports] = useState([]);

  const loadReports = async () => {
    setLoading(true);
    setErrorMsg("");

    const response = await API_RequestReports({ accessToken, refreshToken });

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible cargar los reportes.");
      setLoading(false);
      return;
    }

    setReports(response?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, [accessToken, refreshToken]);

  const hasActions = useMemo(
    () => canView(permissions) || canEdit(permissions) || canDelete(permissions),
    [permissions],
  );

  const filteredReports = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return reports;

    return reports.filter((report) =>
      [
        report.name,
        report.description,
        report.creator_name,
        report.updater_name,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch)),
    );
  }, [reports, search]);

  const handleDelete = async (reportId) => {
    const confirmed = window.confirm(
      "Se marcara el reporte como eliminado. Deseas continuar?",
    );
    if (!confirmed) return;

    const response = await API_DeleteReport({
      accessToken,
      refreshToken,
      reportId,
    });

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible eliminar el reporte.");
      return;
    }

    await loadReports();
  };

  const columns = [
    {
      id: "name",
      label: "Nombre del Informe",
      render: (report) => (
        <>
          {report.name || "N/D"}
          {report.lending_list ? (
            <>
              <br />
              <small style={{ float: "right" }}>Prestamo</small>
            </>
          ) : null}
        </>
      ),
    },
    {
      id: "description",
      label: "Descripcion",
      render: (report) => report.description || "N/D",
    },
    {
      id: "created_at",
      label: "Fecha de creacion",
      render: (report) =>
        formatReportDate(report.created_at, report.creator_name),
    },
    {
      id: "updated_at",
      label: "Fecha de modificacion",
      render: (report) =>
        formatReportDate(report.updated_at, report.updater_name),
    },
  ];

  if (hasActions) {
    columns.push({
      id: "actions",
      label: "Acciones",
      align: "center",
      render: (report) => (
        <>
          {canView(permissions) ? (
            <Tooltip title="Ver reporte">
              <IconButton
                onClick={() => navigate(`/mnemosine/reports/view/${report._id || report.id}`)}
              >
                <VisibilityOutlinedIcon />
              </IconButton>
            </Tooltip>
          ) : null}
          {canEdit(permissions) ? (
            <Tooltip title="Editar">
              <IconButton
                onClick={() => navigate(`/mnemosine/reports/edit/${report._id || report.id}`)}
              >
                <EditOutlinedIcon />
              </IconButton>
            </Tooltip>
          ) : null}
          {canDelete(permissions) ? (
            <Tooltip title="Eliminar">
              <IconButton
                color="error"
                onClick={() => handleDelete(report._id || report.id)}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Tooltip>
          ) : null}
        </>
      ),
    });
  }

  return (
    <CatalogTable
      title="Reportes"
      search={search}
      onSearchChange={setSearch}
      onSearchSubmit={() => {}}
      createLabel="Nuevo reporte"
      onCreate={() => navigate("/mnemosine/reports/new")}
      canCreate={canCreate(permissions)}
      errorMsg={errorMsg}
      loading={loading}
      emptyMessage="No se encontraron reportes."
      columns={columns}
      rows={filteredReports}
    />
  );
};
