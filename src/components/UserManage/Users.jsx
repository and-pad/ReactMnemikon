import { useState, useEffect, useContext, createContext } from 'react';
import { API_RequestUsers, API_InactiveUser, API_ActiveUser, API_DeleteUser } from './ApiCalls';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Button, IconButton, Tooltip } from '@mui/material'; // Botón de Material UI
import TransferWithinAStationRoundedIcon from '@mui/icons-material/TransferWithinAStationRounded';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastShow } from '../LocalTools/tools';

const DataContext = createContext();

export function UsersNavBar({ refreshToken, accessToken }) {


    return (
        <nav
            className="navbar navbar-expand-lg navbar-dark"
            style={{ backgroundColor: 'rgba(0, 100, 180, 0.612)' }}
        >
            <div className="container-fluid">
                <span
                    className="navbar-brand text-dark"
                    style={{ fontSize: '16px' }}
                >
                    Usuarios
                </span>

                <Button
                    variant="contained"
                    color="primary"
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown2"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </Button>

                <div className="collapse navbar-collapse" id="navbarNavDropdown2">
                    <ul className="navbar-nav" style={{ fontSize: '12px' }}>
                        <Button variant="text" color="disabled">
                            <li className="nav-item" style={{ fontSize: '11px', margin: '-5px' }}>
                                <Link
                                    to="users_active"
                                    className="nav-link text-white"
                                    aria-current="page"
                                >
                                    Usuarios activos
                                </Link>
                            </li>
                        </Button>

                        <Button variant="text" color="disabled">
                            <li className="nav-item" style={{ fontSize: '11px', margin: '-5px' }}>
                                <Link
                                    to="users_inactive"
                                    className="nav-link text-white"
                                    aria-current="page"
                                >
                                    Usuarios inactivos
                                </Link>
                            </li>
                        </Button>
                    </ul>
                </div>

                {/* Botón para agregar usuario */}
                <div style={{ marginRight: '50px' }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        style={{ marginLeft: '1rem' }}

                    >
                        <Link
                            to="new_user"
                            className="nav-link text-white"
                            aria-current="page"
                        >
                            Agregar Usuario
                        </Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
}

const fetchUsers = async (setUserActiveData, setUserInactiveData, accessToken, refreshToken, setRoles) => {
    API_RequestUsers({ accessToken, refreshToken }).then((data) => {
        const { users_active, users_inactive, roles } = data;

        // Establecer los datos en los respectivos estados
        setUserActiveData(users_active);
        setUserInactiveData(users_inactive);
        setRoles(roles);
        console.log(data);


    });
}


export function UserManageDataTable({ accessToken, refreshToken }) {
   // const [userData, setUserData] = useState([]);
    const [userActiveData, setUserActiveData] = useState([]);
    const [userInactiveData, setUserInactiveData] = useState([]);
    const [roles, setRoles] = useState([]);


/*
    const editClick = ({ _id, navigate }) => {
        navigate(`/mnemosine/administration/user_manage/$0{encodeURIComponent(_id)}/edit`)
    }
*/

    useEffect(() => {
        fetchUsers(setUserActiveData, setUserInactiveData, accessToken, refreshToken, setRoles);
    }, []);

    const columns_active_users = [
        {
            id: 'Username',
            name: 'Nombre',
            selector: row => row["user"],
            
            sortable: true,
        },
        {
            id: 'Email',
            name: 'Correo',
            selector: row => row["email"],
            
            sortable: true,
        },
        {
            id: 'Rol',
            name: 'Rol',
            selector: row => row["rol"],
            
            sortable: true,
        },

        {
            id: "Actions",
            name: "Acciones",
            selector: (row) => row["actions"],
            cell: row => <UsersActions row={row} setUserActiveData={setUserActiveData} setUserInactiveData={setUserInactiveData} accessToken={accessToken} refreshToken={refreshToken} setRoles={setRoles} />,
        },
        {
            id: '_id',
            name: 'ID',
            selector: row => row["_id"],
            omit: true,

        },


    ];

    const columns_inactive_users = [

        {
            id: 'Username',
            name: 'Nombre',
            selector: row => row["user"],
            show: true,
            sortable: true,
        },
        {
            id: 'Email',
            name: 'Correo',
            selector: row => row["email"],
            show: true,
            sortable: true,
        },
        {
            id: 'Rol',
            name: 'Rol',
            selector: row => row["rol"],
            show: true,
            sortable: true,
        },

        {
            id: "Actions",
            name: "Acciones",
            selector: (row) => row["actions"],
            cell: row => <UsersInactiveActions row={row} setUserActiveData={setUserActiveData} setUserInactiveData={setUserInactiveData} accessToken={accessToken} refreshToken={refreshToken} setRoles={setRoles} />,
        },
        {
            id: '_id',
            name: 'ID',
            selector: row => row["_id"],
            omit: true,

        },
        {
            id: 'deletable',
            name: 'Deletable',
            selector: row => row["deletable"],
            omit: true,
            cell: row => <div>{String(row["deletable"])}</div>,


        }


    ];
    return (
        <>
            <DataContext.Provider value={{ userActiveData, userInactiveData, columns_active_users, columns_inactive_users, setUserActiveData, setUserInactiveData, fetchUsers, setRoles, roles }}>
            <ToastContainer autoClose={3000} position="bottom-right" />
                <UsersNavBar accessToken={accessToken} refreshToken={refreshToken} />

                <Outlet />

            </ DataContext.Provider>

        </>
    );

}

const UserInactiveModal = ({ row, setUserActiveData, setUserInactiveData, accessToken, refreshToken, setRoles }) => {
    const { _id, user, email, rol } = row;
    //console.log("row", row);

    // Inactivar un usuario
    const handleInactivateUser = async () => {
        try {
            const data = await API_InactiveUser({ accessToken, refreshToken, user_id: _id });
            //console.log(data);
            if (data["response"] === "record_changed") {
                console.log("Usuario inactivado correctamente.");

                // Aquí puedes volver a cargar los usuarios desde la API
                fetchUsers(setUserActiveData, setUserInactiveData, accessToken, refreshToken, setRoles).then(() => {
                   toastShow({ message: `Usuario ${user} inactivado correctamente`, type: "success",  id: `user-${_id}`,
                   });
                });
            } else {
                console.error("No se pudo inactivar el usuario.");
            }
        } catch (error) {
            console.error("Error al inactivar el usuario:", error);
        }
    };

    return (
        <>
                <div className="modal fade text-dark" id={`UsersInactiveModal${_id}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Desactivar usuario</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body text-center">
                                <p>
                                    Esto desactivará, pero no borrará, al siguiente usuario:
                                </p>
                                <ul className="list-unstyled">
                                    <li>
                                        <strong>Usuario:</strong> {user}
                                    </li>
                                    <li>
                                        <strong>Correo:</strong> {email}
                                    </li>
                                    <li>
                                        <strong>Rol:</strong> {rol}
                                    </li>
                                </ul>
                                <p className="mt-3">
                                    <strong>¿Estás seguro?</strong>
                                </p>
                            </div>

                            <div className="modal-footer">
                                <Button className='me-2' size="small" variant="contained" color='action' data-bs-dismiss="modal">Cerrar</Button>
                                <Button size="small" variant="contained" type="button" data-bs-dismiss="modal" onClick={() => handleInactivateUser({ _id })} >Enviar</Button>
                            </div>

                        </div>
                    </div>
                </div>
        </>

    );
}

const UsersInactiveActions = ({ row, setUserActiveData, setUserInactiveData, accessToken, refreshToken, setRoles }) => {
    const _id = row._id
    const Deletable = row.deletable;
    // Si el usuario no es deletable, no se muestra el botón de eliminar
    return (
        <>
            <div className="d-flex justify-content-around">
                <Tooltip placement='top' title="Restaurar Usuario">
                    <IconButton variant='outlined' color="primary" size="small" className=" me-1" data-bs-toggle="modal" data-bs-target={`#UsersRestoreModal${_id}`} >
                        <TransferWithinAStationRoundedIcon color="primary" style={{ borderRadius: "7px" }} sx={{ background: "blue" }} />
                    </IconButton>
                </Tooltip>
                {Deletable ?
                    <Tooltip placement='top' title="Borrar Usuario">
                        <IconButton variant="" color="error" size="small" data-bs-toggle="modal" data-bs-target={`#UsersDeleteModal${_id}`} >
                            <DeleteTwoToneIcon sx={{ color: "red", background: "#ff8686", borderRadius: "7px" }} />
                        </IconButton></Tooltip> : null}
                    <UserActiveModal row={row} setUserActiveData={setUserActiveData} setUserInactiveData={setUserInactiveData} accessToken={accessToken} refreshToken={refreshToken} setRoles={setRoles} />
                    <UserDeleteModal row={row} setUserActiveData={setUserActiveData} setUserInactiveData={setUserInactiveData} accessToken={accessToken} refreshToken={refreshToken} setRoles={setRoles} />
            </div>
        </>
    )
}

const UserDeleteModal = ({ row, setUserActiveData, setUserInactiveData, accessToken, refreshToken, setRoles }) => {
    //Deletemodal similar a UserInactiveModal, pero esta ves de borrado permanente
    const { _id, user, email, rol } = row;
    console.log("row", row);
    const user_id = _id;
    const handleDeleteUser = async () => {
        try {
            const data = await API_DeleteUser({ accessToken, refreshToken, user_id });
            console.log(data);
            if (data["response"] === "record_deleted") {
                console.log("Usuario borrado correctamente.");

                // Aquí puedes volver a cargar los usuarios desde la API
                fetchUsers(setUserActiveData, setUserInactiveData, accessToken, refreshToken, setRoles).then(() => {
                    toastShow({ message: `Usuario ${user} borrado correctamente`, type: "success",  id: `user-${_id}`});
                });
            } else {
                console.error("No se pudo borrar el usuario.");
            }
        } catch (error) {
            console.error("Error al borrar el usuario:", error);
        }
    };

    return (    

        <div className="modal fade text-dark" id={`UsersDeleteModal${_id}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Borrar usuario</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body text-center">
                        <p>
                            Esto borrará al siguiente usuario:
                        </p>
                        <ul className="list-unstyled">
                            <li>
                                <strong>Usuario:</strong> {user}
                            </li>
                            <li>
                                <strong>Correo:</strong> {email}
                            </li>
                            <li>
                                <strong>Rol:</strong> {rol}
                            </li>
                        </ul>
                        <p className="mt-3">
                            <strong>¿Estás seguro?</strong>
                        </p>
                    </div>

                    <div className="modal-footer">
                        <Button className='me-2' size="small" variant="contained" color='action' data-bs-dismiss="modal">Cerrar</Button>
                        <Button size="small" variant="contained" type="button" data-bs-dismiss="modal" onClick={() => handleDeleteUser({ _id })} >Enviar</Button>
                    </div>

                </div>
            </div>
        </div>
    );

    


}

const UsersActions = ({ row, setUserActiveData, setUserInactiveData, accessToken, refreshToken, setRoles }) => {

    const _id = row._id

    // console.log("row", _id);
    const navigate = useNavigate();


    return (
        <>
            <div >
                <Tooltip placement='top' title="Editar Usuario">

                    <IconButton variant='outlined' color="primary" size="small"   >
                        <Link to={`/mnemosine/administration/user_manage/user/${_id}/user_edit`}>
                            <ModeEditTwoToneIcon color="primary" style={{ borderRadius: "7px" }} sx={{ background: "blue" }} />
                        </Link>
                    </IconButton>
                </Tooltip>
                <Tooltip placement='top' title="Inactivar Usuario">
                    <IconButton variant="" color="error" size="small" data-bs-toggle="modal" data-bs-target={`#UsersInactiveModal${_id}`} >
                        <DeleteTwoToneIcon sx={{ color: "red", background: "#ff8686", borderRadius: "7px" }} />
                    </IconButton>
                </Tooltip>
            </div>
            
            <UserInactiveModal row={row} setUserActiveData={setUserActiveData} setUserInactiveData={setUserInactiveData} accessToken={accessToken} refreshToken={refreshToken} setRoles={setRoles} />
        </>
    );

}


const UserActiveModal = ({ row, setUserActiveData, setUserInactiveData, accessToken, refreshToken, setRoles }) => {
    const { _id, user, email, rol } = row;
    console.log("row", row);

    // Inactivar un usuario
    const handleActivateUser = async () => {
        try {
            const data = await API_ActiveUser({ accessToken, refreshToken, user_id: _id });
            console.log(data);
            if (data["response"] === "record_changed") {                

                // Aquí puedes volver a cargar los usuarios desde la API
                fetchUsers(setUserActiveData, setUserInactiveData, accessToken, refreshToken, setRoles);
                toastShow({ message: `Usuario ${user} activado correctamente`, type: "success",  id: `user-${_id}`});

            } else {
                console.error("No se pudo inactivar el usuario.");
            }
        } catch (error) {
            console.error("Error al inactivar el usuario:", error);
        }
    };

    return (

        <div className="modal fade text-dark" id={`UsersRestoreModal${_id}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Desactivar usuario</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body text-center">
                        <p>
                            Esto restaurara al sistema, al siguiente usuario:
                        </p>
                        <ul className="list-unstyled">
                            <li>
                                <strong>Usuario:</strong> {user}
                            </li>
                            <li>
                                <strong>Correo:</strong> {email}
                            </li>
                            <li>
                                <strong>Rol:</strong> {rol}
                            </li>
                        </ul>
                        <p className="mt-3">
                            <strong>¿Estás seguro?</strong>
                        </p>
                    </div>
                    
                    <div className="modal-footer">
                        <Button className='me-2' size="small" variant="contained" color='action' data-bs-dismiss="modal">Cerrar</Button>
                        <Button size="small" variant="contained" type="button" data-bs-dismiss="modal" onClick={() => handleActivateUser({ _id })} >Enviar</Button>
                    </div>
                </div>
            </div>
        </div>

    );
}

export const useData = () => useContext(DataContext);

