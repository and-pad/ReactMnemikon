import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, IconButton, Tooltip, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";

import { CatalogTable } from "../MovementsCatalogs/shared/CatalogTable";
import {
  API_DeleteGender,
  API_DeleteSubgender,
  API_RequestGender,
  API_RequestGenders,
  API_RequestSubgender,
  API_RequestSubgenders,
} from "./api";
import { GenderFormPage, SubgenderFormPage } from "./forms";

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

export const GendersList = ({
  accessToken,
  refreshToken,
  permissions = [],
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [genders, setGenders] = useState([]);

  const loadGenders = async (searchValue = "") => {
    setLoading(true);
    setErrorMsg("");

    const response = await API_RequestGenders({
      accessToken,
      refreshToken,
      search: searchValue,
    });

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible cargar los generos.");
      setLoading(false);
      return;
    }

    setGenders(response?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadGenders();
  }, [accessToken, refreshToken]);

  const hasActions = useMemo(
    () => canView(permissions) || canEdit(permissions) || canDelete(permissions),
    [permissions],
  );

  const handleDelete = async (genderId) => {
    const confirmed = window.confirm(
      "Se marcara el genero como eliminado. Deseas continuar?",
    );
    if (!confirmed) return;

    const response = await API_DeleteGender({
      accessToken,
      refreshToken,
      genderId,
    });

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible eliminar el genero.");
      return;
    }

    await loadGenders(search);
  };

  const columns = [
    {
      id: "title",
      label: "Titulo",
      render: (gender) => gender.title || "N/D",
    },
    {
      id: "description",
      label: "Descripcion",
      render: (gender) => gender.description || "N/D",
    },
  ];

  if (hasActions) {
    columns.push({
      id: "actions",
      label: "Acciones",
      align: "center",
      render: (gender) => (
        <>
          {canView(permissions) ? (
            <Tooltip title="Ver subgeneros">
              <IconButton
                onClick={() =>
                  navigate(
                    `/mnemosine/administration/catalog_genders/${gender._id || gender.id}/subgenders`,
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
                    `/mnemosine/administration/catalog_genders/${gender._id || gender.id}/edit`,
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
                onClick={() => handleDelete(gender._id || gender.id)}
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
      title="Generos"
      search={search}
      onSearchChange={setSearch}
      onSearchSubmit={loadGenders}
      createLabel="Nuevo genero"
      onCreate={() => navigate("/mnemosine/administration/catalog_genders/new")}
      canCreate={canCreate(permissions)}
      errorMsg={errorMsg}
      loading={loading}
      emptyMessage="No se encontraron generos."
      columns={columns}
      rows={genders}
    />
  );
};

export const NewGender = ({ accessToken, refreshToken }) => (
  <GenderFormPage accessToken={accessToken} refreshToken={refreshToken} />
);

export const EditGender = ({ accessToken, refreshToken }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [gender, setGender] = useState(null);

  useEffect(() => {
    let active = true;

    API_RequestGender({
      accessToken,
      refreshToken,
      genderId: id,
    }).then((response) => {
      if (!active) return;

      if (!response || response?.error) {
        setErrorMsg(response?.error || "No fue posible cargar el genero.");
        setLoading(false);
        return;
      }

      setGender(response?.gender || null);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, id]);

  if (loading) return <LoadingState label="Cargando genero..." />;
  if (errorMsg) return <ErrorState message={errorMsg} />;

  return (
    <GenderFormPage
      accessToken={accessToken}
      refreshToken={refreshToken}
      mode="edit"
      genderId={id}
      initialGender={gender}
    />
  );
};

export const SubgendersList = ({
  accessToken,
  refreshToken,
  permissions = [],
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [gender, setGender] = useState(null);
  const [subgenders, setSubgenders] = useState([]);

  const loadSubgenders = async (searchValue = "") => {
    setLoading(true);
    setErrorMsg("");

    const response = await API_RequestSubgenders({
      accessToken,
      refreshToken,
      genderId: id,
      search: searchValue,
    });

    if (!response || response?.error) {
      setErrorMsg(
        response?.error || "No fue posible cargar los subgeneros del genero.",
      );
      setLoading(false);
      return;
    }

    setGender(response?.gender || null);
    setSubgenders(response?.subgenders || []);
    setLoading(false);
  };

  useEffect(() => {
    loadSubgenders();
  }, [accessToken, refreshToken, id]);

  const hasActions = useMemo(
    () => canEdit(permissions) || canDelete(permissions),
    [permissions],
  );

  const handleDelete = async (subgenderId) => {
    const confirmed = window.confirm(
      "Se marcara el subgenero como eliminado. Deseas continuar?",
    );
    if (!confirmed) return;

    const response = await API_DeleteSubgender({
      accessToken,
      refreshToken,
      subgenderId,
    });

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible eliminar el subgenero.");
      return;
    }

    await loadSubgenders(search);
  };

  const columns = [
    {
      id: "title",
      label: "Titulo",
      render: (subgender) => subgender.title || "N/D",
    },
    {
      id: "description",
      label: "Descripcion",
      render: (subgender) => subgender.description || "N/D",
    },
  ];

  if (hasActions) {
    columns.push({
      id: "actions",
      label: "Acciones",
      align: "center",
      render: (subgender) => (
        <>
          {canEdit(permissions) ? (
            <Tooltip title="Editar">
              <IconButton
                onClick={() =>
                  navigate(
                    `/mnemosine/administration/catalog_genders/subgenders/${subgender._id || subgender.id}/edit`,
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
                onClick={() => handleDelete(subgender._id || subgender.id)}
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
      title={`Subgeneros de ${gender?.title || ""}`.trim()}
      search={search}
      onSearchChange={setSearch}
      onSearchSubmit={loadSubgenders}
      createLabel="Nuevo subgenero"
      onCreate={() =>
        navigate(`/mnemosine/administration/catalog_genders/${id}/subgenders/new`)
      }
      canCreate={canCreate(permissions)}
      errorMsg={errorMsg}
      loading={loading}
      emptyMessage="No se encontraron subgeneros para este genero."
      columns={columns}
      rows={subgenders}
    />
  );
};

export const NewSubgender = ({ accessToken, refreshToken }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [gender, setGender] = useState(null);

  useEffect(() => {
    let active = true;

    API_RequestSubgenders({
      accessToken,
      refreshToken,
      genderId: id,
    }).then((response) => {
      if (!active) return;

      if (!response || response?.error) {
        setErrorMsg(response?.error || "No fue posible cargar el genero padre.");
        setLoading(false);
        return;
      }

      setGender(response?.gender || null);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, id]);

  if (loading) return <LoadingState label="Cargando formulario..." />;
  if (errorMsg) return <ErrorState message={errorMsg} />;

  return (
    <SubgenderFormPage
      accessToken={accessToken}
      refreshToken={refreshToken}
      gender={gender}
      genderId={id}
    />
  );
};

export const EditSubgender = ({ accessToken, refreshToken }) => {
  const { subgenderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [gender, setGender] = useState(null);
  const [subgender, setSubgender] = useState(null);

  useEffect(() => {
    let active = true;

    API_RequestSubgender({
      accessToken,
      refreshToken,
      subgenderId,
    }).then((response) => {
      if (!active) return;

      if (!response || response?.error) {
        setErrorMsg(response?.error || "No fue posible cargar el subgenero.");
        setLoading(false);
        return;
      }

      setGender(response?.gender || null);
      setSubgender(response?.subgender || null);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, subgenderId]);

  if (loading) return <LoadingState label="Cargando subgenero..." />;
  if (errorMsg) return <ErrorState message={errorMsg} />;

  return (
    <SubgenderFormPage
      accessToken={accessToken}
      refreshToken={refreshToken}
      mode="edit"
      gender={gender}
      genderId={gender?._id || gender?.id}
      subgenderId={subgenderId}
      initialSubgender={subgender}
    />
  );
};
