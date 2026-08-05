import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { CatalogTable } from "../../MovementsCatalogs/shared/CatalogTable";
import {
  API_CreateRole,
  API_RequestRolesAdmin,
  API_RequestUserRoleAccess,
  API_UpdateRolePermissions,
  API_UpdateUserRoleAccess,
} from "./api";
import { normalizePermissionSelection, PermissionMatrix } from "./permissionMatrix";

const RolesModuleNav = () => (
  <Paper elevation={2} sx={{ padding: 2, marginBottom: 3 }}>
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", md: "center" }}
    >
      <Typography variant="h5">Roles de usuario</Typography>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
        <Button
          component={Link}
          to="/mnemosine/administration/user_manage/roles"
          variant="outlined"
        >
          Roles y permisos
        </Button>
        <Button
          component={Link}
          to="/mnemosine/administration/user_manage/roles/users"
          variant="outlined"
        >
          Accesos por usuario
        </Button>
      </Stack>
    </Stack>
  </Paper>
);

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

const RoleCreateForm = ({ accessToken, refreshToken, onCreated }) => {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const response = await API_CreateRole({
      accessToken,
      refreshToken,
      payload: {
        name,
        guard_name: "web",
      },
    });

    setSubmitting(false);

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible crear el rol.");
      return;
    }

    setName("");
    onCreated?.();
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Nuevo rol
      </Typography>
      {errorMsg ? (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {errorMsg}
        </Alert>
      ) : null}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Nombre"
            value={name}
            onChange={(event) => setName(event.target.value)}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" disabled={submitting}>
            Crear rol
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

const RoleCard = ({
  accessToken,
  refreshToken,
  role,
  permissionGroups,
  onSaved,
}) => {
  const [selectedIds, setSelectedIds] = useState(role.permission_ids || []);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setSelectedIds(role.permission_ids || []);
  }, [role.permission_ids]);

  const handleSave = async () => {
    setSubmitting(true);
    setErrorMsg("");

    const response = await API_UpdateRolePermissions({
      accessToken,
      refreshToken,
      roleId: role.id_str || role._id,
      permissionIds: selectedIds,
    });

    setSubmitting(false);

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible actualizar el rol.");
      return;
    }

    onSaved?.();
  };

  return (
    <Box sx={{ marginBottom: 2 }}>
      {errorMsg ? (
        <Alert severity="error" sx={{ marginBottom: 1 }}>
          {errorMsg}
        </Alert>
      ) : null}
      <PermissionMatrix
        title={`Permisos de ${role.name}`}
        subtitle={`Guard: ${role.guard_name || "web"}`}
        permissionGroups={permissionGroups}
        selectedIds={selectedIds}
        disabled={role.name === "Administrador"}
        onChange={setSelectedIds}
      />
      {role.name !== "Administrador" ? (
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
          <Button variant="contained" disabled={submitting} onClick={handleSave}>
            Guardar permisos de {role.name}
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

export const RolesAdminPage = ({ accessToken, refreshToken }) => {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [roles, setRoles] = useState([]);
  const [permissionGroups, setPermissionGroups] = useState([]);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");

    const response = await API_RequestRolesAdmin({ accessToken, refreshToken });
    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible cargar la administracion de roles.");
      setLoading(false);
      return;
    }

    setRoles(response?.roles || []);
    setPermissionGroups(response?.permission_groups || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [accessToken, refreshToken]);

  if (loading) return <LoadingState label="Cargando administracion de roles..." />;
  if (errorMsg) return <ErrorState message={errorMsg} />;

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 2 }}>
      <RolesModuleNav />
      <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 3 }}>
        Esta vista concentra solo la administracion de roles y permisos heredada de Laravel,
        manteniendo la estructura Mongo actual.
      </Typography>

      <RoleCreateForm
        accessToken={accessToken}
        refreshToken={refreshToken}
        onCreated={loadData}
      />

      <Stack spacing={1} sx={{ marginBottom: 3 }}>
        {roles.map((role) => (
          <RoleCard
            key={role.id_str || role._id}
            accessToken={accessToken}
            refreshToken={refreshToken}
            role={role}
            permissionGroups={permissionGroups}
            onSaved={loadData}
          />
        ))}
      </Stack>
    </Box>
  );
};

export const UsersRoleAccessListPage = ({ accessToken, refreshToken }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");

    const response = await API_RequestRolesAdmin({ accessToken, refreshToken });
    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible cargar los accesos por usuario.");
      setLoading(false);
      return;
    }

    setUsers(response?.users || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [accessToken, refreshToken]);

  const filteredUsers = useMemo(() => {
    const query = (search || "").trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) =>
      [user.username, user.email, ...(user.role_names || [])]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [search, users]);

  const userColumns = [
    {
      id: "username",
      label: "Usuario",
      render: (user) => user.username || "N/D",
    },
    {
      id: "email",
      label: "Correo",
      render: (user) => user.email || "N/D",
    },
    {
      id: "roles",
      label: "Roles",
      render: (user) =>
        user.role_names?.length ? user.role_names.join(", ") : "Sin roles",
    },
    {
      id: "direct_permissions",
      label: "Permisos extra",
      render: (user) =>
        user.direct_permission_names?.length
          ? `${user.direct_permission_names.length} asignados`
          : "Sin permisos extra",
    },
    {
      id: "actions",
      label: "Acciones",
      render: (user) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            navigate(
              `/mnemosine/administration/user_manage/roles/users/${user.id_str || user._id}`,
            )
          }
        >
          Editar accesos
        </Button>
      ),
    },
  ];

  if (loading) return <LoadingState label="Cargando accesos por usuario..." />;
  if (errorMsg) return <ErrorState message={errorMsg} />;

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 2 }}>
      <RolesModuleNav />
      <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 3 }}>
        Esta vista separa la asignacion de roles y permisos extra por usuario del manejo
        de permisos base por rol.
      </Typography>

      <CatalogTable
        title="Accesos por usuario"
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={() => {}}
        createLabel=""
        onCreate={() => {}}
        canCreate={false}
        errorMsg=""
        loading={false}
        emptyMessage="No se encontraron usuarios."
        columns={userColumns}
        rows={filteredUsers}
      />
    </Box>
  );
};

export const UserRoleAccessEditPage = ({ accessToken, refreshToken }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [saveError, setSaveError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissionGroups, setPermissionGroups] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    let active = true;

    API_RequestUserRoleAccess({
      accessToken,
      refreshToken,
      userId: id,
    }).then((response) => {
      if (!active) return;

      if (!response || response?.error) {
        setErrorMsg(response?.error || "No fue posible cargar los accesos del usuario.");
        setLoading(false);
        return;
      }

      setUser(response?.user || null);
      setRoles(response?.roles || []);
      setPermissionGroups(response?.permission_groups || []);
      setSelectedRoles(response?.user?.role_ids || []);
      setSelectedPermissions(
        normalizePermissionSelection(
          response?.permission_groups || [],
          response?.user?.direct_permission_ids || [],
        ),
      );
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, id]);

  const selectedRoleObjects = useMemo(
    () =>
      (roles || []).filter((role) =>
        (selectedRoles || []).includes(String(role._id || role.id_str)),
      ),
    [roles, selectedRoles],
  );

  const handleSave = async () => {
    setSubmitting(true);
    setSaveError("");

    const response = await API_UpdateUserRoleAccess({
      accessToken,
      refreshToken,
      userId: id,
      roleIds: selectedRoles,
      permissionIds: selectedPermissions,
    });

    setSubmitting(false);

    if (!response || response?.error) {
      setSaveError(response?.error || "No fue posible guardar los accesos del usuario.");
      return;
    }

    navigate("/mnemosine/administration/user_manage/roles");
  };

  if (loading) return <LoadingState label="Cargando accesos del usuario..." />;
  if (errorMsg) return <ErrorState message={errorMsg} />;

  return (
    <Box sx={{ maxWidth: 1100, margin: "0 auto", padding: 2 }}>
      <RolesModuleNav />
      <Paper elevation={4} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: 1 }}>
          Accesos de {user?.username || "usuario"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email || "Sin correo"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Estado: {user?.is_active ? "Activo" : "Inactivo"}
        </Typography>
      </Paper>

      {saveError ? (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {saveError}
        </Alert>
      ) : null}

      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Roles asignados
        </Typography>
        <Autocomplete
          multiple
          options={roles || []}
          value={selectedRoleObjects}
          onChange={(event, values) =>
            setSelectedRoles(values.map((role) => String(role._id || role.id_str)))
          }
          getOptionLabel={(option) => option?.name || ""}
          isOptionEqualToValue={(option, value) =>
            String(option._id || option.id_str) === String(value._id || value.id_str)
          }
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={String(option._id || option.id_str)}
                label={option.name}
              />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Roles" placeholder="Selecciona uno o mas roles" />
          )}
        />
      </Paper>

      <PermissionMatrix
        title="Permisos extra por usuario"
        subtitle="Estos permisos se guardan en user_has_permissions y complementan los obtenidos por roles."
        permissionGroups={permissionGroups}
        selectedIds={selectedPermissions}
        onChange={setSelectedPermissions}
      />

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ marginTop: 3 }}>
        <Button
          component={Link}
          to="/mnemosine/administration/user_manage/roles/users"
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button variant="contained" disabled={submitting} onClick={handleSave}>
          Guardar accesos
        </Button>
      </Stack>
    </Box>
  );
};
