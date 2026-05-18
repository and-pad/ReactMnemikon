import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { API_DeleteInstitution, API_RequestInstitutions } from "./api";
import { CatalogTable } from "../shared/CatalogTable";
import {
  canCreateMovements as canCreate,
  canDeleteMovements as canDelete,
  canEditMovements as canEdit,
} from "../../Movements/movementPermissions";

export const InstitutionsList = ({
  accessToken,
  refreshToken,
  permissions = [],
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [institutions, setInstitutions] = useState([]);

  const loadInstitutions = async (searchValue = "") => {
    setLoading(true);
    setErrorMsg("");

    const response = await API_RequestInstitutions({
      accessToken,
      refreshToken,
      search: searchValue,
    });

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible cargar las instituciones.");
      setLoading(false);
      return;
    }

    setInstitutions(response?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadInstitutions();
  }, [accessToken, refreshToken]);

  const hasActions = useMemo(
    () => canEdit(permissions) || canDelete(permissions),
    [permissions],
  );

  const handleDelete = async (institutionId) => {
    const confirmed = window.confirm(
      "Se marcara la institucion como eliminada. Deseas continuar?",
    );

    if (!confirmed) return;

    const response = await API_DeleteInstitution({
      accessToken,
      refreshToken,
      institutionId,
    });

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible eliminar la institucion.");
      return;
    }

    await loadInstitutions(search);
  };

  const columns = [
    {
      id: "name",
      label: "Nombre",
      render: (institution) => institution.name || "N/D",
    },
    {
      id: "address",
      label: "Direccion",
      render: (institution) => institution.address || "N/D",
    },
    {
      id: "city",
      label: "Ciudad",
      render: (institution) => institution.city || "N/D",
    },
    {
      id: "phone",
      label: "Telefono",
      render: (institution) => institution.phone || "N/D",
    },
  ];

  if (hasActions) {
    columns.push({
      id: "actions",
      label: "Acciones",
      align: "center",
      render: (institution) => (
        <>
          {canEdit(permissions) ? (
            <Tooltip title="Editar">
              <IconButton
                onClick={() =>
                  navigate(
                    `/mnemosine/movements/institutions/edit/${institution._id || institution.id}`,
                  )
                }
              >
                <EditOutlinedIcon />
              </IconButton>
            </Tooltip>
          ) : null}
          {canDelete(permissions) ? (
            <Tooltip title="Eliminar">
              <IconButton
                color="error"
                onClick={() => handleDelete(institution._id || institution.id)}
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
      title="Instituciones"
      search={search}
      onSearchChange={setSearch}
      onSearchSubmit={loadInstitutions}
      createLabel="Nueva institucion"
      onCreate={() => navigate("/mnemosine/movements/institutions/new")}
      canCreate={canCreate(permissions)}
      errorMsg={errorMsg}
      loading={loading}
      emptyMessage="No se encontraron instituciones."
      columns={columns}
      rows={institutions}
    />
  );
};
