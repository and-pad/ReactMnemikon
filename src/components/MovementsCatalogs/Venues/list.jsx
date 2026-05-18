import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { API_DeleteVenue, API_RequestVenues } from "./api";
import { CatalogTable } from "../shared/CatalogTable";
import {
  canCreateMovements as canCreate,
  canDeleteMovements as canDelete,
  canEditMovements as canEdit,
} from "../../Movements/movementPermissions";

export const VenuesList = ({
  accessToken,
  refreshToken,
  permissions = [],
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [venues, setVenues] = useState([]);

  const loadVenues = async (searchValue = "") => {
    setLoading(true);
    setErrorMsg("");

    const response = await API_RequestVenues({
      accessToken,
      refreshToken,
      search: searchValue,
    });

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible cargar las sedes.");
      setLoading(false);
      return;
    }

    setVenues(response?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadVenues();
  }, [accessToken, refreshToken]);

  const hasActions = useMemo(
    () => canEdit(permissions) || canDelete(permissions),
    [permissions],
  );

  const handleDelete = async (venueId) => {
    const confirmed = window.confirm(
      "Se marcara la sede como eliminada. Deseas continuar?",
    );
    if (!confirmed) return;

    const response = await API_DeleteVenue({
      accessToken,
      refreshToken,
      venueId,
    });

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible eliminar la sede.");
      return;
    }

    await loadVenues(search);
  };

  const columns = [
    {
      id: "name",
      label: "Nombre",
      render: (venue) => venue.name || "N/D",
    },
    {
      id: "institution_name",
      label: "Institucion",
      render: (venue) => venue.institution_name || "N/D",
    },
    {
      id: "contact_name",
      label: "Contacto",
      render: (venue) => venue.contact_name || "N/D",
    },
  ];

  if (hasActions) {
    columns.push({
      id: "actions",
      label: "Acciones",
      align: "center",
      render: (venue) => (
        <>
          {canEdit(permissions) ? (
            <Tooltip title="Editar">
              <IconButton
                onClick={() =>
                  navigate(`/mnemosine/movements/venues/edit/${venue._id || venue.id}`)
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
                onClick={() => handleDelete(venue._id || venue.id)}
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
      title="Sedes"
      search={search}
      onSearchChange={setSearch}
      onSearchSubmit={loadVenues}
      createLabel="Nueva sede"
      onCreate={() => navigate("/mnemosine/movements/venues/new")}
      canCreate={canCreate(permissions)}
      errorMsg={errorMsg}
      loading={loading}
      emptyMessage="No se encontraron sedes."
      columns={columns}
      rows={venues}
    />
  );
};
