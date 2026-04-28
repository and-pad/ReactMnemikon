import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { API_DeleteExhibition, API_RequestExhibitions } from "./api";
import { CatalogTable } from "../shared/CatalogTable";

const canCreate = (permissions) => permissions?.includes("agregar_movimientos");
const canEdit = (permissions) => permissions?.includes("editar_movimientos");
const canDelete = (permissions) => permissions?.includes("eliminar_movimientos");

export const ExhibitionsList = ({
  accessToken,
  refreshToken,
  permissions = [],
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [exhibitions, setExhibitions] = useState([]);

  const loadExhibitions = async (searchValue = "") => {
    setLoading(true);
    setErrorMsg("");

    const response = await API_RequestExhibitions({
      accessToken,
      refreshToken,
      search: searchValue,
    });

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible cargar las exposiciones.");
      setLoading(false);
      return;
    }

    setExhibitions(response?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadExhibitions();
  }, [accessToken, refreshToken]);

  const hasActions = useMemo(
    () => canEdit(permissions) || canDelete(permissions),
    [permissions],
  );

  const handleDelete = async (exhibitionId) => {
    const confirmed = window.confirm(
      "Se marcara la exposicion como eliminada. Deseas continuar?",
    );
    if (!confirmed) return;

    const response = await API_DeleteExhibition({
      accessToken,
      refreshToken,
      exhibitionId,
    });

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible eliminar la exposicion.");
      return;
    }

    await loadExhibitions(search);
  };

  const columns = [
    {
      id: "name",
      label: "Nombre",
      render: (exhibition) => exhibition.name || "N/D",
    },
    {
      id: "institution_name",
      label: "Institucion",
      render: (exhibition) => exhibition.institution_name || "N/D",
    },
    {
      id: "contact_name",
      label: "Contacto",
      render: (exhibition) => exhibition.contact_name || "N/D",
    },
  ];

  if (hasActions) {
    columns.push({
      id: "actions",
      label: "Acciones",
      align: "center",
      render: (exhibition) => (
        <>
          {canEdit(permissions) ? (
            <Tooltip title="Editar">
              <IconButton
                onClick={() =>
                  navigate(
                    `/mnemosine/movements/exhibitions/edit/${exhibition._id || exhibition.id}`,
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
                onClick={() => handleDelete(exhibition._id || exhibition.id)}
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
      title="Exposiciones"
      search={search}
      onSearchChange={setSearch}
      onSearchSubmit={loadExhibitions}
      createLabel="Nueva exposicion"
      onCreate={() => navigate("/mnemosine/movements/exhibitions/new")}
      canCreate={canCreate(permissions)}
      errorMsg={errorMsg}
      loading={loading}
      emptyMessage="No se encontraron exposiciones."
      columns={columns}
      rows={exhibitions}
    />
  );
};
