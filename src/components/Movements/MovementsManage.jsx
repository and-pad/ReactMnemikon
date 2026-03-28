
import { useParams, Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState, createContext, useContext, useMemo, use } from 'react';
import { Box , Typography} from "@mui/material"; // Para el contenedor estilizado
import { Button } from '@mui/material';
import InventoryTwoToneIcon from "@mui/icons-material/InventoryTwoTone";
import Datatable from 'react-data-table-component';
import { StyleSheetManager } from 'styled-components';
import  isPropValid    from '@emotion/is-prop-valid';
import { API_RequestMovements } from './APICalls';
import customStyles from "../Datatables/datatableCustomCellStyle";
import PiecesCell from './customDatatables';
import SETTINGS from '../Config/settings';

const columns_movements = [
        {
            id: 'id',
            name: 'id',
            selector: row => row["id"],
            
            sortable: true,
            //omit: true, // Esta columna no se mostrará en la tabla
        },
        {
            id: 'departure_date',
            name: 'Fecha de Salida',
            selector: row => row["departure_date"],
            
            sortable: true,
        },
        {
            id: 'exhibition',
            name: 'Ubicación / Exposición',
            selector: row => row["exhibition_name"],
            
            sortable: true,
        },

        {
            id: "institutions",
            name: "Institución(es)",
            selector: (row) => row["institution_names"],
            //cell: row => <UsersActions row={row} setUserActiveData={setUserActiveData} setUserInactiveData={setUserInactiveData} accessToken={accessToken} refreshToken={refreshToken} setRoles={setRoles} />,
        },
        /*{
            id: 'contacts',
            name: 'Responsable(s) de movimiento',
            selector: row => row["contacts"],            

        },*/
        {
            id: 'pieces',
            name: 'Piezas',
            //selector: row => row["pieces"],
            cell: row =>  <PiecesCell value={row.pieces} />,

        },
        {
          id: 'pieces_count',
          name: 'Cantidad de piezas',
          selector: row => row["pieces_count"],
          omit: true,
        },
        {
          id: 'authorized_by_movements',
          name: 'Autorizado por',
          selector: row => row["authorized_by_movements"],
          omit: true,
                },
        
        {
            id: 'actions',
            name: 'Acciones',
            //selector: row => row["actions"],  
            cell: row => <ActionsCell data={row} />, // Aquí puedes definir un componente para las acciones, como botones de editar o eliminar
        },


    ];

    const ActionsCell = ({ data }) => {
      const navigate = useNavigate();

      const handleStep = (step) => {
        if (step === "edit") {
        navigate(`/mnemosine/movements/edit/${data.id}`);
        }
        else if (step === "select-pieces") {
          navigate(`/mnemosine/movements/select-pieces/${data.id}`);
        }
        else if (step === "info") {
          navigate(`/mnemosine/movements/info/${data.id}`);
        }
        else if (step === "return-pieces") {
          navigate(`/mnemosine/movements/return-pieces/${data.id}`);
        }

      };
      console.log("Value en ActionsCell _id", data.id);
      return (
        <div>
          {/*Paso 1*/}
          { data.authorized_by_movements ? null : (
            <div style={{ display: 'flex', gap: '5px' }}>
            <Button variant="contained" color="primary" onClick={() => handleStep("edit")}>
            Paso 1:  
            Edit
            </Button>

            <Button variant="contained" color="primary" onClick={() => handleStep("select-pieces")}>
            Paso 2:
            Select pieces
            </Button>
          </div>            
          )}
          {data.pieces ? (<Button variant="contained" color="primary" onClick={() => handleStep("info")}>Paso 3: informacion Movimiento</Button> ) : null}

          {data.authorized_by_movements ? data.pieces_count > 0 ? (<Button variant="contained" color="primary" onClick={() => handleStep("return-pieces")}>Paso 4: Regresar piezas</Button> ) : null : null}

          {/* Aquí puedes agregar más botones de acción si lo deseas */}
        </div>
      );
    }

export const MovementsManage = ({ accessToken, refreshToken, permissions }) => {
const [totalRows, setTotalRows] = useState(0);
const [page, setPage] = useState(1);
const [rowsPerPage, setRowsPerPage] = useState(10);
const [pending, setPending] = useState(true);
const [filterText, setFilterText] = useState('');
const [Data, setData] = useState([]);

const [theme, setTheme] = useState("custom-dark"); // Estado para el tema


 useEffect(() => {
    API_RequestMovements({ accessToken, refreshToken, page, rowsPerPage, filterText })
      .then((data) => {
        console.log("data en useEffect", data);
        setData(data.data);
        setTotalRows(data.total);
        setPending(false);
      })
      .catch((error) => {
        console.error("Error al obtener los movimientos", error);
      });

 }, [filterText, page, rowsPerPage]); // Dependencias para recargar al cambiar página, filas por página o filtro

  const subHeaderComponentMemo = useMemo(() => {


    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Buscar movimientos"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key === 'Enter'){
              setFilterText(e.target.value);
            }
          } }
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setFilterText('')}
        >
          Limpiar
        </Button>
      </div>
    );
  }, [filterText]);
  console.log("Data en render", Data);

  return (
    <div className='container-fluid' style={{ width: "100%" }}>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/mnemosine/movements/new"
      >
        Nuevo movimiento
      </Button>
      <div>
        <StyleSheetManager shouldForwardProp={isPropValid}>
          <Datatable
            columns={columns_movements}
            data={Data} //{userActiveData.slice((page - 1) * rowsPerPage, page * rowsPerPage)} // 👈 aquí el corte
            pagination
            paginationComponentOptions={{
              rowsPerPageText: "Filas por página:",
              rangeSeparatorText: "de",
            }}
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={rowsPerPage}
            paginationDefaultPage={page}
            onChangePage={(page) => 
            {
              setPage(page)
              console.log("Page en onChangePage", page);
            }

            }
            onChangeRowsPerPage={(newPerPage, page) => {
              setRowsPerPage(newPerPage);
              setPage(page);
              console.log("Rows per page en onChangeRowsPerPage", newPerPage);
              console.log("Page en onChangeRowsPerPage", page);
            }}
            subHeader
            subHeaderComponent={subHeaderComponentMemo}

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
            customStyles={customStyles}
            theme={theme}
          />
        </StyleSheetManager>


      </div>

    </div>
  )
}