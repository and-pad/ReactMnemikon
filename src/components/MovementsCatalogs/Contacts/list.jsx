import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { API_DeleteContact, API_RequestContacts } from "./api";
import { CatalogTable } from "../shared/CatalogTable";

const canCreate = (permissions) => permissions?.includes("agregar_movimientos");
const canEdit = (permissions) => permissions?.includes("editar_movimientos");
const canDelete = (permissions) => permissions?.includes("eliminar_movimientos");

const getContactFullName = (contact) =>
  [
    contact?.name,
    contact?.last_name,
    contact?.m_last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || "N/D";

export const ContactsList = ({
  accessToken,
  refreshToken,
  permissions = [],
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [contacts, setContacts] = useState([]);

  const loadContacts = async (searchValue = "") => {
    setLoading(true);
    setErrorMsg("");

    const response = await API_RequestContacts({
      accessToken,
      refreshToken,
      search: searchValue,
    });

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible cargar los contactos.");
      setLoading(false);
      return;
    }

    setContacts(response?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadContacts();
  }, [accessToken, refreshToken]);

  const hasActions = useMemo(
    () => canEdit(permissions) || canDelete(permissions),
    [permissions],
  );

  const handleDelete = async (contactId) => {
    const confirmed = window.confirm(
      "Se marcara el contacto como eliminado. Deseas continuar?",
    );
    if (!confirmed) return;

    const response = await API_DeleteContact({
      accessToken,
      refreshToken,
      contactId,
    });

    if (!response || response?.error) {
      setErrorMsg(response?.error || "No fue posible eliminar el contacto.");
      return;
    }

    await loadContacts(search);
  };

  const columns = [
    {
      id: "name",
      label: "Nombre",
      render: (contact) => getContactFullName(contact),
    },
    {
      id: "phone",
      label: "Telefono",
      render: (contact) => contact.phone || "N/D",
    },
    {
      id: "email",
      label: "Correo",
      render: (contact) => contact.email || "N/D",
    },
    {
      id: "institution_name",
      label: "Institucion",
      render: (contact) => contact.institution_name || "N/D",
    },
  ];

  if (hasActions) {
    columns.push({
      id: "actions",
      label: "Acciones",
      align: "center",
      render: (contact) => (
        <>
          {canEdit(permissions) ? (
            <Tooltip title="Editar">
              <IconButton
                onClick={() =>
                  navigate(
                    `/mnemosine/movements/contacts/edit/${contact._id || contact.id}`,
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
                onClick={() => handleDelete(contact._id || contact.id)}
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
      title="Contactos"
      search={search}
      onSearchChange={setSearch}
      onSearchSubmit={loadContacts}
      createLabel="Nuevo contacto"
      onCreate={() => navigate("/mnemosine/movements/contacts/new")}
      canCreate={canCreate(permissions)}
      errorMsg={errorMsg}
      loading={loading}
      emptyMessage="No se encontraron contactos."
      columns={columns}
      rows={contacts}
    />
  );
};
