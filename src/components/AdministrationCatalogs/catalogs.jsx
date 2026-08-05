import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Alert, Box, IconButton, Tooltip, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";

import { CatalogTable } from "../MovementsCatalogs/shared/CatalogTable";
import {
  API_DeleteCatalog,
  API_DeleteCatalogElement,
  API_RequestCatalog,
  API_RequestCatalogElement,
  API_RequestCatalogElements,
  API_RequestCatalogs,
} from "./api";
import { CatalogElementFormPage, CatalogFormPage } from "./forms";

const canCreate = (permissions) => permissions?.includes("agregar_catalogos");
const canEdit = (permissions) => permissions?.includes("editar_catalogos");
const canDelete = (permissions) => permissions?.includes("eliminar_catalogos");
const canView = (permissions) => permissions?.includes("ver_catalogos");

const LoadingState = ({ label }) => (
  <Box sx={{ padding: 3 }}>
    <Typography>{label}</Typography>
  </Box>
);

const ErrorState = ({ message }) => (
  <Box sx={{ padding: 3 }}>
    <Alert severity="error">{message}</Alert>
  </Box>
);

export const CatalogsList = ({
  accessToken,
  refreshToken,
  permissions = [],
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [catalogs, setCatalogs] = useState([]);

  const loadCatalogs = async (searchValue = "") => {
    setLoading(true);
    setErrorMsg("");

    const response = await API_RequestCatalogs({
      accessToken,
      refreshToken,
      search: searchValue,
    });

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible cargar los catalogos.");
      setLoading(false);
      return;
    }

    setCatalogs(response?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadCatalogs();
  }, [accessToken, refreshToken]);

  const hasActions = useMemo(
    () => canView(permissions) || canEdit(permissions) || canDelete(permissions),
    [permissions],
  );

  const handleDelete = async (catalogId) => {
    const confirmed = window.confirm(
      "Se marcara el catalogo como eliminado. Deseas continuar?",
    );
    if (!confirmed) return;

    const response = await API_DeleteCatalog({
      accessToken,
      refreshToken,
      catalogId,
    });

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible eliminar el catalogo.");
      return;
    }

    await loadCatalogs(search);
  };

  const columns = [
    {
      id: "title",
      label: "Titulo",
      render: (catalog) => catalog.title || "N/D",
    },
    {
      id: "code",
      label: "Codigo",
      render: (catalog) => catalog.code || "N/D",
    },
    {
      id: "description",
      label: "Descripcion",
      render: (catalog) => catalog.description || "N/D",
    },
  ];

  if (hasActions) {
    columns.push({
      id: "actions",
      label: "Acciones",
      align: "center",
      render: (catalog) => (
        <>
          {canView(permissions) ? (
            <Tooltip title="Ver elementos">
              <IconButton
                onClick={() =>
                  navigate(
                    `/mnemosine/administration/catalogs_manage/${catalog._id || catalog.id}/elements`,
                  )
                }
              >
                <FormatListBulletedOutlinedIcon />
              </IconButton>
            </Tooltip>
          ) : null}
          {canEdit(permissions) ? (
            <Tooltip title="Editar">
              <IconButton
                onClick={() =>
                  navigate(
                    `/mnemosine/administration/catalogs_manage/${catalog._id || catalog.id}/edit`,
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
                onClick={() => handleDelete(catalog._id || catalog.id)}
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
      title="Catalogos"
      search={search}
      onSearchChange={setSearch}
      onSearchSubmit={loadCatalogs}
      createLabel="Nuevo catalogo"
      onCreate={() => navigate("/mnemosine/administration/catalogs_manage/new")}
      canCreate={canCreate(permissions)}
      errorMsg={errorMsg}
      loading={loading}
      emptyMessage="No se encontraron catalogos."
      columns={columns}
      rows={catalogs}
    />
  );
};

export const NewCatalog = ({ accessToken, refreshToken }) => (
  <CatalogFormPage accessToken={accessToken} refreshToken={refreshToken} />
);

export const EditCatalog = ({ accessToken, refreshToken }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [catalog, setCatalog] = useState(null);

  useEffect(() => {
    let active = true;

    API_RequestCatalog({
      accessToken,
      refreshToken,
      catalogId: id,
    }).then((response) => {
      if (!active) return;

      if (!response || response?.error) {
        setErrorMsg(response?.error || "No fue posible cargar el catalogo.");
        setLoading(false);
        return;
      }

      setCatalog(response?.catalog || null);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, id]);

  if (loading) return <LoadingState label="Cargando catalogo..." />;
  if (errorMsg) return <ErrorState message={errorMsg} />;

  return (
    <CatalogFormPage
      accessToken={accessToken}
      refreshToken={refreshToken}
      mode="edit"
      catalogId={id}
      initialCatalog={catalog}
    />
  );
};

export const CatalogElementsList = ({
  accessToken,
  refreshToken,
  permissions = [],
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [catalog, setCatalog] = useState(null);
  const [elements, setElements] = useState([]);

  const loadElements = async (searchValue = "") => {
    setLoading(true);
    setErrorMsg("");

    const response = await API_RequestCatalogElements({
      accessToken,
      refreshToken,
      catalogId: id,
      search: searchValue,
    });

    if (!response || response?.error) {
      setErrorMsg(
        response?.error || "No fue posible cargar los elementos del catalogo.",
      );
      setLoading(false);
      return;
    }

    setCatalog(response?.catalog || null);
    setElements(response?.elements || []);
    setLoading(false);
  };

  useEffect(() => {
    loadElements();
  }, [accessToken, refreshToken, id]);

  const hasActions = useMemo(
    () => canEdit(permissions) || canDelete(permissions),
    [permissions],
  );

  const handleDelete = async (elementId) => {
    const confirmed = window.confirm(
      "Se marcara el elemento como eliminado. Deseas continuar?",
    );
    if (!confirmed) return;

    const response = await API_DeleteCatalogElement({
      accessToken,
      refreshToken,
      elementId,
    });

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible eliminar el elemento.");
      return;
    }

    await loadElements(search);
  };

  const columns = [
    {
      id: "title",
      label: "Titulo",
      render: (element) => element.title || "N/D",
    },
    {
      id: "code",
      label: "Codigo",
      render: (element) => element.code || "N/D",
    },
    {
      id: "description",
      label: "Descripcion",
      render: (element) => element.description || "N/D",
    },
  ];

  if (hasActions) {
    columns.push({
      id: "actions",
      label: "Acciones",
      align: "center",
      render: (element) => (
        <>
          {canEdit(permissions) ? (
            <Tooltip title="Editar">
              <IconButton
                onClick={() =>
                  navigate(
                    `/mnemosine/administration/catalogs_manage/elements/${element._id || element.id}/edit`,
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
                onClick={() => handleDelete(element._id || element.id)}
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
      title={`Elementos del catalogo ${catalog?.title || ""}`.trim()}
      search={search}
      onSearchChange={setSearch}
      onSearchSubmit={loadElements}
      createLabel="Nuevo elemento"
      onCreate={() =>
        navigate(`/mnemosine/administration/catalogs_manage/${id}/elements/new`)
      }
      canCreate={canCreate(permissions)}
      errorMsg={errorMsg}
      loading={loading}
      emptyMessage="No se encontraron elementos para este catalogo."
      columns={columns}
      rows={elements}
    />
  );
};

export const NewCatalogElement = ({ accessToken, refreshToken }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [catalog, setCatalog] = useState(null);

  useEffect(() => {
    let active = true;

    API_RequestCatalogElements({
      accessToken,
      refreshToken,
      catalogId: id,
    }).then((response) => {
      if (!active) return;

      if (!response || response?.error) {
        setErrorMsg(
          response?.error || "No fue posible cargar el catalogo padre.",
        );
        setLoading(false);
        return;
      }

      setCatalog(response?.catalog || null);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, id]);

  if (loading) return <LoadingState label="Cargando formulario..." />;
  if (errorMsg) return <ErrorState message={errorMsg} />;

  return (
    <CatalogElementFormPage
      accessToken={accessToken}
      refreshToken={refreshToken}
      catalog={catalog}
      catalogId={id}
    />
  );
};

export const EditCatalogElement = ({ accessToken, refreshToken }) => {
  const { elementId } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [catalog, setCatalog] = useState(null);
  const [element, setElement] = useState(null);

  useEffect(() => {
    let active = true;

    API_RequestCatalogElement({
      accessToken,
      refreshToken,
      elementId,
    }).then((response) => {
      if (!active) return;

      if (!response || response?.error) {
        setErrorMsg(response?.error || "No fue posible cargar el elemento.");
        setLoading(false);
        return;
      }

      setCatalog(response?.catalog || null);
      setElement(response?.element || null);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, elementId]);

  if (loading) return <LoadingState label="Cargando elemento..." />;
  if (errorMsg) return <ErrorState message={errorMsg} />;

  return (
    <CatalogElementFormPage
      accessToken={accessToken}
      refreshToken={refreshToken}
      mode="edit"
      catalog={catalog}
      catalogId={catalog?._id || catalog?.id}
      elementId={elementId}
      initialElement={element}
    />
  );
};
