import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "./Users";
import Datatable from "react-data-table-component";
//import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import InventoryTwoToneIcon from "@mui/icons-material/InventoryTwoTone";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { createTheme } from "react-data-table-component";
import { API_NewUser, API_EditUser } from "./ApiCalls";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,  
} from "@mui/material";

import  Grid from "@mui/material/Grid";

import { toastShow } from "../LocalTools/tools";
// Crear un tema personalizado

createTheme("custom-dark", {
  text: {
    primary: "#FFFFFF", // Color del texto principal
    secondary: "#FFFFFF", // Color del texto secundario
  },
  background: {
    default: "#535353", // Fondo general del modo oscuro
  },
  context: {
    background: "#383838", // Fondo del contexto (como al seleccionar filas)
    text: "#FFFFFF",
  },
  divider: {
    default: "#bababa", // Color de los divisores
  },
  button: {
    default: "#1f1f1f", // Color de botones
    hover: "#FFFFFF", // Color de hover en botones
    focus: "#757575", // Color de focus en botones
  },
  highlightOnHover: {
    default: "#c2c2c2", // Color al pasar el cursor sobre una fila
    text: "#FFFFFF",
  },
  striped: {
    default: "#5e5e5e", // Fondo de filas alternas (ajusta este valor)
    text: "#FFFFFF",
  },
});

createTheme("custom-light", {
  text: {
    primary: "#4f4f4f", // Texto principal más gris
    secondary: "#6c6c6c", // Texto secundario más gris
  },
  background: {
    default: "#E6E6E6", // Fondo general con un gris suave
  },
  context: {
    background: "#D3D3D3", // Fondo del contexto un poco más oscuro
    text: "#333333", // Texto en contexto más oscuro para contraste
  },
  divider: {
    default: "#B0B0B0", // Líneas divisorias más sutiles
  },
  button: {
    default: "#626262", // Fondo por defecto de botones
    hover: "#929292", // Hover con un gris más marcado
    focus: "#B3B3B3", // Focus en un gris medio
  },
  highlightOnHover: {
    default: "#F4F4F4", // Color al pasar el cursor sobre una fila (gris muy suave)
    text: "#333333", // Texto resaltado en gris oscuro
  },
  striped: {
    default: "#F0F0F0", // Fondo de filas alternas (gris muy suave)
    text: "#333333", // Texto en las filas alternas (gris oscuro)
  },
  buttonActive: {
    default: "#D3D3D3", // Fondo de botón activo más claro
    text: "#333333", // Texto en botón activo
  },
});

export const ActiveUsersDatatable = () => {
  const [theme, setTheme] = useState("custom-dark"); // Estado para el tema
  const [page, setPage] = useState(1); // Estado para la página actual
  const [rowsPerPage, setRowsPerPage] = useState(10); // Estado para filas por página

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === "custom-light" ? "custom-dark" : "custom-light"
    );
  };

  const { userActiveData, columns_active_users } = useData();
  console.log("check", userActiveData);

  return (
    <div className="container mb-3">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        padding={1}
        borderBottom="1px solid #ccc"
      >
        <Typography variant="h5" component="h1" fontWeight="bold">
          Usuarios Activos
        </Typography>
        <Button
          sx={{ textTransform: "none" }}
          variant="contained"
          color="primary"
          onClick={toggleTheme}
        >
          Tema
        </Button>
      </Box>

      <Datatable
        columns={columns_active_users}
        data={userActiveData.slice((page - 1) * rowsPerPage, page * rowsPerPage)} // 👈 aquí el corte
        pagination
        paginationComponentOptions={{
          rowsPerPageText: "Filas por página:",
          rangeSeparatorText: "de",
        }}
        paginationServer
        paginationTotalRows={userActiveData.length}
        paginationPerPage={rowsPerPage}
        paginationDefaultPage={page}
        onChangePage={(page) => setPage(page)}
        onChangeRowsPerPage={(newPerPage, page) => {
          setRowsPerPage(newPerPage);
          setPage(page);
        }}
        
        noDataComponent={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100px",
              color: "gray",
            }}
          >
            <InventoryTwoToneIcon sx={{ fontSize: 48, marginBottom: 1 }} />
            <Typography variant="body1">
              No hay registros para mostrar
            </Typography>
          </Box>
        }
        dense
        responsive
        striped
        highlightOnHover
        theme={theme}
      />
    </div>
  );
};

export const InactiveUsersDatatable = () => {
  const [theme, setTheme] = useState("custom-dark"); // Estado para el tema

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === "custom-light" ? "custom-dark" : "custom-light"
    );
  };

  const { userInactiveData, columns_inactive_users } = useData();

  return (
    <div className="container mb-3">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        padding={1}
        borderBottom="1px solid #ccc"
      >
        <Typography variant="h5" component="h1" fontWeight="bold">
          Usuarios Inactivos
        </Typography>
        <Button
          sx={{ textTransform: "none" }}
          variant="contained"
          color="primary"
          onClick={toggleTheme}
        >
          Tema
        </Button>
      </Box>

      <Datatable
        columns={columns_inactive_users}
        data={userInactiveData}
        pagination
        dense
        responsive
        striped
        highlightOnHover
        theme={theme}
      />
    </div>
  );
};

export const CreateUserForm = ({ accessToken, refreshToken }) => {
  const {
    setUserInactiveData,
    setUserActiveData,
    fetchUsers,
    setRoles,
    roles,
  } = useData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    NewName: "",
    NewEmail: "",
    NewPassword: "",
  });
  useEffect(() => {
    setFormData({
      ...formData,
      role: 8,
    });
    /*console.log("ver", {
      ...formData,
      role: roles[0]?.name || ''
    })*/
  }, [formData]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    handleNewUser({ formData });
  };
  const handleNewUser = async ({ formData }) => {
    try {
      const data = await API_NewUser({ accessToken, refreshToken, formData });
      console.log(data);
      if (data["message"] === "new_user_added") {
        console.log("Nuevo usuario agregado");

        // Aquí puedes volver a cargar los usuarios desde la API
        fetchUsers(
          setUserActiveData,
          setUserInactiveData,
          accessToken,
          refreshToken,
          setRoles
        );
        navigate("/mnemosine/administration/user_manage/user/users_active");
      } else {
        console.error("No se pudo inactivar el usuario.");
      }
    } catch (error) {
      console.error("Error al inactivar el usuario:", error);
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "50vh", minWidth: "650px" }}
    >
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Paper
          elevation={3}
          sx={{ padding: 4, width: "450px", margin: "0 auto" ,background: "#CCCCCC"}}
          
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Crear Nuevo Usuario
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Nombre"
                name="NewName"
                variant="outlined"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
                autoComplete="off"
              />
              <TextField
                label="Nuevo Correo Electrónico"
                name="NewEmail"
                type="email"
                variant="filled"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
              />
              <TextField
                label="Contraseña"
                name="newPassword"
                type={showPassword ? "text" : "password"} // Cambia entre texto y contraseña
                variant="filled"
                fullWidth
                required
                value={formData.password}
                onChange={handleChange}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          onMouseDown={(e) => e.preventDefault()} // Previene el foco no deseado
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {/* Campo para seleccionar el Rol */}
              <FormControl fullWidth required>
                <InputLabel>Rol</InputLabel>
                <Select
                  label="Rol"
                  name="role"
                  value={formData.role || ""}
                  onChange={handleChange}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name} {/* Aquí solo renderizas el name */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
              >
                Crear Usuario
              </Button>
            </Box>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export const UserEditForm = ({ accessToken, refreshToken }) => {
  const { id } = useParams();
  const {
    userActiveData,
    setUserActiveData,
    setUserInactiveData,
    setRoles,
    roles,
    fetchUsers,
  } = useData();
  console.log("id", id);
  const userToEdit = userActiveData.find(
    (user) => user._id === id
  );
  console.log("userToEdit", userToEdit);
  const [formData, setFormData] = useState({});

  const [formDataChange, setFormDataChange] = useState({});
  const [canSave, setCanSave] = useState(false);

  const navigate = useNavigate();
  // Estado local para los campos de entrada
  useEffect(() => {
    setFormData({
      user: userToEdit?.user || "",
      email: userToEdit?.email || "",
      rol: userToEdit?.rol_w_id[0].name || "",
      rol_id: userToEdit?.rol_w_id[0].id || "",
      password: "",
    });
    console.log(
      "userToEditRol",
      userToEdit?.rol_w_id[0].id ? userToEdit.rol_w_id[0].id : "null"
    );
    setFormDataChange({
      user: userToEdit?.user || "",
      email: userToEdit?.email || "",
      password: "",
      rol: userToEdit?.rol_w_id[0].name || "",
      rol_id: userToEdit?.rol_w_id[0].id || "",
      user_id: id,
    });

  }, [userToEdit, id]);
  //El siguiente use efect es para comparar formData con formDataChange
  useEffect(() => {
    console.log("formDataChange", formDataChange);
    //compara si formDataChange es diferente a formData
    console.log(formDataChange.user, formData.user);
    if (
      formDataChange.user !== formData.user ||
      formDataChange.email !== formData.email ||
      formDataChange.password !== formData.password ||
      formDataChange.rol_id !== formData.rol_id
    ) {
      setCanSave(true);
    } else {
      setCanSave(false);
    }
  },[formDataChange, formData.user, formData.email, formData.password, formData.rol_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormDataChange((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "rol_id") {
      const rol = roles.find((role) => role.id === value);
      setFormDataChange((prevData) => ({
        ...prevData,
        rol: rol.name,
      }));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar `formData` al backend usando accessToken o refreshToken
    console.log("Formulario enviado: ", formDataChange);
    editUser({ formDataChange });
  };

  const editUser = async ({ formDataChange }) => {
    try {
      const data = await API_EditUser({
        accessToken,
        refreshToken,
        formDataChange,
      });
      console.log(data);
      if (data["response"] === "user_updated") {
        console.log("Usuario actualizado");

        // Aquí puedes volver a cargar los usuarios desde la API
        fetchUsers(
          setUserActiveData,
          setUserInactiveData,
          accessToken,
          refreshToken,
          setRoles
        );
        toastShow({
          message: `Usuario ${formDataChange.user} actualizado correctamente`,
          type: "success",
          id: `user-${id}`,
        });
        navigate("/mnemosine/administration/user_manage/user/users_active");
      } else {
        console.error("No se pudo actualizar el usuario.");
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "50vh", minWidth: "650px", marginTop: "20px" }}
    >
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Paper
          elevation={3}
          sx={{ padding: 4, width: "450px", margin: "0 auto" }}
          style={{ background: "#CCCCCC" }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Editar Usuario
          </Typography>

          {userToEdit ? (
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Nombre"
                  name="user"
                  variant="outlined"
                  fullWidth
                  value={formDataChange.user}
                  onChange={handleChange}
                  placeholder={userToEdit.user}
                />
                <TextField
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={formDataChange.email}
                  onChange={handleChange}
                  placeholder={userToEdit.email}
                />
                <TextField
                  label="Contraseña"
                  name="password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={formDataChange.password}
                  onChange={handleChange}
                  placeholder="Introduce una nueva contraseña"
                />
                {/* Campo para seleccionar el Rol */}
                <FormControl fullWidth required>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    label="Rol"
                    name="rol_id"
                    value={formDataChange.rol_id || ""}
                    onChange={handleChange}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name} {/* Aquí solo renderizas el name */}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {canSave ? (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 2 }}
                  >
                    Guardar Cambios
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 2 }}
                    disabled
                  >
                    Guardar Cambios
                  </Button>
                )}
              </Box>
            </form>
          ) : (
            <Typography variant="body1">Usuario no encontrado.</Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};
